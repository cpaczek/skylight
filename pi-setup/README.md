# Raspberry Pi setup

Turn a freshly-flashed Raspberry Pi OS card into the Skylight appliance. Tested on a
**Raspberry Pi 5** with **Raspberry Pi OS Bookworm (64-bit, Desktop)**.

> **64-bit OS required.** Node.js has no 32-bit ARM builds, so the installer refuses
> to run on 32-bit images. All supported Pis (3/4/5, Zero 2 W) run the 64-bit OS.

> **No radio?** Skip the decoder bits and run against the free public API: after
> install, set `Environment=DATA_SOURCE=api` in
> `/etc/systemd/system/skylight-server.service` and `sudo systemctl daemon-reload &&
> sudo systemctl restart skylight-server`. Already feeding PiAware/FR24 from another
> box? Keep `DATA_SOURCE=radio` and point the **Radio URL** in `/control` → Source at
> that feed's `aircraft.json`.

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
LAT=37.6213 LON=-122.379 ./pi-setup/install-on-pi.sh            # set your coordinates
```

Installs the rtl-sdr-blog V4 driver (+ DVB-T blacklist), dump1090-fa, Node + pnpm,
builds the app, and enables the `skylight-server` service. **Verify decode first** with
`rtl_test -t` and `curl -s localhost:8080/data/aircraft.json | head` before moving on.

## 3. Kiosk display - on the Pi

```bash
./pi-setup/setup-kiosk.sh
sudo reboot
```

Chromium opens full-screen on the display page at boot (via Xwayland - the native
Wayland GPU path crashes on the Pi 5), cursor hidden, screen blanking off.

> **No HDMI signal?** The Pi 5 turns HDMI off when nothing is connected at boot and
> doesn't always re-detect on hotplug. Force it on by appending to
> `/boot/firmware/cmdline.txt`: `video=HDMI-A-1:1920x1080@60D` (and `-A-2` for the far
> port), then reboot. Connect the projector to the port nearest the USB-C power.

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
| `setup-kiosk.sh` | the Pi | Chromium kiosk autostart + no-blanking |
