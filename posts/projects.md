# Project Proposals

Hello,

I’m a Canadian techie working on decentralized software in the p2p web space. I’m currently working at the [Dat Foundation](https://dat.foundation/) but I’ve been wanting to branch out and do more anonymity / data resilience work outside of that.

Website: https://ranger.mauve.moe/
Blog: https://rangermauve.hashbase.io/
Twitter: https://twitter.com/RangerMauve
Github: https://github.com/RangerMauve/

My long term goal is to normalize [ad-hoc community driven mesh networks](https://tomesh.net/build-a-node/) and devices that run anonymized and [local-first](https://www.inkandswitch.com/local-first.html) software in order to give people more autonomy and to improve the resiliency / privacy of information technology.

I’m also focused on [progressing the state of augmented reality](https://github.com/RangerMauve/local-first-cyberspace) to be less dependant on corporations, to work using mesh networks rather than the internet, and to load virtual content from the decentralized web rather than large walled gardens on a corporation’s cloud.

My work at Dat and some contracts I’ve done on the side have helped me progress towards these goals. I’ve also been speaking at and attending conferences this year and slowly meeting people and spreading some of these ideas and I’m pretty confidant that these are all feasible with the tech that’s already out there.

Here’s the specific projects I had in mind:

## I2p integration into Dat

Dat is a peer to peer file transfer protocol with a focus on efficiently sharing large mutable datasets. It’s used for [syncing folders](https://docs.datproject.org/docs/cli-intro) over the p2p network, and for loading websites using the [Beaker](https://beakerbrowser.com/) and [Cliqz](https://cliqz.com/en/latest) web browsers.

A nice feature of Dat is that unless you have the `dat://` URL for an archive, it’s impossible to see what data it has or snoop on traffic. Sadly, this isn’t enough since the traffic is still going over IP and ISPs/ Nations / Malicious Actors could track the IP addresses for archives and see where people are coming from.

[i2p](https://geti2p.net/) is a anonymizing network which is kind of like Tor, but isn’t funded by the US government. I recently spoke to idk from the i2p community and we spoke about getting it integrated into Dat to give people a higher level of privacy and to be more resistant to censorship. We talked about some of the details of how this could be done in a recent [forum thread](https://dat.discourse.group/t/feature-support-i2p/62/4).

Getting this together will help people build totally decentralized websites which don’t require servers to run and would be anonymously distributed over the peer to peer network. This could be handy for activists trying to dissipate data to people without having a central server that could be taken down to prevent propagation and without revealing the IP addresses of people loading the resources.

## Easy to use pirate mesh networks

I’m very concerned with how centralized the internet infrastructure is becoming and how much more dangerous cutting people off from the internet can be. This can be seen pretty much anywhere where there’s protests with people organizing over the internet. Having access to the internet can also be hard for people with little money or no access to credit cards, as well as people living in areas without internet service providers. 

I’d like to experiment with making it easier to deploy networks which don’t rely on internet service providers or central authorities. There’s been some precedent with [Freifunk](https://freifunk.net/) in Germany for having free internet, as well as projects like [LibreRouter](https://librerouter.org/) for setting up community mesh networks. There’s also [Althea](https://althea.net/), but they’re focused more on profit-driven networks rather than free ones. There’s also been some buzz around the [Bridgefy](https://www.bridgefy.me/) app used in [Hong Kong](https://www.forbes.com/sites/johnkoetsier/2019/09/02/hong-kong-protestors-using-mesh-messaging-app-china-cant-block-usage-up-3685/amp/?__twitter_impression=true) however this approach is closed source and harder to trust.

I’d like to experiment with starting a pirate ad-hoc mesh network which isn’t governed by anybody and is auto-configures itself as people join. I’d like to use a combination of [Raspberry PI](https://github.com/tomeshnet/prototype-cjdns-pi/) nodes with WiFi antennas (cheap, easy to source  / configure), as well as [CJDNS](https://geti2p.net/en/), [Yddrasil](https://yggdrasil-network.github.io/), or [BATMAN/Babel](https://github.com/RishabhPandita/Mesh_Routing_Protocol_Batman-Babel-Hybrid) for routing traffic using IPv6. On top of that I’d like to make it super simple to configure a node as an internet proxy, and make it easy to auto-discover nearby proxies using a P2P discovery mechanism over the mesh network (using [MDNS](https://en.wikipedia.org/wiki/Multicast_DNS) for example). People could connect to the mesh like they would to WiFi or by turning their device into a mesh node. Deploying this mesh should be as easy as possible, and the network should aim to anonymize traffic when possible, though the ad-hoc nature of the network would already hinder people’s ability to monitor or censor it.

After the initial network code is working, I’d like to experiment with getting people’s phones to form or participate in these mesh networks. Android has [WifiDirect APIs](https://developer.android.com/training/connect-devices-wirelessly/wifi-direct) and BluetoothLE APIs which could be used to form ad-hoc networks and connect them to Raspberry PI based nodes. This could come in the form of an app that acts as a VPN provider and unlike Bridgefy is fully open source.

After Android is working, It’d be good to try to integrate iOS into the mesh outside of the WiFi connections. iOS is a bit harder since it has a proprietary API called [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity), though there is apparently work being done to create an open source implementation that could run on mesh nodes. iOS also has support for BluetoothLE which could be used as a bridge to Android devices or mesh nodes. This app should also come in the form of a VPN provider. iOS is a lot harder to deploy to and there has been precedent of Apple [blocking apps used by activists](https://www.theregister.co.uk/2019/10/02/apple_hong_kong/) so this is more of a nice to have.

In addition to the network, I’d like to put together some simple examples of how people could build local-first apps on top of it or partner with some sort of activist group to see what sort of applications could benefit them.

Having networks that are collectively owned by everybody using them without having any central authorities governing them will be a boon to taking power over information out of the hands of governments and corporations and into the hands of regular people on the streets. In addition, having local-first applications will make communities more resilient. People could go to a festival, or a commune in the middle of nowhere and everything would still work. You could have two people with zero connection to the rest of the network, and everything would still work between them and they would be able to share and author data without thinking about whether a cloud service provider will host their data or act as a middleman. Free access to networks and getting rid of the need for servers could also help local businesses. If people what to offer a service, they no longer need to be beholden to an ISP and can advertise themselves on the local network and transact with people using whatever cryptocurrency (or fiat) they have available.

## Local First Distributed Marketplace

There’s a lot of buzz for marketplaces in the crypto world, but they all end up having some sort of entity and some sort of servers controlling them. I propose creating a general purpose market which is fully decentralized and free to use based on distributed hash tables for resource discovery.

People looking to give something physical away or looking to provide a service will advertise on a P2P network (using [Distributed Hash Tables](https://en.wikipedia.org/wiki/Distributed_hash_table)) about their item (optionally paired to a given geolocation), and people looking for resources will search the P2P network and be able to message them directly from there.

The sole of the marketplace purpose is to introduce the two parties together and leave the coordination of payment up to them through direct encrypted messages over the p2p network. This gives more flexibility and prevents people from being locked in. Having an open and easy to implement standard will mean that there isn’t a central entity controlling the market and that anybody can build their own sub-markets on top of the software. The use of distributed hash tables and lack of predefined blockchains means that the market runs itself by having the users of it contribute small amounts of bandwidth and storage as they search or advertise on the market. Combining this with a mix network like i2p could add an additional layer of anonymity to prevent malicious actors from tracking buyers or sellers. I’ve written about some of the details of how to connect two peers together over the DHT in my [P2P Inboxes writeup](https://medium.com/@RangerMauve/p2p-inboxes-be0f02083223).

A small side-effect of the marketplace is that it could be used for anarchist organization where people connect to each other directly to coordinate things outside of buying/selling. For example, if somebody wants to do some sort of direct action they can advertise that they’re looking for people and connect to them without needing to go through a third party server.

## P2P Wiki

Wikis are important for sharing data with people, and projects like Wikipedia show that people working together in a distributed fashion can get a lot done. The only issue is that Wikipedia is still a single entity / a single service that could act in malicious ways, be blocked by governments, or simply be unavailable without an internet connection.

I propose putting together a basic foundation for wiki software that enables people to collaboratively edit documents, and revise each other’s changes all through a decentralized network. Instead of having wiki servers or even blockchains governing how data can be exchanged and built upon, people would instead use local-first connections and moderate based on their local conditions and decisions.

The implementation would use [append-only logs](https://en.wikipedia.org/wiki/Transaction_log) representing operations in [conflict free replicated data types](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) which would be replicated over p2p networks. The idea is that anybody could start a wiki or add an article to an existing wiki locally, and start replicating changes out to others as they connect to them.

This will enable authoring of content over mesh networks or even over the existing internet without needing any servers to coordinate connections. An example of an application that uses these principles is [Cabal](https://cabal.chat/) which is a fully decentralized and local-first chat app.

Combined with mix networks this is an ideal tool for activists and communities which wish to collaborate with each other without relying on easily censored or non-free services. The idea is to build out the lower level portions of the replication and moderation and make it easy for people to put together their on front-ends to the wiki according to what they need.

## Local First Cyberspace

I’ve been inspired by the books [Daemon by Daniel Suarez](https://www.goodreads.com/book/show/6665847-daemon) and [Snow Crash by Neal Stephenson](https://www.goodreads.com/book/show/40651883-snow-crash) to make the cyberpunk ideas of “cyberspace” real. I loved how those books depicted computing and augmented / virtual reality and I realized that I had the tech know-how to create it, but I wanted to do it in the open and to make it rather than having it be owned by a single corporation or government which is the direction this tech seems to be heading at the moment.

The idea is to glue together [WebXR](https://immersive-web.github.io/) with the distributed web and geolocation to create a cyberspace that works across any virtual headset, and works on any network without the need for cloud servers or corporations.

Essentially, to create a virtual space or object, you just need to put together a WebXR scene (either with JS or by exporting to WebXR from something like unity). Then, you just need to publish it in a P2P website (e.g. with Dat), and share the link with somebody. Your virtual “thing” exists on your headset and is controlled by you by way of you owning the private key for the archive. Others can load the contents from either you or from others that have loaded them in the past, making the virtual object propagatable through people like a meme. Practically this means that a person could walk up to somebody else, conjure a virtual datachip, and hand it to the person in front of them to give them a copy.

Connecting to other peers in cyberspace will be done over local networks and distributed hash tables. Essentially, the world will be split up into the GPS grid, and people / bots will advertise themselves in given areas and connect to each other to exchange positional information / other data. I started prototyping this a while ago for a conference [here](https://github.com/RangerMauve/aframe-dat-peers-networking). What’s interesting is that artificial intelligences or bots would interface with the virtual space in the same way that humans would: Via p2p networking and WebXR APIs. This blurs the line between the virtual and the physical further. Additionally, virtual spaces could be created using encrypted keys so that they could exist outside of any physical space and be private to those that have a copy of the key.

Virtual objects should be advertised on the distributed hash table as well. For example, somebody can put together some sort of virtual shop, and pin it’s archive URL to a physical location in a part. A person with a headset could walk by and auto-detect the shop as part of their DHT scanning and interact with it over the local network.

The spatial pinning / peer discovery would work by representing a [Octree](https://en.wikipedia.org/wiki/Octree) over the distributed hash table, and the rendering of objects would be done via the [Exokit Engine](https://github.com/exokitxr/exokit)’s [Reality Layers API](https://exokit.org/docs/engineapi/iframeAPI.html) for positioning WebXR scenes in space.

This is a sort of culmination of all the other tech where headsets would participate as mesh nodes and applications / businesses will run in the virtual layer of reality and be governed by the people deploying them, will be anonymous by default, and will be unstoppable by default.

The initial use case after putting together the headset would be to enable spawning unix terminals for productivity on the headset, and pinning 3D objects in space and leaving it up to developers / communities to figure out what they want from there.


It’s unlikely that you’d be interested in funding _all_ of this work, but support for any individual project would already have a large impact enabling people to have more privacy, for pushing technology forward, and for taking control over technology back into the hands of the people using it.

Kind Regards,

Mauve
