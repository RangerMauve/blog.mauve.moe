# Decentralized Web

Hello, today we'll be looking at the decentralized web and how peer to peer protocols and data structures can help you make local-first applications.

## WHOAMI

My name is Mauve, my pronouns are they/them, and I've been doing consulting on decentralized tech for a few years via my company Mauve Sofrware Inc.

You can find me on Twitter, my website, or in the Agregore Discord.

## P2P Fundamentals

Before we get to the web and local-first software, let's overview what peer to peer is and how it relates to the status quo of application architecture.

### Client-Server

Most applications people build these days rely on a client-server architecture

That is, you have a Server running somewhere (likely in the cloud) which is owned by somebody else and which you need to talk to if you want to exchange data.

For example, if I want to send a file to a friend, I must send it to the server, and the friend must then pull the file from the server.

This is handy because a server can stay online until your friend is ready to pull your file from it, and it can help prevent people that aren't your friend from downloading your file by restricting who can access it.


```
😎🖼️  => 🖥️  <= 😳

😎 => 🖥️ 🖼️  <= 😳

😎 => 🖥️  <= 😳🖼️
```

### Outages

However, this isn't so handy if the server becomes unavailable to one or more people in this transaction.

This can happen if the company hosting the server goes out of business, or if the datacenter hosting the data goes offline.

It can also happen if the business desides that they don't want you to be able to share data on their service, or are being censored by governments.

This for example is how LGBTQ+ folks and Sex Workers are frequently booted from platforms and lose their communities. Recall, not being able to say "Lesbian" on TikTok or YouTube, and OnlyFans kicking out any sexual content from their platform.

Finally, if one of these people isn't connected to the interent or unable to specifically connect to the server's network, whatever applicaton you're using becomes useless.

An example of this is how a lot of phones turn into fancy bricks if you go outside of regular cellphone range, or if your country's internet shuts down.

### Peer to Peer

So, lets look at how Peer To Peer applications are different.

Instead of going through a server to send data to somebody, you send it directly to them.

This works by taking two steps, announcing you have some data on the peer to peer network, finding peers that have data you want, and the protocol for securely exchanging data.

In this example, we have Person A that says they have an Image on the network, then their friend will search for the person's computer on the network, and load it directly.

We'll dig into what "The network" is in a moment, for now lets use this web emoji.

```
😎🖼️ => 🕸

😳? => 🕸

😎🖼  <= 😳

😎🖼  <= 😳🖼
```

### Propogation

What's interesting is now that the flushed emoji has a copy of the image, they can start re-sharing it to whoever else on the network needs it.

This means that when another person comes by, even if the first person is offline, the data can still be loaded.

And of course, once the second person has a copy, they can use it as long as they want offline since they don't need to ask a server for it.

```
😸? => 🕸

😳🖼  <= 😸🖼
```

## The Network

So now that we have the high level differences, let's look at what "the network" really is.

The core of most peer to peer protocols, is the "peer discovery" mechanism that they use.

This is what lets you advertise that people looking for a particular bit of data should connect to you, and how you can find peers that have the data you need.

### DHT

One of the most itegral mechanisms for this peer discovery mechanism is called a Distributed Hash Table.

This is comprised of a bunch of peers on a network acting as a bucket to store IP addresses of people advertising some data.

The algorithm usually used to coordinate these peers is called Kademlia.

Each person in the network gets an ID which is the same format as the IDs of data in the network.

An algorithm called "xor distance" is used to determine how "close" an ID is to another one.

Peers will memorize the IP addresses of others that are close to their ID, and a few that are further.

When you want to lookup or anounce some data, you find the peer that's closest to your ID, then ask them who they know that's closer.

Once you can't find a peer that's closer to the ID, you tell them to remember your IP address for the content, or you ask them what IP addresses they know for the content.

This means that there is no single source that controls what data is advertised and no single peer is able to see the entire state of the network.

As well, this enables you to set up DHTs on local networks without the internet if you need them.

```
- Distributed Hash Table
- Node ID === Content ID
- xor distance for "close"
- Remember close peers, some far peers
- Find closest peer for an ID
```

### Local Peer Discovery

Speaking of local networks and not using the internet, a lot of networks use protocols for finding peers on your local network.

This usually uses a feature of the internet protocol called UDP Multicast.

Basically, when you want to find a peer with some data, you send out a packet to everybody on your network saying "hey anybody got this"?

Anybody listening that has that data will then broadcast a packet back with their IP address so that a connection can be initialized.

This works great over wifi hotspots like your home network, and is also the technology that your operating system uses to discovery printers and chromecasts.

With this in place you can find peers even when you don't have an internet connection so long as you're connected to _some sort_ of network which supports multicast UDP.

```
- Multicast UDP
- Send to everyone on local network
- Peers respond with their IP address
- Works without internet (.e.g with just a Wifi hotspot)
```

## The Content

Now that we've gone over the network a bit, let's look at how data is actually exchanged.

### Trusting Content

An important distinction between peer to peer decentralized networks and client server centralized networks is the way trust works.

In a centralized scenario, you trust that the server you're talking to isn't lying to you, and encrypt connections to it to prevent further tampering.

In a fully decentralized system, you need to verify data that's being loaded, and the identifiers for the data should correlate to the verification so that you don't _need_ to trust that a peer isn't lying.

```
- Centralzed server holds your trust
- Decentralized IDs can verify content
```

### Content Addressability

One way to do that is by using content addressability.

This is a technique where you take a hash of your content, and use the resulting hash as the identity.

When you ask a peer for the data, you can hash it after downloading to verify that they sent you the correct data.

```JavaScript
hash("Hello World") == "abcd"

downloaded = getFromPeer("abcd")

hash(downloaded) == "abcd"?
```

### Merkle Trees

Merkle trees work by disassembling a large amount of data into smaller chunks  in a tree structure.

Each "node" in this tree is content addressible, and it enables you to download just a subset of the tree and verify data without needing to download the whole thing.

This is extremely important when you want to download just a subset of a large chunk of data like a movie or a database.

This is used by things like IPFS' chunking or with Hypercore Protocol's append only log structure.

```
- Split data into a tree
- Each "node" addressible
- Can load and verify a subset
```

### Cryptographic Verification

One of the challenges of using content addressible data is that if you change anything, you need a new address.

If you however want a consistant address, you might want to use public key cryptography where the data, or the hash of the data is getting signed by a public key

For example, you can sign some data with your private key, and use your public key as an identifier

A peer can then download the data and the signature of the data from a peer

They can then verify that the data is valid if the signature and data match up

```
signature = sign(data, privateKey)

{data, signature} = getFromPeer(publicKey)

isValid(data, signature, publicKey)
```

## Protocols

So now that we know how the fundamentals work, let's look at some peer to peer protocols and what their main strengths are when it comes to building applications.

### IPFS

- Content addressible (per file)
- Deduplicate content globally
- Encrypted and extendable network layer (libp2p)
- Several implementations
- Overlap with Blockchain communities
- Experimental "mutability" via IPNS (needs work)
- Resource intensive

### BitTorrent

- Content addressible (per torrent)
- Mature software, known by a lot of people
- Lots of clients and solved issues
- Lots of existing data on the network
- No mutability, weaker security guarantees

### Hypercore-Protocol (formerly Dat)

- Addressed by public keys (similar to IPNS)
- Fast updates of mutable content
- More "private" by default
- Sparse loading of large datasets (e.g. wikipedia)
- Only one implementation in Node.js

### Which one?

Now, remember that even though all of these can do a lot of the same things as the others, the tradeoffs can make a difference depending on what you're trying to do.

However, if you're unsure, I suggest going with whatever is easiest for your team to work with since getting _something_ out will help you experiment and iterate.

## Local-First Software

These tools can all be used to compose what's called "local-first software".

This is software that works locally to your machine, and can upgrade with the network as it gets connected to other machines.

This means that software written in this style works offline by default, and can work on local networks if they're available, finally upgrading to the internet to interact with people globally.

Peer to Peer protocols make it easier to create local-first apps since they to work offline-first and let developers focus on the data rather than on how to agregate large amounts of it in the data center.

## The Web

So, finally after looking at all these protocols, lets look at how they relate to the Decentralized Web.

### HTTP

So, we talked about servers ealier, what does it actually look like to talk to a server?

With web servers, you need to have a protocol to use (either HTTPS or HTTP if you're unsecure).

Then you need the hostname which lets you find where on the internet the server is.

You also need to specify the path to the data you wish to interact with.

From there you can make a request with a given method. GET to load data, PUT or POST to upload data, and DELETE to remove it.

The server will then do whatever magic it's doing, and respond with a status code and some data.

```
GET https://example.com/example.txt => 200 "Hello World"

PUT https://example.com/example.txt "Hello World?" => 200

DELETE https://example.com/example.txt => 200
```

### P2P URLs

Let's explore what that could look with with peer to peer networks.

In the same way that we can interact with HTTP servers, we can interact with peer to peer protocols, by uploading and downloading data from them and automatically exchanging it with peers.

Using these familiar interfaces, we can take the same skills (and a lot of the same frameworks) that developers use for client-server apps, and instead make it work as local-first software.

```
GET ipfs://bafybeic7n7s52drjp67yjklbiyxyzh3ddw35qr4wcuxkra6qmu37czxrmi/example.txt => 200 'Hello World'

POST hyper://example/example.txt 'Hello World' => 200
```

### Agregore

This is currently possible to use in some experimental web browsers. For IPFS, there's Brave browser, and soon some others, but if you're interested to do some fancy stuff, I suggest using my Agregore web browser.

This browser supports, IPFS, Hyper, BitTorrent, and Gemini as first-class citizens of the web.

Anywhere where you have an image or a video or a script that's loadable from HTTP, you can instead load from a peer to peer network

### Benefits

Aside from making it easier for developers to interact with protocols using a standard interface like URLs, the web is a great application distribution mechanism.

Paired with peer to peer protocols, not only can you exchange data over local networks, but you can exchange entire apps and updates to those apps just as easily.

Right now, getting an app to work across platforms and to install it without an internet connection or an app store is very hard.

With the decentralized web, if a person is able to network with another's device, they can send a link over and have their devices exchange the data for the site right there on the spot.

This second person can go on and re-share the data to another.

This is an example of the virality of data and how it can flow when we embrace social connections.

## Where to use this tech

So, where should we use this tech? How do we know if it's something we'd like to persue.

- Open Data by default
- Low-internet environments
- Reslience against censorship
- Local consensus
