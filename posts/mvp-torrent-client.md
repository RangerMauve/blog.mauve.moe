# MVP Torrent Client

## Features

- No Trackers, they're a point of centralization
- Use the mainline DHT for peer discovery
- Peer Exchange maybe?
- Don't use torrent files
- Load metadata from the DHT
- APIs for exploring filesystem
- APIs for downloading files
- Seed files as they're being downloaded
- Use [Local Service Discovery](http://bittorrent.org/beps/bep_0014.html) for finding peers on the local network

## API

```javascript
const Torrent = require("@rangermauve/torrent");
const ram = require("random-access-memory");

var options = {
  dht: [], // Bootstrap nodes
  dhtPort: 1234, // The port to use with the DHT
  torrentPort: 1234, // The port to use for the torrent protocol
  peerId: "something", // Peer ID for the DHT
  storage: ram, // A random-access-* instance
}

var client = new Torrent(options);

// Start participating in the DHT and listen on incoming connections
await client.start()

// If you want to stop all network activity
await client.stop()


// You can lookup an archive by a URL

// Options for doing lookups
const lookupOptions = {
  timeout: 4000, // How long to try searching for
  seed: true, // Whether you'd like to participate in seeding
}

// This will look up the torrent metadata
// Archive has the same APIs as node's `fs` APi, except with promises in addition to callbacks
// The URL could either be a magnet link with an infohash, or a bep 46 mutable item
const archive = await client.lookup(url, lookupOptions)

// Read some file out of the torrent
const content = archive.readFile("/index.html");

// Stop seeding the archive
const archive.close()

const archive = new Torrent.Archive()

await archive.writeFile("/index.html", "<h1>Hello World!</h1>")

// Get back a magnet URL for the torrent
const url = await client.seed(archive)

// Create a keypair you'll use for 
const {publicKey, privateKey} = await Torrent.createKeypair()

// Create a BEP 46 magnet link for a torrent, and start publishing it to the DHT
const muitableURL = await client.publish(url, publicKey, privateKey)

```



















