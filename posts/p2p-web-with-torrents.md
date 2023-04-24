# A P2P Web Using BitTorrent

As most people reading this would know, I'm high key obsessed with the idea of a decentralized, peer to peer, web.

What this means, for the uninitiated, is a web where content is loaded, not from servers, but from a peer to peer network.

Instead of connecting to a specific server and trusting it to give you valid data for a given URL, you take a URL which identifies some data, and download it from a swarm of peers without having to trust them.

This is achieved with cool cryptography stuff, and if you're interested in P2P, consider reading some of my other blog posts or looking into the projects I've linked to.

## Isn't this a thing already?

[IPFS](https://ipfs.io/), [Beaker (Dat)](https://beakerbrowser.com/), [SSB](https://www.scuttlebutt.nz/).

These are, IMO, the big players in pushing the p2p web forward outside of the cryptocurrency scene.

`Dat` is leading the way with Beaker for having a way to author p2p web content and providing a way to browse and interact with it. It's by far my favorite approach. It's great for authoring web content.

`IPFS` has a lot of hype and is trying to spread to multiple programming languages and is trying to be "future proof" for various protocols and encodings. It's being used a lot in conjunction with various Blockchain apps as a storage layer.

`SSB` is primarily for sharing chains of events and is primarily used in apps like [patchwork](https://github.com/ssbc/patchwork) as a tight-knit social media platform. However, it can also be used for publishing [web content](https://github.com/noffle/ssb-webify).

At a high level, they pretty much do the same thing. You author content, and share it in a p2p network.

The details, however, are all very different from each other. And what's more, each system is fundamentally incompatible with the other.

This means that not only do you need to implement a bunch of custom (and every-changing) code, but it won't be reusable across the various environments.

## BitTorrent is P2P.

BitTorrent is one of the, if not **the**, most popular and sccessful P2P applications around.
It's likely that many people that aren't even particualrly into p2p will have used BitTorrent for downloading data to some extent. Whether explicitly when downloading an OS ISO file, or indirectly when using software that embeds bittorrent for downloading updates.

Wouldn't it be cool if we could take 99% of the existing BitTorrent infrasturcture and network, and add a little bit of special sauce to allow people to distribute and update sturctured content like websites?

Luckily, that's already a thing! (Kind of)

## BEP 46

Despite being a proven, stable, technology, BitTorrent is actually still evolving through [Bittorrent Enhancement Proposals](http://www.bittorrent.org/beps/bep_0000.html).
`BEP`s are specifications that describe how BitTorrent works, as well as extentions that are can be implemented by BitTorrent clients in order to guarantee interoperability with other implementations.

[BEP 46](http://www.bittorrent.org/beps/bep_0046.html) is one such extension which enables people to publish mutable torrents that don't rely on a central authority.
Currently, to share a torrent you can create a `magnet link` which will contain the hash of your torrent's metadata, the `infohash`.
Then, if somebody takes this hash, they can find who has the metadata in the Distributed Hash Table ([BEP 5](http://www.bittorrent.org/beps/bep_0005.html)), and use that to download the torrent data.
One limitation of this (and of using torrent files), is that if you want to change something in your torrent, you must create a new one since it would change the hash.

With `BEP 46`, instead of using a hash of your torrent, you send a magnet link which contains your public key. Then, you use [BEP 44](http://www.bittorrent.org/beps/bep_0044.html) to post custom messages to the [BitTorrent Distributed Hash Table](http://www.bittorrent.org/beps/bep_0005.html) which contain the `infohash`. It then signs the infohash with your private key. Thus, when somebody wants to download your torrent, they'll look up values on the DHT using your public key, find the link, verify that it was signed by you, and start downloading your torrent. Now, if you have a change that you want to publish, you will need to publish new DHT entries with the updated magnet link. An example of using WebTorrent in conjunction with `BEP 46` to publish and load mutable torrents can be found [here](https://github.com/lmatteis/dmt).

## On the web

With this enhancement to BitTorrent it now makes sense to publish websites on BitTorrent since you now have a straightforward, though a potentially slow, method of updating them.

The same way that the Beaker Browser enables people to view and publish Dat content on the web, a browser could be made to do the same with BitTorrent.
This would be easier to port to other platforms because one could reuse existing BitTorrent client code for most of the heavy lifting, and would need to add the changes in `BEP 46`, which shouldn't be too much effort. A good place to start might be my earlier post about [making a browser](/posts/making-a-browser) using built-in webviews from whatever OS a user is on. The [Brave browser](https://brave.com/features/#feature-list) has support for downloading content with [WebTorrent](https://webtorrent.io/), but it's more of a built-in torrent client and doesn't support loading webpages, let alone mutable torrents.

## What's next?

I'm going to try to look into this stuff more. Hopefully this post will re-kindle some of the interest that was around in 2016 when this BEP was created. And maybe we'll see a new browser (or browser extension?) which supports this new technology.