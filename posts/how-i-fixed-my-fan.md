# How I Fixed My Fan

This post will cover how I got my CPU fan to be less annoying on my khadas edge 2 SBC.

## What's "broken"?

Earlier this year I decided that I wanted to switch from using my GPD WIN4 cyberdeck to something with a smaller form factor.
My criteria was that it needed to have USB-C video output and that it could take USB-C power delivery for keeping it running.
Surprisingly, this was harder to find than I expected. The main difficulty was just getting something with USB-C DisplayPort.
Most of these mini computers are expecting you to use an HDMI or assume that you can power them from a DC power supply.
Some boards are also way too minimal and I didn't want to go through the hassle of 3D printing a case from scratch.
I ended up settling with the [Khadas Edge 2](https://www.khadas.com/edge2) since it ticked most of the boxes and had a built in NPU which I was hoping to use for local LLM inference.

After setting it up with a battery pack that I taped to the end I started slowly transitioning to using it more and more.
Initially I installed an Arch Linux distribution so I could keep some of my same scripts and workflows from my main device.
It's been working great and I've started to do most of my dev work from the box either connected directly or over ssh from my main cyberdeck.

The main pain point so far (other than things not being compiled for ARM Linux) has been that the CPU fan is noisy as heck, and even worse it seems to go on full blast when the CPU is used for anything and then shuts off within a second only to start again once it heats up.
As somebody with noise sensitivity this has been driving me crazy and has really gotten in the way with me working with this device full time.

## Thermal configs to the rescue

My initial attempt at getting this fixed with a local LLM led to my machine randomly shutting off when the CPU spiked.
After getting some tips from the lovely humans at [Beryllium OS](https://beryllium.gr/) and some digging on how the [thermal subsystem](https://openlib.io/thermal-zones-and-dynamic-cpu-frequency-scaling-on-embedded-linux-platforms/) works on Linux, I managed to coax my slop spewer into something more usable.

The key bits that were causing the issue were the `hysteresis` and `temperature` of the trip points.
In usual Linux fashion, all the bits you'd want to configure are available as files and folders within `/sys/class/thermal/thermal_zone0`.

From there, the system had a bunch of "trip points" already defined from `0` to `3`.
Initially I tried to set the hysteresis to be `10 degrees Celsius` by writing to the `_hyst` value of each point.

```bash
TZ=/sys/class/thermal/thermal_zone0
for i in 3 4 5 6 7 8; do
    echo 10000 > $TZ/trip_point_${i}_hyst
done
```

This was supposed to make it so the CPU fan would run a bit longer before shutting off and make the on/off "thermal hunting" less sporadic.
Sadly this wasn't enough since it was still engaging in a lot of fluctuation at the 45C threshold.

As an aside, I used this script to manually monitor my SBC's temperature:

```bash
watch -n 1 'echo "SOC: $(cat /sys/class/thermal/thermal_zone0/temp | awk "{printf \$1/1000}")°C  |  Fan: $(cat /sys/class/thermal/cooling_device5/cur_state)/5"'
```

The next step was to update the temperature that each trip point would trigger at.

```bash
echo 55000 > $TZ/trip_point_3_temp
echo 65000 > $TZ/trip_point_4_temp
echo 70000 > $TZ/trip_point_5_temp
echo 75000 > $TZ/trip_point_6_temp
echo 80000 > $TZ/trip_point_7_temp
echo 85000 > $TZ/trip_point_8_temp
```

This set the first point to `55 degrees Celsius` which in my testing took a while of heavy usage to get to at my usual room temperature.

## Automation

Once I determined what values are reasonable, I added a script to `/usr/local/bin/thermal-tune.sh` to configure everything.

```bash
#!/bin/bash
TZ=/sys/class/thermal/thermal_zone0
echo 55000 > $TZ/trip_point_3_temp
echo 65000 > $TZ/trip_point_4_temp
echo 70000 > $TZ/trip_point_5_temp
echo 75000 > $TZ/trip_point_6_temp
echo 80000 > $TZ/trip_point_7_temp
echo 85000 > $TZ/trip_point_8_temp
for i in 3 4 5 6 7 8; do
    echo 10000 > $TZ/trip_point_${i}_hyst
done
```

Then I added a SystemD unit file to `/etc/systemd/system/thermal-tune.service` to run this script on boot as root.

```bash
[Unit]
Description=RK3588 Thermal Tuning
After=systemd-udevd.service
DefaultDependencies=no

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/bin/thermal-tune.sh

[Install]
WantedBy=multi-user.target
```

With this I now don't need to worry about my fan driving me bonkers unless I'm doing some heavy compute that actually warrants it.
