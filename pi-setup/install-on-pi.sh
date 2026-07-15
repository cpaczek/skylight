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
# Receiver reference position (set to your location). Defaults to SFO.
LAT="${LAT:-37.6213}"
LON="${LON:--122.379}"

echo "==> apt update + base packages"
sudo apt-get update
sudo apt-get install -y git build-essential cmake libusb-1.0-0-dev pkg-config \
  libncurses-dev unclutter

echo "==> RTL-SDR Blog V4 driver"
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
sudo tee /etc/modprobe.d/blacklist-rtlsdr.conf >/dev/null <<'EOF'
blacklist dvb_usb_rtl28xxu
blacklist rtl2832
blacklist rtl2830
blacklist rtl2838
blacklist dvb_usb_v2
EOF
sudo udevadm control --reload-rules && sudo udevadm trigger || true
sudo modprobe -r dvb_usb_rtl28xxu 2>/dev/null || true

echo "==> dump1090-fa (FlightAware decoder + SkyAware map on :8080)"
if ! command -v dump1090-fa >/dev/null 2>&1; then
  # FlightAware publishes a piaware/dump1090 apt repo; build from source as a
  # portable fallback that also serves JSON via lighttpd-free --write-json.
  SRC=/tmp/dump1090-fa
  rm -rf "$SRC"
  git clone --depth 1 https://github.com/flightaware/dump1090 "$SRC"
  make -C "$SRC" RTLSDR=yes
  sudo install -m755 "$SRC/dump1090" /usr/local/bin/dump1090-fa
  # Minimal service: decode + write JSON where the tracker server expects it.
  sudo mkdir -p /run/dump1090-fa
  sudo tee /etc/systemd/system/dump1090-fa.service >/dev/null <<EOF
[Unit]
Description=dump1090-fa ADS-B decoder
After=network.target
[Service]
ExecStartPre=/bin/mkdir -p /run/dump1090-fa
ExecStart=/usr/local/bin/dump1090-fa --device-type rtlsdr --lat $LAT --lon $LON --write-json /run/dump1090-fa --write-json-every 1 --quiet
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
  # Serve /run/dump1090-fa at :8080/data/ via a tiny static server.
  sudo tee /etc/systemd/system/dump1090-json.service >/dev/null <<EOF
[Unit]
Description=Serve dump1090 aircraft.json on :8080
After=dump1090-fa.service
[Service]
ExecStartPre=/bin/mkdir -p /run/dump1090-fa
ExecStart=/usr/bin/python3 -m http.server 8080 --directory /run/dump1090-fa
Restart=always
RestartSec=2
[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable --now dump1090-fa.service dump1090-json.service
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
  "$APPDIR/pi-setup/skylight-server.service" \
  | sudo tee /etc/systemd/system/skylight-server.service >/dev/null
sudo systemctl daemon-reload
sudo systemctl enable --now skylight-server.service

IP="$(hostname -I | awk '{print $1}')"
echo
echo "Done."
echo "  Display : http://localhost:3000/  (point Chromium kiosk here — see setup-kiosk.sh)"
echo "  Control : http://$IP:3000/control  (open on your phone)"
echo "  Decoder : http://$IP:8080/data/aircraft.json  (raw decoded feed)"
echo
echo "Verify decode first:  rtl_test -t   then   curl -s localhost:8080/data/aircraft.json | head"
