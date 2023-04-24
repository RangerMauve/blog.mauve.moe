# BitTorrent Web - Sketchup

After working on mixing peer to peer content on the web with Agregore and JavaScript based apps, I've come to realize that there could be a way more minimal approach that could use fewer resources and still be powerful for local-first networks of content.

## The Idea

BitTorrent + Markdown + Native UI + Content Authoring = Local-First Web

Instead of having a fully fledged web browser that supports multiple new p2p protocols like [Agregore](https://agregore.mauve.moe/), I think it'd be interesting to scale back and see what existing tools could be combined to make something that's smaller and uses fewer resources / doesnt require as much invention.

## Benefits

- BitTorrent has many mature implementations
- Markdown is simple, but rich and can embed other content
- Native UIs can reduce overall memory usage and fit better with your OS
- Authoring markdown with WYSIWYG editors can be easy to grasp
- Local-first means you don't need hosting providers to share stuff

## BitTorrent

After working with different peer to peer protocols, I've come to see a lot of similar things playing out.

A lot of new and shiny protocols and up running into the same problems:

- Backwards compatibility (lots of breaking changes, data can''t be loaded)
- NAT Traversal (How can we connect behind home and university networks?)
- Few implementations (How do we use this protocol from other programming languages or environments?)
- Performance (CPU/Memory/Network usage, speed to load a bit of data)

After looking more into BitTorrent, it seems a lot of these issues have already been addressed for a while thanks to different groups working to improve the protocol.

There's a lot of backwards compatibility in modern torrent clients and when publishing a torrent, you have a very good chance that it'll still be loadable in different clients a few years from now.
This is thanks to the fact that BitTorrent has been around for a while and the protocol has stabilized, along with the extension-based approach of adding new features where clients can coordinate additional functionality while falling back to default functions when something is missing.

NAT Traversal has been something that BitTorrent has had more time to address as well.
BitTorrent clients have been using fancy tricks to connect people together like [UPnP and NAT-PNP](https://www.bittorrent.com/blog/2015/02/12/%CE%BCtorrent-pro-tips-understanding-firewalls-upnp-and-nat-pmp/), but has also had a way to [hole punch via other peers](http://bittorrent.org/beps/bep_0055.html) which is something that new networks like LibP2P and Hyperswarm have just been getting around to this year.

BitTorrent being around for a while has also given it the benefit of there already being a bunch of client implementations.
In addition to implementations in different "native" programming languages like [libtorrent in C++](https://www.libtorrent.org/), we even have [WebTorrent](https://webtorrent.io/desktop/) which enables JavaScript based environemtns like [PeerTube](https://joinpeertube.org/) load content right on the web without needing additional clients.
This is something that other protocols either can't manage, or are still working on getting to.
If you want to ask "How can I get BitTorrent on an Android phone", it's a lot easier to answer than IPFS or Hypercore-protocol.

Regarding performance, BitTorrent isn't the most amazing at downloading loads of data quickly, but it's definitely "good enough" if you actually have some seeders for a piece of data.
In a lot of cases people would be downloading large files like videos or ISO images which can increase the time to load it fully (though you can load stuff on-demand too!), but when using mostly textual content like Markdown, you can likely download an entire page with a just a few round trips with a peer.
Outside of the speed, BitTorrent clients tend to use very little extra memory and CPU when compared to something like IPFS or Hypercore.
This means you could run it on weaker devices and you could potentially load more data without bogging down other applications.

### Gotchas: Mutability

Sadly, BitTorrent has one area in which there's a lot of improvements that can be made: updating data over time.

Since torrent are "content addressible" this means that the URL for a torrent depends on what it's content is.
So if you want to change some of the content in a torrent, you'll need to generate a new URL.

Thankfully there's a path forward to address this via [BEP46 - updating torrents via DHT mutable items](http://bittorrent.org/beps/bep_0046.html) which enables you to reference a torrent by a public key in the URL rather than the infohash.
Whenever you wish to update the torrent, you can generate the new infohash, then publish a new "record" to the DHT which signs the infohash and an incrementing sequence number.
When a person wants to load your data, they will query the DHT to get the latest infohash, and then use the usual methods to get that data out.

This is the approach that Agregore uses, but there's some room for more improvements.
At the moment, I don't think there are any clients that actually support BEP46 other than Agregore, but there was some buzz to do pretty much the same thing [Back in 2017](https://medium.com/@lmatteis/torrentnet-bd4f6dab15e4).
This means that we will need to work with more clients in order to make data interoperable rather than siloed in the few places that support BEP46 right now.

Secondly, since mutable torrents rely on the DHT, we'll need to find some way to give WebTorrent clients that use WebRTC and trackers access to DHT records.
This might mean adding a new spec for trackers that enables them to act as proxies to the DHT to publish and load records.

Finally, propogating updates is super slow because it relies on peers periodically polling the DHT for updates to an entry.
This doesn't scale well and can be very frustrating UX-wise.
This is somewhere where the IPFS ecosystem has felt similar pain points and has been improving.
IPNS used to have the same issues of needing to poll for updates, but they've started shipping a new feature that uses libp2p pubsub in order to broadcast new IPNS records to peers that are interested in a particular public key.
We could take a similar approach for mutable torrents. Instead of relying on the DHT, you could start swarming around the hash of the public key and use extension messages to ask for the latest version or gossip it out to other peers.
This approach would work with both web peers and native peers at the expense of needing to swarm around more data.
Another reason we'd want this is to support mutable torrents over local networks that cannot access a DHT like wifi routers in the middle of the woods.

## Markdown

So, we've already got a local-first web using BitTorrent via projects like Agregore or [Federalist](https://github.com/publiusfederalist/federalist), but they require entire web browsers in order to function.
This has a few issues, one being that web browsers tend to use a lot of system resources, and another is that there are very few "browser engines", and Google is currently building up a monopoly on what can and can't exist on the web.

However, there's other ways to distribute content than HTML+CSS+JavaScript, a format that I really like is [Markdown](https://www.markdownguide.org/) which kinda looks like ASCII art for formatting a plain-text document.
In fact, this blog post was written using markdown!

Instead of having cumbersome HTML syntax with a lot of weird formatting and gotchas, we can use the more simplified Markdown syntax.

For example, an HTML document might look like this:

```html
<!DOCTYPE html>
<head>
  <title>My Blog!</title>
  <meta whatever there's like 100 of these>
</head>
<body>
  <h1>My Blog!</h1>
  <p>
    Welcome to my blog!
  </p>
</body>
```

And if you miss a single `<>` your entire document can become unreadable.

Compared to that, the same-looking document in Markdown might look like this:

```markdown
# My Blog!

Welcome to my blog!
```

which is a lot less effort to compose and update.

An alternative that might be worth persuing is to use [semantic web data within an SQLite database], but that'll be left for a future blog post to discuss.

## Native UIs

One of the benefits we get from markdown for content is that it reduces the scope of the UI elements we'd need to support.
Browsers engines are really big in part because they need to support really complex user layouts with CSS and HTML.
Rather than reusing os-native APIs for elements, they need to invent the concept of user interfaces from scratch and to have millions of lines of code to support that concept.

With Markdown, we can focus on just the essentials: Headings, Text, Images/Videos, Code Blocks, Hyperlinks, and Lists.

These elements generally have support accross all major platforms and can be abstracted via cross-platform libraries like [wxwidgets](https://docs.wxwidgets.org/trunk/page_class_cat.html).

This way we can save on the overall size of the applications, be cross platform, and reduce the amount of memory used to keep the UI visible.

The memory usage is particularly noticible when you compare to Electron based apps (e.g. Discord, Agregore, Slack) which take up huge amounts of space and resources.

Native UIs are particularly importent when you're on more constrained devices like older computers or mobile phones. Each bit of memory or CPU usage counts!

## Authoring

One concern I've had around p2p is that there's a lot of focus on viewing data, but not as much on the actual authoring.
I would imagine folks posting content as much as consuming it which is something that social media has made a lot easier.
Unlike social media, it'd be nice if users owned their data and didn't rely on a third party to propogate it.

With that in mind, this new browser should focus authoring content as much as it does viewing it.
It should be easy to click a button and start authoring your thoughts.

Markdown authoring has been around for a while and there are loads of editors out there such as [HackMD](https://hackmd.io] or [StackEdit](https://stackedit.io/).
Generally the structure consists of a What You See Is What You Get (WYSIWYG) editor where you can get buttons to help you format text, and a `Preview` that can show you what your final markdown content will look like.

## Local-First

A very important feature is to work offline and to work over ad-hoc networks, and finally to scale up to the internet.
BitTorrent supports [Local Service Discovery](http://bittorrent.org/beps/bep_0014.html) which can use `Multicast UDP` to find peers on the local network without needing to know their IP address ahead of time.
This means that if you're connected to the same wifi router, or have an ad-hoc connection that supports UDP, your devices can automatically find each other and start peering.
With [local-first software](https://www.inkandswitch.com/local-first/) your data can be more resilient to network or infrastructure outages, and be in the conrol of users that actually use it.

## TODOs

How could we have dynamic applications (like the stuff possible with JS), but without the bloat of the entire browser runtime. (WASM?)

Can we make use of sqlite databases for serving this content? What would URL structures look like? What would authoring look like?

How do we ensure data is available when your personal device is offline? How can it be easy to set up backup services for your data either on your own, or hosted by a service provider.

How can you update your torrent from multiple devices without messing it up when two devices publish at the same time or get out of sync for a while?

## Conclusion

I'd like to see more of these ideas played out and to start experimenting within Agregore with the goal of ditching the Electron portion eventually.

If you'd be interested in working on this together, hit me up in the [Agregore Matrix Chat](https://matrix.to/#/#agregore:mauve.moe).

---

Last updated Feb 21 2022
