There are a lot of guides and introductions to Dat that focus on using dat to transfer files, the replication protocol, and how the data is transferred between peers. However, that's just half of the story. A lot of the magic from the dat ecosystem comes from [discovery-swarm](https://github.com/mafintosh/discovery-swarm), the module that's responsible for finding peers to replicate with in the dat network.

## Super High Level

discovery-swarm provides an API to **join** networks using a **discovery key**, and then invokes a callback when it finds a peer to connect to.

```javascript
// Taken from the discovery-swarm example
var swarm = require('discovery-swarm')

var sw = swarm()

sw.listen(666)
sw.join('cool stuff') // can be any id/name/hash

sw.on('connection', function (connection) {
  console.log('found + connected to peer')
})
```

This seems easy enough, but it feels a little magical. Under the hood, it combines several high level modules to get the job done.

## Peer discovery

While dat-swarm provides a way to join multiple networks and automatically connect to peers, [discovery-channel](https://github.com/maxogden/discovery-channel) is the module responsible for actually finding peers for a given key. It's what advertises the local ip/port to the network and searchs for peer identifiers.

## Decentralized peer lookup - The DHT

Dat isn't the only p2p protocol that relies on peer discovery. Back when applications like BitTorrent and eMule were being developed, they relied a lot on "tracker" servers for announcing peers and searching for them. This resulted in a form of centralization which meant that if a tracker server got taken down or otherwise compromised, the p2p network couldn't function.

The solution for this problem was to get rid of centralized trackers and replace them with a protocol that would split the discovery information amongst all the peers participating in the network. The particular approach is called a Distributed Hash Table. It's a key-value store that automatically stores keys on nodes in the network. The most popular algorythm for determening which peers should store which data is called [Kademlia](https://en.wikipedia.org/wiki/Kademlia). I'm not going to go too far into it, but the idea is that each discovery key is sent to nodes whose id is _"close"_ to the key, and peers maintain connections to others that are varying levels of _"closeness"_ to themselves which makes it fast to find the nodes storing keys that you want.

This functionality is implemented in the [bittorrent-dht](https://github.com/webtorrent/bittorrent-dht) module which was originally made for the popular [webtorrent](https://webtorrent.io/) project.

discovery-channel uses this module by publishing it's IP/Port combination to the discovery key onto the DHT. Since there is no central authority or single point of failure, publishing on the DHT is resistant to censorship and can survive sketchy networks.

One of the problems with the DHT, is that items in the DHT don't expire right away, and searching for peers can yield a lot of false-positives. Also, maintining the connection information necessary for staying in the DHT takes up more computational resources. As well, the DHT requires a set of _"bootstrap nodes"_ which are used to find more nodes to start building up your network. These bootstrap nodes are a potential source of failure and DHT clients should attempt to save any nodes they find for later use in order to have a way to bootstrap should the bootstrap nodes go down.

## Faster than the DHT - DNS! (and MDNS)

The next module, is a two-parter. As I mentioned before, the DHT can yield false positives and requires participating in a network. To make peer lookup faster, discovery-channel makes use of [dns-discovery](https://github.com/mafintosh/dns-discovery) to talk to a list of centralized DNS servers to find peers.

DNS is the technology used to resolve website hostnames like `www.example.com` to IP addresses. It works by having a network of DNS "servers" that talk to each other about which domains map to which IP addresses. Clients wanting to connect to a website will then issue DNS queries to the server by sending UDP packets asking for a _"query"_, and getting a result back over the same UDP socket. The query contains a _"type"_ of record, and the _"name"_ to search for.

discovery-swarm makes use of the [txt](https://github.com/mafintosh/dns-discovery/blob/master/index.js#L392) _"type"_ , and generates a fake name by using the discovery key as a subdomain on a configurable domain. `txt` records are used for encoding freeform data that applications can make use of. For example, you could tell dns-discovery to use the `example.local` domain, and when searching for the `foobar` discovery key, it will make DNS queries for `foobar.example.local`. It tells the DNS server to track it's own IP/Port by adding the [additionals](https://github.com/mafintosh/dns-discovery/blob/master/index.js#L396) attribute to it's query with some custom data specifing whether it's announcing itself, looking up a peer, or un-announcing itself. The logic for how it encodes this information is [here](https://github.com/mafintosh/dns-discovery/blob/master/index.js#L719).

Using DNS is great for when you want speedy responses and to have a way to invalidate stored data (when you're leaving a network, for example). However, this introduces a point of centralization, and if the DNS servers get taken out, it prevents peers from being able to discover each other.

## Working without internet!

The internet is great for P2P applications, but sometimes you don't have the luxery of connecting to any computer in the world, or sometimes the computers you want to connect to are sitting right beside you and don't need any fancy distributed discovery. dns-discovery supports this scenario by making use of something called [Multicast DNS](https://en.wikipedia.org/wiki/Multicast_DNS) to find peers on the local network. It works by sending _"multicast UDP packets"_ to the local network containing what's essentially a DNS request, which might be picked up by any computers that are listening for it. The computers that are listening on the _"name"_ in the DNS query will then broadcast a DNS response with their local IP/Port which can be used to connect to them. This functionality is implemented in the [multicast-dns](https://github.com/mafintosh/multicast-dns) module. dns-discovery starts listening on MDNS requests, and has logic for responding to them [here](https://github.com/mafintosh/dns-discovery/blob/master/index.js#L149).

## How does discovery-swarm put this together?

When you initiate a discovery-swarm instance, you can specify the TCP port you want to listen to, the UDP port for DNS/MDNS queries, the DHT bootstrap nodes to use, the DNS server list, and the fake domain to use for DNS/MDNS discovery. Specifying or not specifying or not specifying these arguments enables and disables parts of the discovery features. Therese some other little knobs to toggle, but that's the main stuff that matters.

After specifying the discovery options, you need to start joining networks. The `discovery key` is modified by being optionall [hashed](https://github.com/maxogden/discovery-channel/blob/master/index.js#L104), and truncated to be only [20 hex characters](https://github.com/maxogden/discovery-channel/blob/master/index.js#L105). The 20 character limit is there to make it fit the Kademlia discovery key limitations.

It announces itself wherever needed, and starts periodically querying for peer information. Once it finds a peer, it will attempt to establish a connection to it. Peers will likewise attempt to establish connections to it once they discover it.

At this point, discovery-swarm has a duplex node stream between the two peers. Here is where two things can happen. By default, discovery-swarm will attempt to do a "handshake" between the two peers by exchanging their "ids" that they generated upon initialization. This lets the peers know who they're connected to and prevents them from opening more than one connection to each other. This can be overrided by providing a custom `stream` handler in the initialization options which returns an `EventEmitter` that will emit a `handshake` event with the peer ID itself.

From here it will happily run and establish new connections once existing ones close and optionally prevent new ones once it reaches a limit.

The discovery-swarm instance can be used to join multiple networks, and is able to handle incoming connections from multiple peers.

## How does Dat make use of it?

discovery-swarm has a lot of options, and if they're not compatible, peers can't find each other. Luckily the dat project provides a module, [dat-swarm-defaults](https://github.com/datproject/dat-swarm-defaults), which allows different projects in the Dat ecosystem to easily configure discovery so that they can all connect to each other.

Here's what it looks like

```javascript
var DAT_DOMAIN = 'dat.local'
var DEFAULT_DISCOVERY = [
  'discovery1.datprotocol.com',
  'discovery2.datprotocol.com'
]
var DEFAULT_BOOTSTRAP = [
  'bootstrap1.datprotocol.com:6881',
  'bootstrap2.datprotocol.com:6881',
  'bootstrap3.datprotocol.com:6881',
  'bootstrap4.datprotocol.com:6881'
]

var DEFAULT_OPTS = {
  dns: {server: DEFAULT_DISCOVERY, domain: DAT_DOMAIN},
  dht: {bootstrap: DEFAULT_BOOTSTRAP}
}
```

Beaker takes these defaults, and ads some more [options](https://github.com/beakerbrowser/beaker-core/blob/master/dat/library.js#L111)

```javascript
discoverySwarm(swarmDefaults({
    id: networkId,
    hash: false,
    utp: true,
    tcp: true,
    dht: false,
    stream: createReplicationStream
  }))
```

As you can see from the code snippit, beaker is disabling the hashing and the DHT! This means that when you're advertising discovery keys, you can just take the first 20 hex characters, and not worry about any of the rest of the processing. This also means that the DHT isn't being used for peer discovery, so the only source of peers is DNS and MDNS, which in most cases will mean only DNS is used to find peers over the internet.

The `createReplicationStream` argument is creating a replication stream for [hyperdrive](https://github.com/mafintosh/hyperdrive) instances, which is the module used to replicate dat archives. The dat replication protocol contains a handshake, so the discovery swarm handshake isn't being used.

## Steps for a MVP discovery swarm

Hopefully, this article has shown you the main pieces of discovery-swarm and can help you create your own implementation in other environments.

The minimal amount needed is to use the DNS discovery, and pipe connections into the hypercore protocol to replicate hyperdrives.

I've started work on [a module](https://github.com/RangerMauve/discovery-swarm-stream) that will allow browsers to make use of a discovery-swarm proxy over a websocket. This will allow applications to find peers and connect to them (almost) directly and allow people to experiment with p2p features outside of beaker, and experiment with cutting edge stuff like hyperdb even within beaker.


Hopefully this has been informative, feel free to hit me up [on fritter](dat://fritter.hashbase.io/user/dat://3df8868d5c3420d7acdf72d17129e4569cf83723092314ea6b260d112797d8c8), or [twitter](https://mobile.twitter.com/RangerMauve) if you have any questions or want to brainstorm more about bringing discovery to other platforms.

- RangerMauve