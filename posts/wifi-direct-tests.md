# Wifi Direct Tests

This blog post will go over some stuff I've learned while experimenting with using Android's [Wifi Direct P2P APIs](https://developer.android.com/guide/topics/connectivity/wifip2p).

## General Gotchas

One thing I found was that phones required me to explicitly grant the Location permission and have Location Services enabled in order for WifiP2P to load.
The error messages for this were a bit obtuse, but if your phone randomly isn't discovering devices, it's likely a permission issue or a location issue.
Luckily I've had similar problems with experimenting with Bluetooth Low Energy in the past, so I'm more used to it.
It'd be nice if location services could be toggled to only allow this Wifi stuff rather than enabling all of Google's surveilance functionality just to use a WifiDirect app.

## `WifiP2PManager.discoverPeers`

This likely works best if you're prompting users to connect to a specific device/person based on the name that's being advertised.
For my use case I wanted to make something relatively automated where devices would try to automatically connect to any peers they found.
This worked okay when I just had two devices in an area with zero other WifiDirect actions happening, but it broke when my neighbors Amazon Surveilance Stick™️ ended up acting as a sink that devices would connect to and get stuck inside of.
I had thought I could filter out all "non-computers" by looking at the peer's `primaryDeviceType` attribute, which I managed to decipher using the source code for [this library](https://github.com/nfcpy/ndeflib/blob/master/src/ndef/wifi.py#L319), but for some reason this Amazon thing decided that it wanted to be called a "Compuer::Tablet" which means there was no way to distinguish it from actual phones and tablets.
Android actually has a way to do "service discovery" on the local network using either UPNP or Bonjour in the `WifiP2PManager.addLocalService` API, but this only works once you have connected (and since these functions typically use multicast UDP to work, it bodes well for us being able to use them).

I wanted a workflow where two people could press a button in their app, and have their devices connect to some sort of mesh without any extra prompting.
With this in mind, I started looking at the (older) `createGroup` functionality.

## `WifiP2PManager.createGroup`

## Multicast UDP Service Discovery
