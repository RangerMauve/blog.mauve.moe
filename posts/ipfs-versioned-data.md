# Versioned Data in IPFS: IPNS with history

IPNS is great, but it's not perfect yet.
Due to the way it uses the DHT, it's slow to update.
And because of the way the format works, there's no way to get a history for a given website.

IPRS is a potential alternative, but it's very complicated and is still a WIP.

After looking at the internals of the [Dat project](https://datproject.org/), I came up with the following changes that would give IPFS some of Dats advantages while using it's existing infrastructure and data models.

## Adding a link to the previous `version` (IPNS entry)

This would require the addition of an extra field, `previous`, in the [protobuf definition](https://github.com/ipfs/js-ipns/blob/master/src/pb/ipns.proto.js).
This field would contain the multihash of the previously published IPNS entry.
This new field wouldn't need to be part of the signature because the entry is signed by the same key, and will have `sequence - 1` as it's sequence if it is valid.

Since each IPNS entry is signed, and should have a decreasing sequence number over time, the only additional verification needed will be to check that the sequence number doesn't decrease by more than one.
Not having the field be part of the signature enables backwards-compatibility with older clients that don't know how to handle versions yet.

With this field in place, one can traverse the history by following the `previous` links.

## Syncing the version by connecting to peers instead of searching the DHT

Looking up values in the DHT has the benefit of not needing the publisher to be online all the time in order to enable peers to disover their data as it will persist on other nodes in the DHT.
This doesn't hold up for long outages of the publisher since nothing else in the network will be posting to the DHT if they go down.
This means that once a peer goes down, unless somebody has already resolved their latest IPNS entry and pinned it locally, they won't be able to find their data anymore.
Not being able to find data once the publisher goes down makes the p2p aspect less useful and should be addressed.

The Dat project approaches this differently in that peers will discover other peers on the DHT, and establish connections to replicate the version metadata and actual file contents.
IPFS can do something similar by using the DHT to find peers for the given IPNS key and using a simple protocol to sync them together.

Peers will propogate any new changes that they encouter to their peers which will quickly propogate updates throughout the network.

This doesn't necessarily need to replace the existing DHT functionality, and it would be feasible to have both methods at once, with the same data.

## Treat IPNS histories as "archives"

At the moment IPNS acts as a pointer to some sort of opaque resource, this is in contrast to Dat which uses a mutable filesystem as it's base API.
One of the benefits of treating IPNS URLs as archives over raw pointers is that there's now a clear way to monitor whether the user is actively engaging with the contents.

For example, in the [Beaker Browser](https://beakerbrowser.com/) this enables them to seed Dat archives while a user is actively engaging with a p2p website, and letting the browser know to stop seeding after they have left the page.
This provides a natural method of applications sharing the load for resources without having to explicitly code for it.

In addition to tracking the "active" state of an archive, it provides an easy way for authors to reason about updating it's contents.
One could envision using an API similar to [https://docs.ipfs.io/guides/concepts/mfs/] which is scoped to a specific IPNS URL.
Applications can use the same interfaces for reading and writing from published content and are able to pass references to these filesystems around.

The minimal approach that would help here is to add `ipfs.name.history(multihash)` to get the history and `ipfs.name.seed(multihash) / unseed(multihash)` to control when to share the history.

## Sync protocol description

Lookup:

- Client wants to look up the latest history for an IPNS key
- Client uses [contentRouting.findProviders](https://github.com/libp2p/js-libp2p#libp2pcontentroutingfindproviderskey-options-callback) for the IPNS key to find peers
- Client connects to a random subset of peers that it discovers using the `/ipns/2.0.0/${multihash}`
- There will be a listener per IPNS key in order to differentiate between the connections without having to add more to the protocol.
- If the client has loaded this key's history before, it will send over it's latest IPNS entry
- It will listen for incoming IPNS entries from the other side.
- Once it gets a record
  - It will check the validity of the signature
  - It will check if the sequence number is greater than what it has locally
  - If it isn't greater, it should be ignored
  - If it is greater, the client will traverse the history until it reaches it's latest sequence number
  - If the value in this chain isn't the same as what's stored locally, the connection will be closed and the block will be ignored
  - If it's the same, the latest version will be saved for reference
- The client will keep the connection open in order to push any updates it receives to all peers
- Something should hint to IPFS to attempt to load 

Seeding:

- IPFS should have some way of marking the IPNS resource as being "active" or not so that users loading a 
- They will start listening on `/ipns/2.0.0/${multihash}` and advertise themselves using [contentRouting.provideKey](https://github.com/libp2p/js-libp2p#libp2pcontentroutingprovidekey-callback)
- Once they get a connection, they will teat it the same way as an outgoing connection.


## Interesting properties / concerns

The replication protocol is super simple because most of the complicated work is done by the existing IPFS stack.
In most cases only a single message will be exchanged to see if they're up to date, and if they aren't the DAG traversal of the versions will automatically download those blocks locally.

All connections between peers are secured by the existing encryption protocols used by libp2p between connections.

IPNS is used to look up the version history. Checking out a specific version of the history is as simple as using the IPFS hash linked to at that version instead, same as the non-versioned IPNS.

It's possible to build libraries to diff between versions of the FS by running diffs on the merkle dags for the folders.

Unlike Dat, content is automatically deduplicated across versions and file names thanks to IPFS's existing file storage capabilities.

The privacy model isn't as robust as Dat since all the files you're downloading are being broadcast via content discovery.










