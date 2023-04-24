# Local First Cyberspace - Primer

## What is Local-First?

Software that saves your data locally, works offline, and then extends to the network.

Opposite of cloud based approaches where data is stored in a cloud service, and then it gives you access over the network.

## Walled Gardens Suck

When your building block is centralized services like the cloud, your go to is to hoard all the data locally, and dictate how it's interacted with.

It means that you need stores and registries and gatekeppers to sit in between users and each other.

For instance, I can't publish a VR app on Oculus unless I jump through a bunch of hoops and have them approve me.

And after they they're going to take a cut of any money I can make off of it because they're in control over the entire process.

The thing is, when you have centralized systems, you almost have no choice but to start governming and controlling the data you collect, it's a side effect of the topology.

This sucks.

## People should own their reality

Building cyberspace, or the metaverse, on large centralized platforms will make it harder for people to innovate and will be disasterous for when the platforms crash.

I want anybody to jack into their VR headset, and enter their own personal VR space that will exist regardless of whether they're online, and will be fully controlled by them.

Similarly, if they have an idea for some sort of VR scene, I want them to just sketch it up and send a link to somebody without having to go through some marketplace or registry.

When the person they sent the link to loads it, if they're on the same wifi or physically close, they should download it without having to first reach out to the internet.

And that should be the standard for all content. Videos and audio that you've got loaded on your phone should be loadable by other people in your house without using up more data.

## Dat

So, this is all pretty fun to talk about, but how do we achieve this reality.

I'm currently working on the Dat project on Peer to Peer web technology.

The gist of it is "Like BitTorrent for Websites, but faster, mutable, and private".

## P2P File Sharing

So, the way it works, is you create some files for your website. The HTML / JavaScript / CSS and stuff.

Then you create a "dat archive" which is a folder you can shove files into, and share with people using a link.

Then you start sharing the archive on the network.

When a person tries to access an archive using a link, they search the P2P network for computers that have a copy of it.

And when they've downloaded the archive, they start re-sharing it onto the network.

So by default the only people that can see your data are the ones you share the link with, and the more people are accessing it the more people are re-sharing it.

## Dat on the Web

So, dat started out as being a command line tool and some desktop apps for sharing scientific data, but it's been used more and more on the web.

There's currently two web browsers with support for Dat.

Beaker, which was the original and is based on Electron and Chromium, and Cliqz which is based on Firefox and is actually just bundling a Firefox extension for the Dat support.

Cliqz is also experimenting with a mobile browsr on Android, which is pretty exciting.

These browsers let you load webistes from the P2P web, and author websites from right in your browser.

## Dat in VR

My goal this summer is to get Dat integrated with Exokit so that we can load VR content from the P2P web within different headsets.

What I also want is to have tooling for peopel to start duplicating VR worlds and editing them themselves.

## Freedom and Innovation

What I really want is to give both developers and users to have more freedom inside VR worlds and to make it easier for people to play around with ideas and innovate on how we interact with our software.