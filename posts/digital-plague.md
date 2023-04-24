# Digital Plague

Just writing out some thoughts to see what's possible. This isn't an actual plan and should not be executed as it's probably illegal and at the very least unethical.

- Semi-automated
- Discover Wifi Access points + autopwn them
- Discovery: [Wifite](https://tools.kali.org/wireless-attacks/wifite)
- Exploit: [Routersplot](https://tools.kali.org/exploitation-tools/routersploit)
- Pivot: [Kali Linux Container](https://www.kali.org/docs/containers/kalilinux-lxc-images/)

## Playbook:

- Get high powered antenna
- Scan Wifi Networks / Auto-crack passwords for them
- Connect to wifi access points and use autopwn to get a shell
- Install DHT based RAT (network peers together)
- Install Kali container
- Find network drives and other devices that can be used to pivot
- Attempt to hijack unused guest network SSIDs for meshing? (dunno how)
- Run local http service to communicate between nodes on the mesh (p2p bridge?)
