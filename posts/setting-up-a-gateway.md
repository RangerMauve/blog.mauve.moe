# Setting up a gateway

This assumes you're running in an Ubuntu-like environment on Linux. Something like a Raspberry Pi.

## Install Node

This will install node 11 as well as npm. Follow whichever set you need

```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_11.x | bash -
apt-get install -y nodejs
```

## Install the gateway

This will install the gateway from NPM

```bash
npm i -g dat-gateway
```

You should test that it actually runs before we get it running in the background.

```bash
dat-gateway
```

## Set up a service for the gateway

```bash
# This will create the service file
sudo cat << EOF > /etc/systemd/system/dat-gateway.service
[Unit]
Description=Gateway for accessing dat websites through HTTP

[Service]
Type=simple
# Check that dat-gateway is present at this location
# If it's not, replace the path with it's location
# You might also want to specify the `--port` flag here
ExecStart=/usr/bin/dat-gateway
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo chmod 644 /etc/systemd/system/dat-gateway.service

sudo systemctl daemon-reload
sudo systemctl enable dat-gateway
sudo systemctl start dat-gateway

sudo systemctl status dat-gateway
```
