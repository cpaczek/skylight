#!/usr/bin/env bash
# Run ON the Raspberry Pi (over SSH) to install the full appliance:
#   rtl-sdr-blog driver + DVB-T blacklist, dump1090-fa, Node + pnpm, this app
#   (built), and the skylight-server systemd service.
# Kiosk autostart is set up separately by setup-kiosk.sh (needs the desktop).
set -euo pipefail

APPDIR="${APPDIR:-$HOME/skylight}"
USER_NAME="$(id -un)"

# 64-bit userland required: NodeSource ships no armhf packages (Node would
# fail to install mid-run with "Unsupported architecture: armhf", #26).
# A 64-bit kernel with 32-bit userland still reports armhf here — what
# matters is the OS image, not the chip.
ARCH="$(dpkg --print-architecture 2>/dev/null || uname -m)"
case "$ARCH" in
  arm64|aarch64|amd64|x86_64) ;;
  *)
    echo "ERROR: unsupported architecture '$ARCH'." >&2
    echo "Skylight needs a 64-bit OS (Node.js has no 32-bit ARM builds)." >&2
    echo "Re-flash with Raspberry Pi OS (64-bit) — Pi 3/4/5 and Zero 2 W all support it." >&2
    exit 1
    ;;
esac
# Receiver position for dump1090 - optional, and there is deliberately no
# default. dump1090 discards every position more than 300 NM from the location
# it is given, so a wrong one (this used to fall back to SFO) leaves aircraft
# with no lat/lon anywhere else: counted in /control, never drawn (#66). Set
# both to your location for a faster first fix; the display's own location is
# set separately in /control.
LAT="${LAT:-}"
LON="${LON:-}"
if { [ -n "$LAT" ] && [ -z "$LON" ]; } || { [ -z "$LAT" ] && [ -n "$LON" ]; }; then
  echo "ERROR: set both LAT and LON, or neither." >&2
  exit 1
fi

echo "==> apt update + base packages"
sudo apt-get update
sudo apt-get install -y git build-essential cmake libusb-1.0-0-dev pkg-config \
  libncurses-dev unclutter usbutils

# Where aircraft come from. "radio" = an RTL-SDR plugged into this Pi, decoded
# locally; "api" = the free adsb.fi aggregator over the internet (no hardware).
# Auto-detected when not given: any RTL2832U-based dongle on USB (RTL-SDR Blog,
# FlightAware Pro Stick, Nooelec, generics all enumerate as 0bda:2838/2832)
# means radio. Override with DATA_SOURCE=radio|api. Re-running the installer
# after plugging in a radio switches an api install over.
DATA_SOURCE="${DATA_SOURCE:-}"
if [ -z "$DATA_SOURCE" ]; then
  if lsusb 2>/dev/null | grep -qiE "0bda:(2838|2832)"; then
    DATA_SOURCE=radio
  else
    DATA_SOURCE=api
  fi
  echo "==> No DATA_SOURCE given; detected: $DATA_SOURCE$([ "$DATA_SOURCE" = api ] && echo ' (no RTL-SDR found on USB)')"
fi
case "$DATA_SOURCE" in
  radio|api) ;;
  *) echo "ERROR: DATA_SOURCE must be 'radio' or 'api' (got '$DATA_SOURCE')." >&2; exit 1 ;;
esac

if [ "$DATA_SOURCE" = radio ]; then
echo "==> RTL-SDR Blog driver (works with V3/V4/V5, FlightAware Pro Stick, Nooelec, generic RTL2832U)"
if ! command -v rtl_test >/dev/null 2>&1; then
  SRC=/tmp/rtl-sdr-blog
  rm -rf "$SRC"
  git clone --depth 1 https://github.com/rtlsdrblog/rtl-sdr-blog "$SRC"
  cmake -S "$SRC" -B "$SRC/build" -DINSTALL_UDEV_RULES=ON -DDETACH_KERNEL_DRIVER=ON
  make -C "$SRC/build" -j"$(nproc)"
  sudo make -C "$SRC/build" install
  sudo ldconfig
fi
echo "==> Blacklisting stock DVB-T modules"
sudo mkdir -p /etc/modprobe.d
sudo tee /etc/modprobe.d/blacklist-rtlsdr.conf >/dev/null <<'EOF'
blacklist dvb_usb_rtl28xxu
blacklist rtl2832
blacklist rtl2830
blacklist rtl2838
blacklist dvb_usb_v2
EOF
sudo udevadm control --reload-rules && sudo udevadm trigger || true
sudo modprobe -r dvb_usb_rtl28xxu 2>/dev/null || true

echo "==> dump1090-fa (FlightAware decoder, aircraft.json on :8080)"
if ! command -v dump1090-fa >/dev/null 2>&1; then
  # FlightAware publishes a piaware/dump1090 apt repo; build from source as a
  # portable fallback that also serves JSON via lighttpd-free --write-json.
  SRC=/tmp/dump1090-fa
  rm -rf "$SRC"
  git clone --depth 1 https://github.com/flightaware/dump1090 "$SRC"
  make -C "$SRC" RTLSDR=yes
  sudo install -m755 "$SRC/dump1090" /usr/local/bin/dump1090-fa
fi
# Our source build lives in /usr/local/bin; a packaged dump1090-fa (PiAware)
# brings its own service and web server, so that one is left alone. The units
# are rewritten on every run, so re-running the installer applies a new
# LAT/LON and repairs an older install.
if [ -x /usr/local/bin/dump1090-fa ]; then
  LOCATION_ARGS=""
  if [ -n "$LAT" ]; then
    LOCATION_ARGS="--lat $LAT --lon $LON "
  fi
  # Minimal service: decode + write JSON where the tracker server expects it.
  sudo mkdir -p /run/dump1090-fa
  sudo tee /etc/systemd/system/dump1090-fa.service >/dev/null <<EOF
[Unit]
Description=dump1090-fa ADS-B decoder
After=network.target
[Service]
ExecStartPre=/bin/mkdir -p /run/dump1090-fa
ExecStart=/usr/local/bin/dump1090-fa --device-type rtlsdr ${LOCATION_ARGS}--write-json /run/dump1090-fa --write-json-every 1 --quiet
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
  # Serve /run/dump1090-fa on :8080 via a tiny static server. The data symlink
  # puts the files at /data/aircraft.json - where dump1090's own web server has
  # them and where Skylight looks by default - as well as at /aircraft.json,
  # which installs from before the default changed still point at.
  sudo tee /etc/systemd/system/dump1090-json.service >/dev/null <<EOF
[Unit]
Description=Serve dump1090 aircraft.json on :8080
After=dump1090-fa.service
[Service]
ExecStartPre=/bin/mkdir -p /run/dump1090-fa
ExecStartPre=/bin/ln -sfn . /run/dump1090-fa/data
ExecStart=/usr/bin/python3 -m http.server 8080 --directory /run/dump1090-fa
Restart=always
RestartSec=2
[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable dump1090-fa.service dump1090-json.service
  sudo systemctl restart dump1090-fa.service dump1090-json.service
fi
else
  echo "==> api source: skipping the RTL-SDR driver and decoder (re-run with a radio plugged in to add them)"
fi

echo "==> Node.js + pnpm (via corepack)"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo corepack enable
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack prepare pnpm@10.28.2 --activate

echo "==> Build the app"
cd "$APPDIR"
pnpm install
pnpm build

echo "==> skylight-server systemd service"
PNPM_BIN="$(command -v pnpm)"
sudo sed \
  -e "s#__USER__#$USER_NAME#g" \
  -e "s#__APPDIR__#$APPDIR#g" \
  -e "s#__PNPM__#$PNPM_BIN#g" \
  -e "s#__DATA_SOURCE__#$DATA_SOURCE#g" \
  "$APPDIR/pi-setup/skylight-server.service" \
  | sudo tee /etc/systemd/system/skylight-server.service >/dev/null
sudo systemctl daemon-reload
sudo systemctl enable --now skylight-server.service

# Give the Pi a predictable name so the phone URL is always
# http://skylight.local:3000/control, whichever way the card was prepared.
# Only the stock name is replaced; a name the owner chose is left alone.
if command -v raspi-config >/dev/null 2>&1 && [ "$(hostname)" = "raspberrypi" ]; then
  sudo raspi-config nonint do_hostname "${HOSTNAME_PI:-skylight}" \
    && echo "==> Pi renamed to ${HOSTNAME_PI:-skylight} (reachable as ${HOSTNAME_PI:-skylight}.local after reboot)"
fi

IP="$(hostname -I | awk '{print $1}')"
echo
echo "Done."
echo "  Display : http://localhost:3000/  (point Chromium kiosk here — see setup-kiosk.sh)"
echo "  Control : http://$IP:3000/control  (open on your phone; also http://$(hostname).local:3000/control)"
if [ "$DATA_SOURCE" = radio ]; then
  echo "  Source  : radio (local RTL-SDR; adsb.fi merged in as a supplement)"
  echo "  Decoder : http://$IP:8080/data/aircraft.json  (raw decoded feed)"
else
  echo "  Source  : api (adsb.fi, no radio) - re-run with a radio plugged in to switch"
fi
if [ -n "$LAT" ]; then
  echo "  Receiver: $LAT, $LON"
else
  echo "  Receiver: position not set (optional - re-run with LAT=.. LON=.. to set it)"
fi
echo
if [ "$DATA_SOURCE" = radio ]; then
  echo "Verify decode:  curl -s localhost:8080/data/aircraft.json | head"
  echo "  (rtl_test -t only works while the decoder is stopped: sudo systemctl stop dump1090-fa)"
fi
