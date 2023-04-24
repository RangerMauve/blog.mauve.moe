# Local First Cyberspace Components

Last year I was talking about building a [Local-First Cyberspace](https://github.com/RangerMauve/local-first-cyberspace).

This year we're a lot closer to having something like this exist.

I'm going to go over some of the pieces we could put together to build and load virtual worlds from a p2p network of devices.

## P2P

This hasn't changed much since I last talked about it.
I'm still very much into peer to peer protocols for loading and sharing data.

Having everyone's data on a single monolitic service has been the standard for tech lately, and people are so used to it I think we forget that it's not the only way to use data.

Although there's some upsides with convenience, I think there's a lot of downsides with privacy and resiliancy.
It feels like wherever you look, there's another company doing something sketchy with the data they collected from people.
I hear a lot of folks say that this is the cost of getting all of these services for free, but you don't actually need to have any sort of services for sending data anymore.

With peer to peer protocols, we can have our data stored on our own device, and if we want somebody else to load it, they can download it directly from us without needing to do anything more than send them a hyperlink.
You can do backups more easily, too, run a computer anywhere and send it the links to the data you want backed up and it'll keep it all together.
If you want a different computer or service to back up your data, you can just send the links to them instead.

Similarly, when everything relies on a central service, there's more catastrophic failures when the service is down.
For developers, think of what happens when Github is down for a few hours during busy work days.
Why should we rely on whether a server is online when everyone that needs to use the data is online at the same time?

When you build on top of p2p protocols, you no longer need to worry about a single service being down and can instead load data from any peers that are online, whether it's the actual devices that "own" the data, somebody's copy of the data on their device, a backup service, or the copy of the data you have stored locally.
More modes of loading data mean more resilience to different kinds of outages, and at the end of the day, if you own the data you want to work on, then you don't need to be connected to anything at all to get your work done.

Lastly, for cases where the service provider isn't making money off of your data, there's either a cost to do the hosting, or a cost in technical know-how to set something up.
When your building block is some files in a folder that exist locally, you don't need much technical skill and you don't need to pay anyone anything.

I'm still really into [Hypercore-Protocol](https://hypercore-protocol.org/) for p2p since it does mutability well, but I'm also excited about experimenting more with [IPFS](https://ipfs.io/) and [EarthStar](https://github.com/earthstar-project/earthstar).

## The Web

One thing that I strongly believe in is the use of the web to load applications across different platforms.

The web not only gives us a runtime that's somewhat standard across all devices that people own, it also gives us a standard way of loading content across all these devices.

When people develop an application on the web, they don't need to worry about packaging and distributing it for every single device they want to target.

This lowers the barrier to entry for who can create an application and it sidesteps the issues of walled gardens on each platform tryint go limit what you can create and to take a cut of any profits you want to make.

If someone wants to make an application, they can glue together some HTML/CSS/JavaScript, put it in a website, and send somebody the link to their website.

Setting up a website usually means going with some sort of service provider to host your content, which can be easy but can cost money or require technical skill / vendor lock-in.
The p2p aspect helps here in that a website is just some files in a folder on your device that you can shae a hyperlink to.

This makes application distribution even easier in that you can make a website or have a website generate one on your device, and share a link without needing to go with any third party tools.

With this in mind, thre's two web browsers that I'm excited about which make p2p web stuff easy to use.

[Gateway](https://twitter.com/GatewayBrowser/status/1256344174921646080) is a mobile web browser that works on Android and iOS. 
I'm super excited by this since it's a functional p2p web browser that has all the usability features you'd want form it.
With gateway you can load websites from the Hypercore-Protocol directly from other people's devices over the peer to peer network.
We're also talking about eventually integrating a Bluetooth based mesh network so that people can load data from each other's phones without needing to be connected to the internet or a wifi hotspot.

[Agregore](https://github.com/RangerMauve/agregore-browser/) is another browser that I'm very excited about since I'm currently working on it. 😁
It's similar to [Beaker](https://beakerbrowser.com/) in that it's an Electron-based web browser that supports Hypercore-Protocol, but it's more minimal and isn't only focusing on Hypercore-Protocol.
Agregore's main schtick is using `fetch()` for interfacing with P2P protocols. Existing browsers have already gotten basic `fetch()` integration working by implementing `GET` requests for `hyper://` URLs.
Agregore, extends this by giving developers a `PUT` and `DELETE` HTTP method which lets you add files to a folder or delete files from a folder.
Development of this `fetch()` interface is happening in [Dat-Fetch](https://github.com/RangerMauve/dat-fetch/) and I'm hoping to get the same interfaces integrated into Gateway in the near future to have feature parity.

This fetch interface is interesting because it can scale out to other protocols.
For example, with IPFS, you can do the same `GET` interface to `ipfs://` URLs for loading data.
I think there's room to imagine a `PUT` interface for `ipns://somename/path/to/file.txt` which would take the body of your request, turn it into an info hash, and then upload it to an existing IPNS directory structure.

I'm hoping that having similar webby interfaces for different protocols will again lower the bar for what people need to learn to start building local-first applications with the web.

## Decentralized Spatial Indexing

One thing that's important for cyberspace is the organizing of data in space.

For example, in virtual worlds, something has to keep track of who and what is where and people need some way of loading stuff that's nearby them or near the place they're looking at.

Ordering stuff by it's location in space is called [Spatial Indexing](https://en.wikipedia.org/wiki/Spatial_database#Spatial_index). A Spatial Index makes it more efficient to find data within a given spatial bound.

Some databases like MongoDB have spatial indexes built into them which make it easy to save and query against spatial data. In videogames, there's data structures that can be used for finding data "near" a given area.

In p2p protocols, this seems to be a novel concept and there's likely many fancy ways of approaching it.

I propose an approach based on [Quadtrees](https://en.wikipedia.org/wiki/Quadtree).

Essentially you divide your 2D space into 4 equal boxes. Then you place all the objejs into the boxes that they fully fit into.
On top of this you have a maximum number of items per box. If a box has too many items, it should be divided into 4 smaller boxes and then have items placed within them.

Items would be JSON values which would be encoded as items in the hypertrie that look like `x-y-width-height-name.json`

The data for these indexes would be stored in P2P archives so that peers could download just the parts of the archive metadata that are related to the spatial query they want to test against.

One thing that might be important to play around with is what happens when the bounding box for an object is too large to fit inside the quadtree box when it's being divided up.

An alternative to quadtrees for the layout might be to use [Bounding Volume Heigharchies](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy).
This is similar to quadtrees, but instead of paritioning into 4 eaqual squares, stuff is partitioned into axis aligned bounding boxes.

Ideally you'd have an interface that looks something like this:

```js
const index = new SpatialIndex([url1, ur2, url3])

for await (let {x,y,width,height,value} of index.get({x, y, width, height}) {
  console.log(x,y,width,height, value)
}

await index.put({x,y,width,height, name}, {some: 'data'})
```

On top of this spatial index you could start storing different kinds of data.
For example your JSON could contain some sort of messages that you want to leave for folks, and an application can render them in VR or AR, or even a hyperlink to some p2p content.

I think that it'd be cool if we could link our spatial maps together in communities and build up virtual worlds.

Spatial indexing could be used to map virtual objects on top of GPS coordinates in reality, or could be used with arbitrary coordinates in shared virtual spaces.

Although this gives us a way to represent data, we should still think about how stuff is actually rendered in cyberspace.

## WebXR

So, one thing that I imagine from cyberspace is an integration with virtual reality and augmented reality headsets.

Ideally, we'd be able to load content off of the p2p web, and render it in VR.

Loading regular web pages seems pretty straighforward if we put them on 2D planes, but 3D content requires some special APIs for the spatialization.

For that we can use the [WebXR API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) which provides web pages access to all the sensor data from VR and AR headsets.

With this web pages can render their scenes based on whatever method they want.
They could be unity apps, besoke WebGL code, or declarative libraries like [Aframe](https://aframe.io/) or [JanusXR](https://janusxr.org/).

People can glue some code together and make a 3D scene and share it with someone over the p2p web.

One cool thing that could be used is [Webaverse's XRPK API](https://docs.webaverse.com/docs/index.html) which lets you load multiple WebXR scenes in tandem.
An app could load packages from a P2P network, and display them all at once with XRPK's APIs.

Tools could be created that give you a graphical way to generate 3D scenes and save them for later or remix them with others.

## Putting It Together.

I propose something like the following:

- Get writable APIs from Dat-fetch into Agregore and Gateway
- Make sure WebXR is working in those browsers with P2P websites
- Get P2P message passing into dat-fetch (for multiplayer)
- Create a spatial indexing library over dat-fetch
- Use XRPK to load WebXR scenes from the index
- Get it all running in Gateway and Agregore
- Test it out with an AR headset
- Bam!
