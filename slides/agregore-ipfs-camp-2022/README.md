# Agregore - IPFS in Web Protocol Handlers

???

Thanks for coming out! My name is Mauve, my pronouns are they/them, and today I'm going to be talking about how the Agregore browser deeply integrates IPFS via custom protocol handlers.

## HTTP Protocol

`METHOD` `scheme`://`origin`/`path`?`searchParams` `Headers{}` `Body`
`=>`
`Status` `Headers{}` `Body`

???

So, before we get into how Agregore integrates, IPFS, lets quickly review what HTTP protocol handers do in the browser.

Typically, you'll have a URL that consists of a scheme, either HTTP or HTTPS, an origin which is the domain and port you're loading stuff from, a path to some resource on that origin, and some optional query parameters.
You can also specify a METHOD like `GET` or `POST` along with some headers to specify what sort of content you have or what sort of content you want back.

The server will then return a status code telling you if your request was successful or not, some headers describing the contents of the response, and the response body.

Everywhere you see a URL or interact with a server, this is pretty much all the parameters involved.

## Resource Loading

- web pages (html, iframes)
- images
- audio
- video
- stylesheets
- scripts / workers
- `fetch()`
- `EventSource`

???

Specificlly, this dance is done with servers whenever you try to load web pages, images, media like audio and video, or website content like stylesheets and scripts.

The JavaScript in a browser can also programmatically trigger this dance by using URLs in the Fetch API, or listening to events via the EventSource API.

## P2P URLs

- `https://example.com/`
- `ipns://ipfs.io/media`
- `ipfs://bafybeibtqqzunuqb4dilnvrwz5kqrz7mkct3mkzbnlym35ptszkoncrtkq/`
- `bittorrent://0fcfd57f4fb16e403c90a3c4127872970374c3b5/`
- `hyper://843356e1611b76b6b90ecc7141e2d5b9e8859f8e8f8b3685333c279c3b46d1fc/`

???

So, what if we take what developers and browsers already know, and replace just the `schema` part of URLs with peer to peer protocols like IPFS.

This is my core premise for web integration.

The same way that I would be able to load an image from HTTP, I should also be able to load an image from IPFS or from Bittorrent.

Similarly, I should also be able to POST some form data with files to a peer to peer protocol in order to upload it to my local node and get back a URL to share with others.

## Agregore

![Agregore Browser Logo](./agregore-logo.svg)

???

So, this is what my web browser Agregore does.

### Agregore - Features

- Regular Web Browsing
- Mix P2P Protocols
- Minimal Features
- Web Extensions
- Mobile (Android)

???

At the core, it mixes a bunch of peer to peer protocols via protocol handlers, including support for HTTP and HTTPS to be able to act as a regular browser, but with extra p2p superpowers.

As well, I've focused on keeping Agregore's core as lean as possible in order to leave more customization to user land via it's built in support for Web Extensions.

Finally, I strongly believe that mobile devices are an important part of computing and have worked with folks on a Filecoin Devgrant to port some of Agregore's Desktop features to Android.

While Agregore mobile only supports IPFS at the moment and is also lacking stuff like devtools, I believe that in the next year or so we'll have a strong story for mobile authoring.

### Agregore - Protocols

- ipfs:// (ipns:// / pubsub:// / ipld://)
- hyper://
- bittorrent:// (magnet:)
- ssb://
- gemini://

???

On Agregore Desktop, we've got support for a few protocol handlers

IPFS and related schemes, hypercore protocol, bittorrent, secure scuttlebutt, and gemini which isn't even peer to peer but is rad as heck.

## IPFS Protocol Features

- Load IPFS/IPNS/IPLD
- Upload to IPFS
- Update IPNS sites
- IPNS Key management
- Libp2p `pubsub://`
- IPLD URLs

???

For IPFS handlers specifically, we're able to load data from IPFS, IPNS, or IPLD which is simular to what other browsers like Capyloon and Brave support.

However, one thing we've got that others don't yet is the ability to use protocol handlers to upload data to IPFS or to update IPNS sites.

As well, you can manage your IPNS key ring accross different domains.

Slightly more experimental is support for the LibP2P pubsub protocol which allows you to gossip data with users over the p2p network among a given topic.

Another experiment that I'm doing as part of my work on IPLD, is to spec out IPLD URLs and expose some of its functionality in a high level interface for projects that are looking to use structured content addressible data.

## Live Demo!

```JavaScript
response = await fetch('ipfs://bafyaabakaieac/index.html', {
	method: 'PUT',
	body: `
<!DOCTYPE html>
<title>Hello World!</title>
<marquee>
<h1>Hello World! 😎😎😎😎😎😎😎😎</h1>
</marquee>
`
})

response.headers.get('Location')
```

???

So! Now that we've got the preamble, lets do a live demo and see how it works. 😁

First, we're going to use the browser's fetch API, and we're going to say that we'll be talking to this special `bafyaabakaieac` URL which represents an empty folder.

Next, we'll be saying we want to interact with `index.html`, and say that the method we'd like to use is PUT.

This means that whatever we place in the body will be added at that location.

Next we'll add in some HTML for the body. Pay attention to the doctype and title elements here since that's important for your pages to render nicely and to be easy to search via your browser history.

So, once this request goes through, if it was successful, I'll be getting a `Location` header with the created resource URL which I can then open up or share around.

What's cool is I can take that URL and switch the scheme from IPFS to IPLD in order to be able to look through the raw data.

## Local-First Software

- Offline
- Local Networks
- Over the Internet
- Preserves User Agency
- Opposite of Cloud-First

???

So, what's the point of all this?

I've been thinking about this concept a lot called local-first software.

It's software which works when fully offline, which can also automatically operate over local networks like a wifi hotspot or a mesh, and which can also seamlessly scale to work over the internet.

It's sofrware that preserves user agency by keeping data control local to the users device and giving them an obvious route to migrating it between apps.

Basically, it's the opposite of what cloud-first apps do by default.

Basing the web on protocols like IPFS enables all of these features with very little extra effort.


## Simplify Web Development

- No Build Tools
- Pushish Apps like Data
- Edit Other Apps

???

My hope here is to simplify web development.

I'd love to see more folks building smaller scale apps which don't need megabytes of build tools and beefy developer machines.

I want to make it as easy to publish and distribute apps on these p2p protocols as it is to publish any other sort of data.

I also want to have a clear path to take existing software and to tweak it.

## Mesh Networks

- Reduce bandwidth costs
- Speed up using local traffic
- Resist Internet Outage
- Resist Blackouts/Brownouts

???

These approaches also work great with community run mesh networks such as those run by the groups in the Association for Progressive Communication.

It enables communities to reduce the overall amount of bandwidth that needs to go over the internet which can reduce costs for areas where internet could be expensive to run.

It also generally speeds up traffic by making use of local connections and caching.

Finally, local first web software enables communities to resist problems caused by internet outages or energy blackouts.

## Resilience

???

This reslience is important to look at now as global climate change and political turmoil starts destroying physical and digital infrastructure.

Part of my hope is that the learning we can get from smaller scale communities can be applied to larger scales around the world and to have resilience and community be the default rather than the effects of external forces.

## What's Next?

- Improving mobile
- More examples apps
- Other browsers (Capyloon, etc)
- Community Mesh Networks

???

As part of these goals, we're working with folks to improve support on mobile devices to enable more people to use p2p web as their daily driver.

We're also working on documentation and example apps along with tutorials on how to make them so that somebody new to the community can start making their own apps with copy pasting and editing of others' code.

We're also working on connecting with other browers experimenting with this tech like Capyloon with the goal of standardizing some of these protocol handler APIs to make web apps interoperable between the different environments.

Finally, we're aiming to get the baseline more solid so that we can make more serious deployments with community mesh networks and enable them to do things that were hard otherwise.

## 🙇 Join Us! 🙇

https://agregore.mauve.moe/

???

Thank you for coming out and listening to my talk.

If you're curious to learn more, come join us on Matrix or Discord and start making something for yourself and your community.
