#!/usr/bin/env bash
# Run ON the Pi (desktop image) to launch Chromium full-screen on the display
# page at boot, hide the cursor, and disable screen blanking. Detects the
# Wayland compositor (labwc / wayfire) used by Raspberry Pi OS Bookworm.
set -euo pipefail

URL="${URL:-http://localhost:3000/}"
CHROMIUM="$(command -v chromium-browser || command -v chromium || true)"
if [ -z "$CHROMIUM" ]; then
  echo "==> Chromium not found; installing it"
  sudo apt-get update && sudo apt-get install -y chromium
  CHROMIUM="$(command -v chromium-browser || command -v chromium)"
fi

LAUNCH="$HOME/.local/bin/skylight-kiosk.sh"
mkdir -p "$HOME/.local/bin"
cat > "$LAUNCH" <<EOF
#!/usr/bin/env bash
# Kiosk launcher. NOTE: Chromium's native-Wayland GPU path crashes on the Pi 5
# (V3D MakeCurrent failures), so we run it through Xwayland (--ozone-platform=x11).
export DISPLAY=:0
export XDG_RUNTIME_DIR=/run/user/\$(id -u)
# Wait for the tracker server to be up.
until curl -fsS http://localhost:3000/api/health >/dev/null 2>&1; do sleep 1; done
command -v unclutter >/dev/null && unclutter -idle 0.1 &
exec $CHROMIUM \\
  --kiosk --ozone-platform=x11 --app=$URL \\
  --user-data-dir=\$HOME/.kiosk-profile --no-first-run --password-store=basic \\
  --noerrdialogs --disable-infobars --disable-session-crashed-bubble \\
  --check-for-update-interval=31536000 --start-fullscreen
EOF
chmod +x "$LAUNCH"

# Keep the screen awake. Raspberry Pi OS blanks the display after 10 minutes
# (swayidle under labwc, dpms_timeout under wayfire, xorg conf under X11);
# raspi-config knows which one this image uses, so let it turn blanking off.
if command -v raspi-config >/dev/null 2>&1; then
  sudo raspi-config nonint do_blanking 1 && echo "==> screen blanking disabled (raspi-config)" \
    || echo "WARN: could not disable screen blanking via raspi-config; do it in Preferences > Raspberry Pi Configuration > Display"
fi

# The Pi 5 (and 4) turn an HDMI port off when nothing answers on it at boot
# and don't always re-detect a projector that is switched on later. Force the
# first port (next to the USB-C power socket) to stay live at 1080p60.
CMDLINE=/boot/firmware/cmdline.txt
if [ -f "$CMDLINE" ] && ! grep -q "video=HDMI-A-1" "$CMDLINE"; then
  sudo sed -i '1 s/$/ video=HDMI-A-1:1920x1080@60D/' "$CMDLINE"
  echo "==> forced HDMI-A-1 on at boot ($CMDLINE)"
fi

if command -v labwc >/dev/null 2>&1; then
  mkdir -p "$HOME/.config/labwc"
  AUTOSTART="$HOME/.config/labwc/autostart"
  grep -q skylight-kiosk "$AUTOSTART" 2>/dev/null || echo "$LAUNCH &" >> "$AUTOSTART"
  echo "==> labwc detected; kiosk added to $AUTOSTART"
elif command -v wayfire >/dev/null 2>&1; then
  INI="$HOME/.config/wayfire.ini"
  touch "$INI"
  if ! grep -q "\[autostart\]" "$INI"; then printf "\n[autostart]\n" >> "$INI"; fi
  grep -q skylight-kiosk "$INI" || sed -i "/\[autostart\]/a skylight = $LAUNCH" "$INI"
  grep -q "screensaver" "$INI" || sed -i "/\[autostart\]/a screensaver = false\ndpms = false" "$INI"
  echo "==> wayfire detected; kiosk added to $INI"
else
  # X11 / LXDE autostart fallback.
  AUTOSTART="$HOME/.config/lxsession/LXDE-pi/autostart"
  mkdir -p "$(dirname "$AUTOSTART")"
  {
    echo "@xset s off"
    echo "@xset -dpms"
    echo "@xset s noblank"
    echo "@$LAUNCH"
  } >> "$AUTOSTART"
  echo "==> X11/LXDE fallback; kiosk added to $AUTOSTART"
fi

echo
echo "Reboot to start the kiosk:  sudo reboot"
echo "Launch now (in the desktop session):  $LAUNCH"
