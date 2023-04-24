# Comparing Peer to Peer Protocols

This post will compare several peer to peer protocols by looking at how they work and the tradeoffs that one should consider when choosing one of them.
We will specifically be looking at [BitTorrent](https://www.bittorrent.org/index.html), [IPFS](https://ipfs.io/), [Secure Scuttlebutt (SSB)](https://scuttlebutt.nz/) and [Hypercore](https://hypercore-protocol.org/).

This post is made to be read sequentially as later sections build on top of earlier ones, but you can feel free to jump around or link to specific sections.
This article is also generally aimed at people wanting to use these protocols that have vague ideas about how peer to peer systems work already.
If a term you see is new to you, try clicking some of these links for further reading or [search about it online](https://duckduckgo.com/).

## Links

One of the first things people might see when interacting with these protocols is how data can be linked to them.
Most people would be using these protocols for loading content from peer to peer networks, and probably don't think too hard about what the links actually mean.

### Links - BitTorrent

BitTorrent uses links that use the `magnet:` [URI scheme](https://en.wikipedia.org/wiki/Magnet_URI_scheme) by specifying a property that links to the `urn:btih` (BitTorrent InfoHash) for a given Torrent.
The standard is used by serveral other content networks like Kazaa and eDonkey which were popular file sharing networks that aren't as active these days.
The link format can contain extra information like `tracker` servers for helping discover other peers with data and metadata that lets you know whether a torrent is "private" without needing to download the torrent itself.
These links are very well defined, but being [URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) rather than [URLs](https://en.wikipedia.org/wiki/URL), they are not suitable for using as paths within a browser's `hostname` and require extra effort to be able to link to a specific file within a torrent.
In order to address some of the drawbacks of using URI, there's been some talk about standardizing on a [bittorrent://](https://github.com/bittorrent/bittorrent.org/issues/92) URL format which would be able to better integrate with browsers and link to specific data.

### Links - IPFS

IPFS has a couple of approaches to links. Primarily they use [Content Identifiers, AKA CIDs,](https://docs.ipfs.io/concepts/content-addressing/#cid-conversion) with two ways of turning them into links.
In a lot of places they make use of `/ipfs/{CID}/` style URLs which are made to be easy to convert to paths within [IPFS gateways](https://docs.ipfs.io/concepts/ipfs-gateway/) and mirrors the underlying [Libp2p multiaddress format](https://github.com/multiformats/multiaddr#protocols) which uses paths with a "type" prefix.
However, more recently IPFS has been using `ipfs://{CID}` URLs which have had some growing pains based on the encoding of the CID.
Initially, IPFS was using the CIDv0 spec that is based on the [Base58 Bitcoin encoding](https://learnmeabitcoin.com/technical/base58) for the data which is case sensitive.
This caused problems with loading IPFS URLs in browsers since the `hostname` portion of a URL is case insensitive and generally gets converted to lowercase when parsed within a browser.
From that lesson, they started migrating to CIDv1 which defaults to `base32` encoding that uses all lowercase characters.
There's still some growing pains when people try to use CIDv0 style links that are the default in order tools, so if you have a URL that starts with `Qm`, you might want to update it with a [CID inspector](https://cid.ipfs.io/)
In addition to IPFS links, there are also `IPNS` links which can make use of public keys or DNS names instead of CIDs, like `ipns://{Public Key or DNS}/`.
The DNS functionality comes from the [DNSLink](https://www.dnslink.io/) standard.

### Links - Hypercore

Finally, Hypercore has had some slight changes over time for their URL standard that were primarily guided by the [Dat CLI](https://docs.dat.foundation/docs/cli-intro) and Paul Frazee's [Beaker Browser](https://beakerbrowser.com/).
Initially the ecosystem used `dat://{public key}/` URLs where the `public key` was 64 hex characters representing a 32 byte public key.
It was also extended to be able to specify a `version` in the URL using the `dat://{public key}+{version}/` syntax.
This was also extended with the ability to specify a [DNS name](https://www.npmjs.com/package/hyper-dns) in the URL.
Finally, after the the core team working on the Hypercore Protocol part of the Dat ecosystem split off to do their own thing, the URL scheme was changed to use the `hyper://` name instead of `dat://`.
This URL format doesn't have the issue of relying on uppercase characters, but has the limitation that the `hostname` portion is technically illegal since it uses 64 characters when the maximum allowed length is 63.
Luckily browsers and many other tools happily consume the full length of the key, but the community might need to switch from `hex` encoding to something like IPFS' `base32` encoding in order to conform better with existing standards.

### Links - SSB

Secure ScuttleButt (AKA SSB) is a bit of an outlier in that people generally interact with its data via an app like [Manyverse](https://www.manyver.se/) which abstracts the linking of data to an extent.
Under the hood, however, SSB has two methods of linking to data: [Cypherlinks](https://handbook.scuttlebutt.nz/concepts/link) and [SSB URI](https://github.com/ssb-ngi-pointer/ssb-uri-spec).
The Cypherlink spec seems to have evolved for the `#hashtag` syntax that SSB uses to link to "channels" (aka "tags" in other social media platforms), and adds three new types: `@feed` to link to a specific person or "feed", `%message` to link to a message, and `&blob` to link to a blob.
This syntax is pretty unique among p2p protocols, and is generally only used when rendering Markdown in apps like Patchwork or Manyverse.
The latest and greatest is URIs which make use of the `ssb:` URI scheme, and a "type" like `message`, `feed`, or `blob`.
For example `ssb:message/sha256/<MSGID>`, `ssb:identity/fusion/<KEY>`, `ssb:feed/bendybutt-v1/<FEEDID>`.
SSB URIs are the "latest and greatest" and put effort into being forwards compatible with changes to how SSB feeds are encoded and distributed.
However, not all SSB apps make use of these links (as of March 2022) so you might need to revert to Cypherlinks depending on what you're using.

## Content

So, even if you have links to content, what content even is there to link to?

### Content - BitTorrent

Sadly, BitTorrent has strong associations with internet piracy where projects like The Pirate Bay get used to upload illegal copies of copyright content which people use to bypass restrictions such as DRM or lack of access.

However, that's not the only use for BitTorrent and it has been used to distribute datasets for things like Linux ISO images, [scientific data](https://pubmed.ncbi.nlm.nih.gov/20418944/), and general use cases.

It's also being used in applications like [PeerTube](https://joinpeertube.org/) which allow independent content creators to save on bandwidth costs by sharing the bandwidth costs of viewing videos accross viewers.

BitTorrent has also been used by archiving groups like [The Internet Archive](https://archive.org/) in order to distribute archives of content that's part of humanity's history.

Since BitTorrent has been around for a long time, it's decently well known and there's a lot of data out there to explore already.

### Content - IPFS

IPFS has been making a lot of buzz among blockchain communities by acting as a decentralized file storage alternative to central file servers for things like [Non-Fungible Tokens (NFT)](https://docs.ipfs.io/how-to/mint-nfts-with-ipfs/) and various bits of web content such as [Compost](https://ipfs.io/ipns/two.compost.digital/).

It's high level APIs have also been used with tools like [WebRecorder](https://webrecorder.net/about) to make it easier to archive content and preserve it in immutable records while deduplicating file content whenever possible.

### Content - Hypercore

Hypercore has had a lot of content published in the [Beaker Browser](https://beakerbrowser.com/), but a lot of it has sadly grown to be incompatible with newer versions of Hypercore as improvements to the network were made.

### Content - SSB

Most content on SSB is locked away in people's social graphs and can only be accessed if you get introduced into networks of other people.

However, there are public [viewers](https://viewer.scuttlebot.io/) which can give you glimpses into messages that people on the network have chosen to make public.

## Data Model

If you're not just consuming existing content from a network, but want to publish data or build an application that adds data, you'll want to dig a bit more into the Data Models of these protocols to see what fits best with your use case.
Different data models can suit different applications with regards to how often data is changed, how big your datasets are, how much data is shared between datasets, and how you want to access the data from disk.

### Data Model - BitTorrent

BitTorrent is great in that they were very successful at making peer to peer file transfer "just work".
It's data model is based on a concept called "Content Addresibility" where the data inside a torrent gets put through a [hash function](https://en.wikipedia.org/wiki/Hash_function) which generates a unique value based on the content.
If you have the `hash` of some data, you can verify whether data from another peer is valid by checking if it hashes to the same value.
If even a single byte of the data is different form the original, the hash will be different and you can ignore the data from the peer.

Instead of hashing the entirety of the data at once, BitTorrent splits up the files and folders in the torrent into a tree of "nodes" that link to each other using hashes for IDs.
This is called a [Merkle DAG](https://en.wikipedia.org/wiki/Merkle_tree) (Directed Asyclyc Graph) or Merkle Tree.
The files themselves are split into chunks of a few kilobytes or megabytes in size and added as their own subtree within the merkle dag.
This is what enables a torent client to download small bits of files from multiple peers at once and verify their data independently rather than needing to load an entire file before verifying it.

A torrent is then identified by the top-most hash in the tree which is called the InfoHash which is stored within the bittorrent magnet link.
A `.torrent` file will contain some metadata about a torrent along with the merkle tree for the files and folders (without having the actual file data) which can then be used to varify data.
This also means that by default, if two torrents contain the same chunk of data, they won't be able to share peers in order to discover that bit on the network.

One consequence of this is that torrents are [Immutable](https://en.wikipedia.org/wiki/Immutable_object) and in order to change some data within it, you would be required to create a new torrent with a new infohash.
This applies not only to the files within the torrent, but any metadata about the torrent such as it's `name`, `description`, or creation date will affect the final InfoHash.

Another consequence is that a torrent with a very large set of files,
or with files that are incredibly large will have a very large merkle tree and a very large `.torrent` file which might be slower to load and traverse.

Data in BitTorrent is usually saved by storing the torrent metadata somewhere in application memory, and storing the files for a torrent within the filesystem.
On boot a torrent client will typically verify all the existing data on disk to see what chunks are missing or need to be re-loaded.

### Data Model - IPFS

IPFS is similar to bittorent in that it operates on Merkle Trees, but instead of grouping data together under a single infohash, it focuses on addressing each chunk of data individually.

IPFS uses a data format called [IPLD](https://ipld.io/) (Interplanetary Linked Data) which takes Merkle Dags to the next level by creating a powerful data model with different "types" and ways of traversing data.

IPFS builds on top of IPLD by describing a format for data to represent files and combines it with it's p2p network to publish and load files.

Unlike BitTorrent, if two datasets in IPFS contain the same data, it's easy to share peers between them to find data and to deduplicate storing this data on disk.

Like BitTorrent, IPFS datasets can be referenced using the hash of the root of their merkle dag which they call the CID (Content IDentifier), and in order to change any data, you will need to generate and share a new CID.
Unlike bittorrent the formats of the hashes used for CIDs are flexible and the same bit of data can use different hashes.
The different hash functions and encodings are defined in the [multiformats](https://github.com/multiformats/js-multiformats) specification.

Another advantage of IPFS over BitTorrent is that large datasets can be handled by sparsely loading just the chunks that you need as you traverse the merkle dag.
E.g. if you have millions of files, but only need one, you can traverse the graph just accross the nodes that point to that file and ignore the rest of the dataset.
However, this sparseness can be slower since you will need to wait for individual nodes along the path to be fetched from the network as you traverse the dataset.

IPFS stores data with "repositories" or "block stores" which can be configured to store data in various formats.
These formats are typically very different from the file data they represent so it's a lot harder to mirror an IPFS dataset directly to the filesystem, and doing so will require storing data both inside IPFS's blockstore and on your filesystem, potentially duplicating the amount of storage necessary for using with other apps.
Generally, the "blockstore" handles storing binary data which represents the encoded IPLD nodes or raw buffers so it can be very space efficient whe combined with deduplication.

### Data Model - Hypercore

Hypercore deviates a bit away from content addressability in that it uses Merkle Dags to represent an "append-only log" where you can add new blocks to the end of the log but not change any earlier ones.

This log is represented using the [SLEEP file format](https://github.com/dat-ecosystem-archive/DEPs/blob/master/proposals/0009-sleep-headers.md).
A consequence is that you can easily specify ranges of data or large subsets using [Bit Fields](https://en.wikipedia.org/wiki/Bit_field) which can reduce the number of data needed to tell a peer what data you have.
Another useful feature of SLEEP based append-only logs is that you can sparsely load chunks form them and varify that a given chunk is part of the history without needing to download the entire log.

Instead of referring to data by it's root hash, Hypercore uses [Public-Key Cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) to sign the root of the SLEEP Merkle Tree and peers will store the signature along with the Merkle Tree nodes that lead to that data in order to verify individual blocks.
The public keys use [Ed25519 Elliptic Curves](https://en.wikipedia.org/wiki/EdDSA#Ed25519) and hashing is done via the [BLAKE2b hashing algorithm](https://en.wikipedia.org/wiki/BLAKE_%28hash_function%29#BLAKE2b_algorithm).
The append only log is useful in that it's easy to represent data on disk by appending to a regular file, and can get very good performance for large datasets.

On top of this append only log abstraction, the Hypercore community uses the [Hyperdrive](https://hypercore-protocol.org/guides/modules/hyperdrive/) filesystem abstraction which stores a tree of file metadata (using [Hash Array Mapped Trie (HAMT)](https://en.wikipedia.org/wiki/Hash_array_mapped_trie) data structure) where each node in the "tree" is appended to the log, and individual nodes are referenced by their index within the log.

This enables very fast lookup since you can exchange bitfields with remote peers to download the subsets of the trie that you need and load just the content that's relevant.
The actual file data is stored in a separate hypercore log so that you can easily stream files into it and link to just the range within the log in the file metadata rather than needing the whole merkle tree or to mix data with the HAMT informaiton.

The usage of mutliple files per append only log can add up in that you need 4-8 file descriptors per dataset which can add up really quickly if you're loading hundreds of logs.

Hypercore also suffers from the same limitations of BitTorrent in that data isn't shared between datasets, but the tradeoff is that data within the dataset is a lot faster to discover and load.

Similar to IPFS hypercores store arbitrary binary data and uses encoding just for the nodes within the HAMT structure from Hyperdrive.

### Data Model - SSB

SSB takes a similar approach to Hypercore in that it uses append only logs (called Feeds) to represent data.

A difference from Hypercore is that instead of using SLEEP files to store logs, it uses JSON files with "backlinks" that point to previous entries within the append only log.
Each item within a feed contains some JSON data which is signed by a users Public Key.
Each item also typically contains a `type` which can be used to differentiate data that's to be used for things like Chess from regular social-media style posts.

There's also been some work on new feed formats, but as of March 2022 things have not fully stabilized.

These messages are typically traversed and processed into local databases along the lines of the [Kappa Architecture](https://milinda.pathirage.org/kappa-architecture.com/) for processing ordered streams of data.
The local indexes are then used by applications to load data that's relevant to them.

The actual messages themselves are typically stored along side the indexes within the local SSB database rather than needing extra files to store data like in Hypercore.
The tradeoff is that you can potentially handle more feeds without running out of file descriptors, but bottlenecks in processing JSON and verifying JSON blobs can make SSB slower anyway.

Another consequence of the way SSB feeds work is that they don't have the ability to be "sparse" the way other protocols can.
In order to verify that the "latest" item in a feed is indeed valid, you need to have processed the entire history and indexed all the data first.
This makes the "initial sync" for SSB take a very long time before users can start interacting with the application.

However, this has the advantage of data being more "available" once its loaded since you will have peoples entire feeds locally and won't need to reach out to the network to load data as it's already loaded.

Since JSON isn't the best for storing large chunks of binary data, SSB implementations also have a method of exchaging arbitrary [blobs](https://github.com/ssbc/ssb-blobs) of data which are content-addressible.
These blobs are referenced by peers' feeds and typically get loaded on-demand into a local "blob store".

In addition, SSB has plugins for storing more advanced data types like [git-ssb](https://scuttlebot.io/apis/community/git-ssb.html) which the community has used to host repositories or websites that can be accessible by replicating feeds and have their own tradeoffs outside of the core protocol.

## Mutability

One thing that you'll want to consider when using a protocol is whether and how often you'd like to update data.
Different protocols have different levels of support which can work better or worse depending on your use case.

### Mutability - BitTorrent

BitTorrent by default is immutable, so you will need to creat new torrent and figure out side-channels to distributing them to peers that might be interested in loading them.

However, there's been some work on supporting "mutable" torrents and being able to discover updates to torrents via the BitTorrent network in the form of the [BEP 46 proposal](http://www.bittorrent.org/beps/bep_0046.html).
It works by using public keys to sign DHT entries which contain the InfoHash of your latest version, as well as a sequence number which can enable you to discover just the latest entry.
Sadly, marjor clients don't really support mutable torrents, and there are very few minor clients that support it.
Agregore (as of March 2022) has been working on making it easier to publish and load mutable torrents, and there have been [efforts in the past](https://medium.com/@lmatteis/torrentnet-bd4f6dab15e4) to build applications on top of this functionality.

However, even if you use BEP 46, it's use of the DHT means that updates require polling for changes every now and then, and there's a lot of low hanging fruit for replacing this with some sort of extension that will speed up initial discovery and updates.

Generally BitTorrent is useful for things like archives where you want to download the entire dataset to disk and then make it available to other programs to use, and are okay with pulling updates to the dataset manually if at all.

### Mutability - IPFS

IPFS has had mutability from early on in the form of [IPNS (InterPlanetary Name System)](https://docs.ipfs.io/concepts/ipns/).

Initially it worked similarly to BitTorrent's BEP46 in that you could use public keys and a sequence number to point to an IPFS CID for your latest data.
This had the same limitations of BitTorrent's BEP46 where you would need to periodically poll the DHT to find updates and was generally prone to errors.

The latest version of IPNS can make use of an experimental [Pubsub](https://github.com/ipfs/go-ipfs/blob/master/docs/experimental-features.md#ipns-pubsub) APIs.
It works by creating publush/subscribe swarms of peers in libp2p which listen on the public key address and broadcast updates between each other so that peers can be notified shortly after a new update takes place.
This still requires enabling some experimental flags in your IPFS config, but it can drastically improve the ability to update data and rather than waiting 30 minutes for the next DHT pool interval to happen, you can instead get the update in milliseconds.

Finally, you can sidestep the public key cryptography entirely and instead use DNS TXT entries to point to CIDs using the [DNSLink standard](https://www.dnslink.io/).
This has the benefit of letting users type in familiar-looking DNS hostnames like `ipns://example.com` rather than trying to copy long cryptic public key strings.
The downside is that updates have the issues of DNS entries typically taking a while to propogate, so you can't rely on this if you want something faster than 30 minutes or a few hours.
You should also note that using DNS entries makes it easier to censor an IPNS website and resolving links might not work if you can't connect to a DNS provider on the internet, unlike public key based IPNS which can work entirely on local DHT networks.

One approch that can be useful is to point your DNSLink address to an IPNS link with PubSub enabled so that you can take advantage of the readability of DNS hostnames and the speed of IPNS pubsub.

Also note that the support for IPNS features varies drastically between implementations with go-ipfs being the most stable (as of March 2022).

By default IPNS can be useful for updating something like a website where you don't mind waiting a bit for users to get the latest version, but it can get faster if you're willing to mess around with experimental pubsub settings.

Outside of the core IPFS APIs, there's other methods of updating data such as [Textile](https://twitter.com/textileio) or blockchain based approaches like [ENS](https://ens.domains/).

### Mutability - Hypercore

Since Hypercore uses public keys for identifying content, it can be very fast for getting the "latest" version of a dataset.

When two peers connect to each other they exchange information about what the latest index is for a given feed that they have replicated locally.

From there, if a peer has enabled "live" mode on their connection (which is enabled by default), as soon as they get an update that's newer than what they already had, they'll update their direct peers about it.

This works similarly to the IPNS pubsub method of gossiping in that the peers that are actively replicating the data for a hypercore are also spreading updates.

Even though the append-only-log is immutable, modifying a file within a Hyperdrive can propogate out pretty quickly to other peers and is viable for distributing data in the form of JSON files.
Peers are even able to easily `watch()` for changes at a given part in a Hyperdrive file tree and get notifications to their code when a new version is available.

In my experience, hypercore mutability has been the most reliable and fastest of the protocols described here.

### Mutability - SSB

Simmilarly to Hypercore, SSB's public keys and active replication streams mean that data can propogate fairly quickly via peers.

One difference is that the network topology of SSB relies more on central "pub" servers and "rooms" to discover peers, but you can generally expect data that you publish to be out and indexed by other applications within a second or two of posting it.

However, if you're using SSB to post social data the way Manyverse and Patchwork do, you'll need to make users aware that their posts are immutable and cannot be changed, or you will need to create a method for updating past entries which can change how the post is displayed, but cannot remove the traces of the older version of the post (due to how feeds work at the moment).

Similarly, blobs are immutable, so you'll need to have a layer on top for changing pointers to a file blob in the same vein as git-ssb.

SSB mutability works in tandem with the sorts of applications you build on top and can work for cases where you're periodically pulling updates or have near-realtime interactions (such as SSB Chess).

## Peer Discovery

In addition to content on these networks, you'll likely want to think about how peers connect to each other and actually load it.
Important questions are whether you're okay with communities needing additional servers for reliability, whether NAT hole punching is necessary for things to work, and how much extra traffic you're okay with having for peer discovery.

### Peer Discovery - BitTorrent

BitTorrent has been around longer than all the other protocols in this list and as such has solved a lot of issues around content discovery.

Initially, peers would be discovered using Tracker servers.
Torrent files or magnet links would come with a set of servers to use for peer discovery along with built in tracker servers that would come with some torrent clients.
Peers that were looking for others around a given torrent file, would advertise themselves.

This, however, made it easy to censor torrents and the network at large.
If a given tracker could be blocked or taken down, then peer discovery could be broken.
In order to avoid this point of centralization, the [Mainline Distributed Hash Table](https://en.wikipedia.org/wiki/Mainline_DHT) was made to decentralize the peer discovery mechanism.
Instead of a central server being used for peer discovery, peers would spread the load of storing advertisements and serving them with others across everyone participating.
The more popular mainline becomes, the harder it is to censor all of it.

In addition to finding peers online, BitTorrent also has a [Peer Exchange (PEX)](http://bittorrent.org/beps/bep_0011.html) protocol where peers that are connected together can exchange the IPs of peers they're connected to which can span accross trackers and skip the DHT.

Finally, BitTorrent also supports discovering peers on the local network via [BitTorrent LSD](http://bittorrent.org/beps/bep_0014.html) which works by sending UDP multicast packets to everyone on the local network and having peers listening for announcements from other computers on the same network.
With this in place you don't even need a connection to the internet to exchange data, but can do so over whatever IP network you have available as long as it supports UDP multicast.

One thing to note is that connecting peers between most home or corporate networks requires [NAT hole punching](https://en.wikipedia.org/wiki/Hole_punching_%28networking%29) to let the computer within a home netowork tell other computers on the internet what it's public IP address and port are in order to establish a connection.
BitTorrent enables this via a combination of [UPnP](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) to specify ports on routers that support it, and the [NAT Hole Punching](http://bittorrent.org/beps/bep_0055.html) extension which can leverage connections to a mutual peer in order to connect two peers together.

Different BitTorrent clients will have different levels of support for these functionality, but most of the core libraries are good enough for establishing connections between most computers.

One thing to note is that peer discovery happens per-infohash so your app will need to join several "swarms" and perform several rounds of advertisement in order to find peers for each dataset.
This can add up if you're loading hundreds of torrents on a single machine, particularly since you'll be establishing connections with a few peers at once in order to do adequate downloading and uploading.
The protocol itself also doesn't provide the abillity to reuse existing connections since each replication stream is per-torrent.

Overall BitTorrent's content discovery is mature and reliable, but has some legacy issues that limit it's potential.

### Peer Discovery - IPFS

IPFS employs some of the same methods as BitTorrent, but from the perspecitve of getting to see Mainline DHTs run for a while as well as seeing other p2p networks grow.

It takes a hyper-modular approach to networking within the [libp2p](https://libp2p.io/) library which lets you swap out different peer discovery mechanisms, different network transport mechanisms, and different transport layer security libraries. 

Unlike BitTorrent's network connections, libp2p connections are general purpose and can multiplex several streams of data over a single connection.
This gives the potential to reuse connections between different parts of a program.

What's interesting is that in addition to TCP and UDP for connecting peers, it can seamlessly integrate other transports like QUIC which can have better perfromance and security guarantees than TCP and WebRTC which can easily bridge web browsers to the rest of the network.
In fact, there's even support for connecting peers over a device's [Bluetooth connection](https://berty.tech/blog/bluetooth-low-energy/).

Since IPFS focuses on arbitrary data via CIDs, data exchange is done at the CID level and is a separate step from peer discovery.
This means that if you're looking for a new chunk of data, you can ask your existing peers if they have it before needing to search the DHT.

Outside of this, IPFS is actually very hungry with network bandwidth since it will do content discovery for each piece of content in the Merkle Tree that you're loading up.
This means that even if you're traversing a single dataset, you can quickly overtake the amount of traffic a trorrent client does for peer discovery for several torrents at once.

Libp2p also hasn't had as much time to solve the NAT hole punching issue, so connecting two computers on home networks is typically not as reliable as BitTorrent.
This has actually improved very recently as you can tell by [this announcement in March 2022](https://blog.ipfs.io/2022-01-20-libp2p-hole-punching/).
Initially libp2p would try to rely on UPnP being available in order to open ports, same as BitTorrent.
More recently, they got first class support for NAT traversal via a combination of using [AutoNAT](https://github.com/libp2p/specs/blob/master/autonat/README.md) to determine if you are behind a NAT, and a [public relay node](https://docs.ipfs.io/concepts/glossary/#circuit-relay) to let the two peers talk to each other.
This is very simular to what BitTorrent clients do, but using Libp2p features rather than extensions over torrent replication streams.
At the moment (March 2022), you'll need to explicitly enabled with the `Swarm.EnalbeHolePunching` configuration flag.
Also note that NAT hole punching will only work with transports that use UDP, so TCP and WebRTC based connections will not benefit from this functionality.

Similarly to BitTorrent, a lot of the peer discovery relies on the libp2p DHT.
It uses the same routing algorithm as Mainline (Kademlia), but it uses a different format for encoding data and has different constraints on how peers can advertise themselves.

As well, libp2p supports local peer discovery via [Multicast DNS, Aka ZeroConf, Aka Bonjour](http://multicastdns.org/) which is similar to the BitTorrent LSD protocol in that it uses UDP multicast to discover other peers.
Unlike BitTorrent LSD, some operating systems like MacOS may have existing daemons running on the machine which are binding to the MDNS port and can interfere with an application's peer discovery process.

Finally, you can offload some of your connectivity to relay nodes within the network for cases where it's unrealistic for two nodes to get connected themselves.

Do note that since IPFS is more recent than BitTorrent there's more variation between clients and applications based on which versions of specs they support.
The most reliable metric is probably the Golang implementation, but Rust and JavaScript seem to be close seconds.

Overall, IPFS's network layer is extremely flexible and is good for projects that might want to customize what protocols are used to transmit data while being decently reliable.
However, it's also the most network hungry out of the box, so you may need to tweak things depending on your deployment environment.

### Peer Discovery - Hypercore

Hypercore encasulates most of it's network code inside the [Hyperswarm](https://github.com/hyperswarm/dht) module.

They managed to get some hole punching tricks a bit earlier than libp2p so historically their peer discovery was a bit more reliable.

Similarly to IPFS and BitTorrent Hyperswarm uses a Kademlia based DHT with it's own encoding scheme.
A unique feature of the Hyperswarm DHT is that node 'ID's are dependent on their IP+port combos which helps mitigate against Syblic attacks where a peer fakes their ID in order to get "closer" to a given content ID that they're trying to censor or track
This has the tradeoff of only allowing nodes that have stable IP+port combos in the DHT which reduces overall nodes, but improves overall reliability of nodes.
Unlike libp2p, the hole punching code runs entirely via DHT nodes where peers can use DHT nodes as relays to signal connections to other peers that a DHT node might know.
This functionality has been worked on in the latest release of Hyperswarm and hasn't been propogated to some apps like Agregore yet, so note that not all of the hypercore ecosystem has gotten this functionality yet.

Hyperswarm also makes use of MDNS for local peer discovery and has the same tradeoffs as libp2p.
In fact, the JavaScript implementation of [multicast-dns](https://www.npmjs.com/package/multicast-dns) is reused between hyperswarm and js-libp2p.

Similarly to BitTorrent, Hypercore discovers content based on entire datasets at once rather than individual bits of files.
On top of that, it has aggressive connection reuse and can multiplex replicating multiple hypercores over a single replication stream.
This means it can make efficient use of network resources by not being too chatty for peer discovery, and by reusing existing connections as much as possible.

The latest version of Hyperswarm brings built-in encryption for connections which integrates with DHT peer discovery.

Generally, Hyperswarm combined with Hypercore is very efficient with it's network usage and can connect peers reliably between different network configurations.
Even though it's fairly modular, it doesn't give as fine grained control over the protocols used for connecting and the encryption schemes, so custom transports like Bluetooth would require a lot more work.

### Peer Discovery - SSB

SSB has a completely different approach to the other protocols in that they consider DHTs a privacy risk.
When you use a DHT for peer discovery, you expose your private IP address to the world and if somebody knows the ID of a piece of content, they can discover the home IP addresses of anyone that's trying to seed or download that content by doing an IP lookup.

Instead of the DHT, SSB peer discovery relies on your social graph by using `pub` servers which act as always-online peers that follow and backup people's data, and `room` servers which act kind of like private trackers that can let peers exchange IP addresses if they've been granted access to the SSB room.

This means that a user joining SSB for the first time won't be able to find data from others unless they can get a connection into somebody's social graph and start replicating data.

More leeway is given to doing local-network peer discovery. Two computers can find each other using multicast UDP and present users with a UI to choose to replicate data with each other.

Some apps like Manyverse also offer the ability to connect two phones using Bluetooth for cases where there's no wifi infrastructure for them to discover each other.

Similar to Hypercore, SSB can replicate several feeds over a single connection, and has some mechanisms for deduplicating connections.
In addition to the connection deduplication it makes use of a protocol called [Epidemic Broadcast Trees](https://github.com/ssbc/epidemic-broadcast-trees) which helps prune unnecessary connections within a swarm.

SSB's peer discovery is useful in that it preserves privacy better than DHT based alternatives, but it is limited for data that is "one to many" where consumers of content might not have a social connection to the producer of content.

## Security / Privacy

When thinking about data, one should also consider the security and privacy implications of protocols.
This includes things like whether an ISP or [Man In the Middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) can see or modify data that you're sending around,
the sort of metadata and data that you're leaking to the network when you share data,
and whether content can be privately encrypted.

One thing to note is that when considering [Information Theory](https://en.wikipedia.org/wiki/Information_theory) any data that you make available is hard to erase once it's out.

### Security - BitTorrent

By default, BitTorrent places all of it's security guarantees into the InfoHash.
That is, it tries to guarantee that content you've downloaded from peers is the same as the original dataset that was used to create the infohash.

That means that by default, BitTorrent did not have any sort of content encryption, and network operators or snoops could intercept and modify any BitTorrent traffic.
For example, this could give a network operator direct access to whatever files you were downloading or uploading.
This has since been addressed via the [PE/MSE](https://en.wikipedia.org/wiki/BitTorrent_protocol_encryption) extension to the protocol which encrypts the replication stream between two peers.
This means that most modern clients don't need to worry as much about MITMs intercepting their data.

However, even with that in place, BitTorrent's privacy guarantees aren't great.
Services and bots periodically scan the DHT for InfoHashes of content which also enables them to download metadata and content for any torrent.
This means that any data you publish in a torrent is effectively public and if you want it to be more private, you will need to manually add layers of encryption to the files themselves.

Additionally, BitTorrent used [md5](https://en.wikipedia.org/wiki/MD5) for it's hashing algorithm for Merkle Trees, which has been since proven to be insecure.
That meant that all older torrents that used v1 of the protocols would potentially be vulnerable to peers lying about contents by generating md5 hash collisions.
This has since been fixed in [BitTorrent v2](http://bittorrent.org/beps/bep_0052.html) by switching to the `SHA2-256` hash algorithm which has not yet been broken.

With regards to content being cached, anything you publish might get backed up by third parties which you cannot force to delete data that you don't want shared anymore.

Overall, you probably shouldn't use BitTorrent for storing anything you absolutely want private or haven't encrypted.
This is in addition to the concerns about your IP address being easy to find if you're seeding some content.

Some people have managed to avoid leaking their IP addresses when using BitTorrent by using the [i2p network](https://geti2p.net/en/docs/applications/bittorrent), but most torrents will not be availabl, and it requires connecting to trackers since i2p does not support a BitTorrent DHT.

### Security - IPFS

IPFS has a slightly better approach to transport encryption with libp2p by making use of [TLS 1.3](https://www.ietf.org/blog/tls13/) or [Noise](https://noiseprotocol.org/) as a standard for connections.
This makes it harder for MITMs to analyze the contents of a libp2p connection and prevents tampering of the connection.

However, IPFS has similar privacy guarantees to BitTorrent in that any content published on the network can be discovered by scouring the DHT and attempting to load it from other peers.
This is doubly troubling in that individual files are advertised on the DHT rather than entire datasets, so it's easier to find every single computer in the world trying to load the pdf of [Riot Medicine](https://riotmedicine.net/) for example.

You can take a similar approch to BitTorrent by encrypting individual files before sharing them (which is the Approach taken by wrappers like Textile.io), but then you lose the ability to share peers between datasets and to deduplicate content on disk out of the box.
Another downside is that you cannot use this encryption on IPLD data if you want to be able to backup your content on a pinning service since a pinning service would no longer be able to see the tree structure.

Similar to BitTorrent, you probably shouldn't be storing anything you want kept private, and doubly you might want to think twice about announcing your IP address if you're worried about your government or copyright holders taking interest.

Also similar to BitTorrent, you cannot force peers that have a copy of your data to delete it.

Support for hiding IP addresses in IPFS has been attempted by integrating [TOR](https://www.torproject.org/), but most implementations are still [works in progress](https://github.com/berty/go-libp2p-tor-transport).

### Security - Hypercore

Hyperswarm also makes use of the Noise protocol for replication and can prevent snooping and interception of p2p connections.

However, it's a bit better for keeping content private in that it takes a different approch to identifying content on the DHT.
Instead of advertising the public key for hypercore, it advertises a hash of the public key called the "Discovery Key".
It then avoids revealing the public key to peers until they do a cryptographic proof that they know it already.
This way if you can keep your public key secret, you can use the DHT to advertise data on the network.

The discovery key trick breaks down if you want to back up your data on a pinning service since you would need to provide it with the public key in order for it to be able to download data from the network.
However, this can be further mitigated with built in encryption.
When initializing a Hypercore, you can pass in an optional [Encryption Key](https://github.com/hypercore-protocol/hypercore-next#coreencryptionkey) which will encrypt all the contents and would require another party trying to load the contents to provide it in order to read the contents.
This still allows storing complex data within a hypercore because the raw SLEEP data representing the append only log is still available to pinning services even if they cannot read the content thats inside.
Specifically, unlike IPFS, you can encrypt the structure of your entire file tree while still being able to back it up.

The combination of the discovery key and encryption key makes it easier to justify storing private data within Hypercore based apps without needing extra encryption at the application layer or sacrifycing too much performance.

The IP address leaking that's inherent to the other protocols is still there, however, and just like BitTorrent, if your public key (or discovery key) is known to be of interest, your home IP address can be detected by a third party.

As well, although Hypercore can support deleting content in a log, there is no way to tell other peers to delete the data.

There has been talk about using I2P or TOR with Hyperswarm in the past, but as of March 2022, there is no working implementation.

### Security - SSB

Like the other protocols, SSB has transport level encryption via the [Secret Handshake](http://scuttlebot.io/more/protocols/shs.pdf) protocol.
This means that it also protects against MITM attacks and keeps the connection between two peers encrypted.

On top of that, it has a similar approch to Hypercore where feeds that are being replicated only if both sides can prove that they already know who they are.
This gets extended with additional verification of both peers so they can know where they sit in relation to their respective social graphs before deciding whether to replicate data.

Although there is the risk of random pubs in your social graph getting access to your IP address, its generally better protected than DHT approaches.
In particular, apps like Manyverse let users opt-into replicating with pubs.

As well, the lack of content-based peer discovery means that the content you're loading will not be discoverable unless a person is within your social graph.

For additional privacy, members of the community have managed to create plugins for SSB which enable [TOR](https://handbook.scuttlebutt.nz/faq/misc/tor) which can associate a hidden service address with your account so that other TOR SSB users can connect to you directly.

Similar to the other protocols, content that's published on SSB stays on SSB as long as somebody out there has a copy.
This is moreso true for SSB since peers you replicate with will fully backup your feed and fully replicate it out to anyone else that can load it.
With other protocols you have a higher chance that data you produce is just never seen by anybody, but if you replicate with anybody, there's a guarantee that at least one backup is out there.

Out of the box SSB is great for cases where you value IP privacy if you trust your social graph not to leak it, and can be further enhanced with TOR to avoid leaking your IP even to people you trust.

## Performance

One metric that's useful to consider when choosing protocols is over all performance.
What feels "fast" when a user tries to load data?
How hot will my computer get from loading data?
How much network traffic can I expect when using the protocol?
How much data can I expect to be stored when using the protocol?

### Performance - BitTorrent

BitTorrent performance is best described as "good enough".

it's use of [uTP](https://www.libtorrent.org/utp.html) means that it won't hog bandwidth away from other applications.

Most implementations are fairly optimized by now and you can expect it not to use too much RAM or CPU when processing data.

Sadly, this degrades as the number of files you're loading gets bigger.

Loading all of Wikipedia over BitTorrent isn't very viable due to the size that just the `.torrent` file metadata would need to be in order to list all the files and individual chunks.

Large datasets can be optimized by storing them into [SQLite databases](https://github.com/bittorrent/sqltorrent) within a torrent and sparsely loading chunks from the torrent on-demand.

Similarly, networks speeds are fast enough that you can load a video from a decently-seeded torrent on-the-fly as your're streaming it.

### Performance - IPFS

IPFS is often used for loading web content, and the initial load time can vary depending on the data.

Generally, anything using IPNS will take significantly longer to load (particularly without pubsub or DNSLink), and regular IPFS CIDs can vary based on the number of peers.

One thing you can guarantee is that after the initial load, reloads will be almost instantanious.

An active IPFS node can noticeably start to use up resources as it will be talking to the network and will be processing data a lot more than other protocols.

Large datasets can perform better than BitTorrent since the HAMT structure of large folders allows you to load just a subset of the Merkle Tree for a dataset on the fly.
Seeding a large dataset can be much more expensive since by default each folder and each file chunk will need to be announced on the DHT and the local network individually.

Performance with IPFS is something you might want to tune based on your application, but can yield decent for medium sized datasets just out of the box.

### Performance - Hypercore

Hypercore's data model and Hyperswarm's DHT are both optimized to reduce overall network traffic and Round Trip Time for getting a range of data from a remote peer.

As such is performs well for querying large datasets with less delay than other protocols.

However it can start to struggle as the number of hypercores you're replicating grows.
That is, if youre application is loading hundreds of hypercores at once, you can start to run into bottlenecks with using file descriptors, and in-flight network requests.

Depending on how you structure your application, the initial load can be very fast, and subsequent loads are near-instantanious.

This is also boosted with in-memory caches that get automatically generated for Hypercores.

### Performance - SSB

SSB performance struggles the most among these protocols, in particular when using it in a social context where you're loading feeds from many peers.

It's requirement of loading entire feeds from all peers means that the "initial load" will take a while as data is loaded and indexed into the local database.

After the initial load, the local indexes of the DB can make queries within your application fast enough to keep your application snappy.

Thankfully, the community has been actively working on improving the performance pain points by creating new feed types and new indexing methods.

## Implementations

When building something on top of a protocol, or purely for personal preferences, it can be important to know what programming languages and environments support a given protocol.
Sometimes, if a protocol doesn't support your language or operating system of choice, it's less viable for whatever use case it has regardless of other tradeoffs it offers.

### Implementations - BitTorrent

Since BitTorrent has been around for a while, it can boast having stable implementations in different programming languages as well as having stable specifications for loading data in between them.
For example, you can be sure that if you're running a major operating system, that there is a torrent client out there that will work well enough for your use case.

For C++ enthusiasts, [libtorrent](https://www.libtorrent.org/) is the gold standard for building clients as it's feature rich and performant.
This might also be your choice if you want to embed BitTorrent in a different programming language via Foreign Function Interfaces.

Another useful implementation is [WebTorrent](https://webtorrent.io/desktop/) which enables web browsers to load torrents (if they have webrtc-compatible seeders).
This implementation works with Node.js in order to bridge the regular BitTorrent network with the WebRTC/Browser based network by running hybrid nodes that can do both.

However, if you search up for implementation in your language of choice, it probably exists already with various states of completion.

### Implementations - IPFS

IPFS has been leading the way among new protocols with publishing detailed specifications of how their protocol works, and has several active implementations.

[Go-IPFS](https://github.com/ipfs/go-ipfs) is the most stable and "canonical" implementation of the protocol which contains all the bells and whistles from the spec and is written in the [Go](https://go.dev/) programming language.
One of the tradeoffs to consider when using this implementation is that Go can be a bit memory hungry and requires larger binary sizes when distributing applications do to its need to bundle the Go runtime libraries.
However, this is most likely to be stable from all implementations and get the most support from official sources.

[JS-IPFS](https://js.ipfs.io/) is a JavaScript implementation of IPFS which can work both inside web browsers, and [Node.js](https://nodejs.org/en/)
It's stability is a bit behind go-ipfs, but it's a decent alternative and the only one if you're constrained to browser runtimes.

[Rust IPFS](https://rustipfs.com/) is the newest implementation and has a focus on performance and efficiency.
A lot of this efficiency comes from using the [Rust programming language](https://www.rust-lang.org/) which has a novel method of dealing with memory management and type systems to create very fast and memory safe code.
It might be lagging a bit behind go-ipfs in terms of overall features but it's usable for a lot of use cases and even has an [embedded mode](https://github.com/ipfs-rust/ipfs-embed) which is meant to be run in highly constrained environments like IoT devices.

[gomobile-IPFS](https://github.com/ipfs-shipyard/gomobile-ipfs) for brings IPFS to iOS and Android by compiling Go to run natively and to generate bindings for Swift and Java.

Finally, other programming languages have various degrees of support, but if you want to use IPFS but don't want to reimplement the entire specification, it's easy to make use of the [IPFS Daemon HTTP API](https://docs.ipfs.io/reference/http/api/) which can give your application access to all IPFS functionality using HTTP requests.

### Implementations - Hypercore

Hypercore Protocol only has a single canonical implementation in JavaScript with a focus on Node.js compatbility.

One can also run parts of Hypercore in web browser by compiling the codebase with tools like [Browserify](https://browserify.org/), using WebRTC to connect browser peers, and [relaying calls to the DHT](https://github.com/hyperswarm/dht-relay) using Websockets.

There has also been some work on a [Rust](https://github.com/datrs) implementation which made progress on the older version of the protocol that was used with the Dat CLI, but it has not been brought to a usable state yet.

### Implementations - SSB

The main implementation of Secure Scuttlebutt is in [Node.js](https://github.com/ssbc) with some bits were [implemented in Rust](https://staltz.com/rust-for-mobile-not-yet.html) before reverting back to JavaScript.

[Planetary](https://github.com/planetary-social/planetary-ios) is an SSB app for iOS which uses a [Go implementation](https://github.com/cryptoscope/ssb) of SSB.

There is also a Rust implementation in the [Peachcloud](https://github.com/peachcloud/ssb) project which has been making progress to be compatible with the rest of the ecosystem.

Finally, the JavaScript version of SSB has also been used on both iOS and Android via [Manyverse](https://www.manyver.se/) by embedding it via [nodejs-mobile-react-native](https://github.com/janeasystems/nodejs-mobile-react-native).

## Backups (Seeding/Pinning/etc)

One issue that peer to peer based apps face is that if there is no peer online with a copy of some data then new peers will be unable to get a hold of it.
This is usually solved by having "Super Peers" which are always online and will keep a backup of your data for you even when you're offline.
Most systems can work without this functionality if peers can rely on being online at the same time frequently enough that they can sync, but it's usually a good thing to handle.

### Backups - BitTorrent

BitTorrent typically uses [Seedboxes](https://hackernoon.com/how-to-use-a-seedbox-to-download-torrents-anonymously-and-fast) which are servers that are meant to stay online all the time in order to keep torrents seeded.

There's many different implementations of seedboxes out there, and they can sometimes be in the form of somebody running a torrent client from a command line on a server, and connecting to it to add more torrents.

This means that you have a lot of choice in how your backups run, but it comes at the cost of there not being standaridzed ways of backing up data.

### Backups - IPFS

IPFS improved on the concept of seedboxes with [pinning services](https://docs.ipfs.io/how-to/work-with-pinning-services/) which explicitly implement a minimal HTTP [API](https://ipfs.github.io/pinning-services-api-spec/).

This means that different services like [Pinata](https://www.pinata.cloud/) and [Fleek](https://fleek.co/) can have their own methos and payment systems for backing up IPFS data, but can act as commodities which allow a user to use different client applications to tell them to pin something.

On top of the seedbox concept, IPFS has a cryptocurrency called [Filecoin](https://filecoin.io/) which makes it possible to automatically find peers on the network which can be payed in FIL to back up your data.

### Backups - Hypercore

Hypercore doesn't have a standard for pinning services at the moment.

There's self-hosted services like [dat-store](https://github.com/RangerMauve/dat-store) which can be used to pin data onto remote machines, but they are community efforts. (Disclaimer I made dat-store 🤪).

An alternative is to create a BitTorrent style seedbox where you run the [hyperspace daemon](https://hypercore-protocol.org/guides/getting-started/hyperspace/) on a VM and use the [hyp CLI](https://hypercore-protocol.org/guides/hyp/seeding-data/) on it to get it to seed data.

### Backups - SSB

SSB relies on your social graph and on pubs to back up your data.

Peers will fully replicate data for their friends and their friends of friends by default, so periodically connecting to a friend is enough to keep your data backed up.

An alternative which can improve reliability is to use SSB Pubs which are like friends that live in the cloud where you can have a pub add you as a friend and be always online for backing up your data and data of your friends.

Pubs in the SSB network can talk to each other to replicate data, so if people are mutual friends with pubs, they can potentially share data via it automatically.

## Conclusion

Hopefully this has given you some insight into the differences and similarities between different protocols and has given you insight into why there isn't a clear tool to use for every occasion, but instead a series of tradeoffs to choose from.

If you're interested in building something decentralized, consider looking at what tradeoffs matter most to you, and try playing around before settling on a final option.

For those that don't want to settle on a single protocol, check out useful cross-protocol projects such as [Distributed Press](https://distributed.press/) or the [Agregore Browser](https://agregore.mauve.moe/).

---

Last Updated: March 5 2022
