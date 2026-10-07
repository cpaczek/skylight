# Raspberry Pi setup

Turn a freshly-flashed Raspberry Pi OS card into the Skylight appliance. Tested on a
**Raspberry Pi 5** with **Raspberry Pi OS Bookworm (64-bit, Desktop)**.

> **64-bit OS required.** Node.js has no 32-bit ARM builds, so the installer refuses
> to run on 32-bit images. All supported Pis (3/4/5, Zero 2 W) run the 64-bit OS.

> **No radio?** Nothing to do - the installer looks for an RTL-SDR on USB. One
> plugged in → `DATA_SOURCE=radio` (local decode, adsb.fi merged in as a
> supplement); none → `DATA_SOURCE=api` (adsb.fi only, no driver or decoder
> installed). Force it with `DATA_SOURCE=radio ./pi-setup/install-on-pi.sh` (or
> `api`); re-running the installer after plugging a radio in switches over at the next reboot. Already
> feeding PiAware/FR24 from another box? Install with `DATA_SOURCE=radio` and point
> the **Radio URL** in `/control` → Source at that feed's `aircraft.json`.

## 1. Provision the card (headless WiFi + SSH) - on your computer

Flash Raspberry Pi OS (Desktop) to the card. With the card's **boot** partition mounted
(e.g. at `/mnt/sdboot`):

```bash
sudo BOOT_MNT=/mnt/sdboot \
  HOSTNAME_PI=skylight \
  WIFI_SSID="YourWiFi" WIFI_PSK="YourPassword" WIFI_COUNTRY=US \
  PUBKEY="$(cat ~/.ssh/id_ed25519.pub)" \
  ./provision-sd.sh
```

This writes `custom.toml` (processed on first boot) + an `ssh` flag file, and prints a
random console/sudo password - **save it**. SSH is key-only by default (use a
passphrase-less key, or load yours into an agent, so unattended `rsync`/deploy works).

Eject, boot the Pi, wait ~60–90 s, then:

```bash
ssh pi@skylight.local        # or ssh pi@<pi-ip>
```

> **Tip:** if your only key is passphrase-protected, either generate a dedicated
> passphrase-less deploy key and authorize it, or set `password_authentication = true`
> for first setup. Local-network convenience vs. security is your call.

## 2. Install the appliance - on the Pi

Copy the repo to the Pi and run the installer:

```bash
git clone https://github.com/cpaczek/skylight.git ~/skylight   # or rsync it over
cd ~/skylight
./pi-setup/install-on-pi.sh
```

Installs the rtl-sdr-blog driver (V3/V4/V4L, FlightAware Pro Stick, Nooelec and
generic RTL2832U sticks; + DVB-T blacklist) and dump1090-fa when a radio is detected,
then Node + pnpm, builds the app, and enables the `skylight-server` service. With a
radio, **verify decode first** with `rtl_test -t` and
`curl -s localhost:8080/data/aircraft.json | head` before moving on.

The whole thing - clone or update, install, kiosk, reboot - as one short line typed
on the Pi (it fetches the script served at skylightceiling.com/install):

```bash
curl -sL skylightceiling.com/install | bash
```

Without the website in the loop, the same thing by hand:

```bash
git clone https://github.com/cpaczek/skylight.git ~/skylight && cd ~/skylight && ./pi-setup/install-on-pi.sh && ./pi-setup/setup-kiosk.sh && sudo reboot
```

The installer also renames a stock `raspberrypi` to `skylight` so the phone URL is
always `http://skylight.local:3000/control` (set `HOSTNAME_PI` to choose another).

Optionally tell the decoder where the receiver is, for a faster first fix on each
aircraft: `LAT=33.94 LON=-84.52 ./pi-setup/install-on-pi.sh` (your own coordinates).
Get this right or leave it out - dump1090 throws away every position more than 300 NM
from the location it is given. The installer is safe to re-run, which is also how you
change or remove the position later. This is separate from the display's location,
which you set in `/control`.

## 3. Kiosk display - on the Pi

```bash
./pi-setup/setup-kiosk.sh
sudo reboot
```

Chromium opens full-screen on the display page at boot (via Xwayland - the native
Wayland GPU path crashes on the Pi 5), cursor hidden. The script also turns off
screen blanking through `raspi-config` (Pi OS otherwise blanks after 10 minutes
under labwc, wayfire and X11 alike) and forces the first HDMI port on at boot.

> **No HDMI signal?** The Pi 5 turns HDMI off when nothing is connected at boot and
> doesn't always re-detect on hotplug. `setup-kiosk.sh` appends
> `video=HDMI-A-1:1920x1080@60D` to `/boot/firmware/cmdline.txt` so the port nearest
> the USB-C power stays live - connect the projector there. For the far port add
> `video=HDMI-A-2:1920x1080@60D` yourself.

## 4. Calibrate

From your phone open `http://skylight.local:3000/control` and tune **rotation** + **mirror**
against a real overhead pass until the ceiling tracks the sky (it's a calibration, not a
formula - you're projecting up and looking up).

## Pushing updates

From your dev machine, after editing code:

```bash
PI_HOST=skylight.local ./scripts/deploy-to-pi.sh
```

(rsyncs the source, rebuilds on the Pi, restarts the server, and reloads the kiosk.)

## Files

| File | Runs on | Purpose |
|---|---|---|
| `provision-sd.sh` | your PC | headless WiFi + SSH onto the SD boot partition |
| `install-on-pi.sh` | the Pi | driver + decoder + Node + app + server service |
| `skylight-server.service` | the Pi | systemd unit template for the server |
| `setup-kiosk.sh` | the Pi | Chromium kiosk autostart, screen blanking off, HDMI forced on |
