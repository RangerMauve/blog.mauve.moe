# Differences between p2p protocols

This is a verbatam conversion with @todrobbins on the #Dat IRC on freenode.

```
17:26 <todrobbins> where can a plebe like myself go to gain a better understanding of the differences between dat, ipfs, filecoin, what-have-you? like I don't understand what ipfs or filecoin are trying to accomplish compared to dat

17:27 <@rangermauve> RangerMauve todrobbins: Oh shoot, I keep meaning to write up an article about that. :P

17:27 <todrobbins> rangermauve: would love that
17:28 I'm trying to tease out the differences between blockchain and cryptographic hashes, like what's the superset here? how much of it surrounds branding and differing lexicons?

17:29 <@rangermauve> RangerMauve So, blockchain is global and mutable (slow / expensive, always has peers with the data), append-only logs in Dat are local and mutable (fast, need peers to load stuff), hashes are a mix of local and global (same hash per file, needs peers to load stuff)
17:29 Oh, but hashes are immutable
17:30 Filecoin is a cryptocurrency that's used to incentivize people to keep copies of hashed files online.
17:31 IPFS has global deduplicaition of data through hashes, but at the cost of needing to do more networking to find peers
17:31 Dat has immutability and can find peers for entire archives at a time, but at the cost of sparse data lookup requiring more connections to peers.

17:33 <todrobbins> so is blockchain a DHT? or something else?

17:33 <@rangermauve> RangerMauve No, blockchain is like one big append only log, and you need to boil the oceans by doing wasted computations before you can add new bits of data to it.
17:34 Since there's one log, you have a sort of global history so you can guarantee transactions happen in a certain order. But then you need "full nodes" to keep a copy of the entire log which can grow pretty big over time.
17:35 A DHT is like a key-value store that lets people advertise their IP address for a given "key" so that they can find peers interested in that particular key
17:35 In dat's case it's the discovery key of an archive, in IPFS' case it's the hash of a file/block/etc
17:36 So blockchain is used to store historical data, DHT is usually used to store small amounts of data used for peer discovery and stuff
```