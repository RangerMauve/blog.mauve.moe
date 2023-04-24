# A _Killer App_ For P2P

P2P tech is great and I could see a lot of uses for it and a lot of opportunity for innovation.
But after talking to people about my passion for P2P tech, it was pointed out that I was looking for existing places to shove it into rather than solving an actual problem people are facing.
In order to convince people to adopt something, you need it to be 10 times better than what they have already.

With this in mind, I want to look at the biggest advantages that I think P2P tech brings to the web, why it's not enough, and some ideas about applications that could actually solve pain points.

## Content Distribution Costs

When companies distribute static content like images or videos, they must pay for all the bandwidth and infrastructure that's required to serve it to clients.
This adds up quickly and leads to high costs for companies that can afford it, and downtime for companies (or personal blogs) that can't.
P2P networks help this problem by sharing the load amongst everyone that's accessed it.
While people download your content, they also send it to anyone else that's downloading it.
As a result, the more people are loading your content, the less you need to host your own servers to distribute it.
Plus, clients can take advantage of downloading chunks of the content from multiple sources at once in order to speed things up.

As cool as all this stuff is, it's not actually a problem for most places.
Content Delivery Networks are commonplace now, and services like [Cloudflare](https://www.cloudflare.com/) have made it easy, and relatively cheap to set them up in front of your websites.
One would need to show real numbers in just how much cost would be saved, and it would need to be just as easy, if not easier, to set up as an existing CDN.

Of course, not everybody knows about CDNs or wants to pay for additional third parties in front of their content.
When a user wants to share data, they want it to be up regardless of how many people are looking at it.
With existing centralized services, you need to either use a hosting provider that handles this stuff for you or be tech savvy enough to set it up.
With P2P tech, you're able to scale your content up just by way of the protocol.

## Ease of Sharing

One of the cool things of using P2P networks like [IPFS](https://protocol.ai/projects/#IPFS) is that all I need to publish content is to run a command.
From there I get a link to the content without having to sign up for any extra services or worry about domains.
I just make my content and share it with someone.
This is enabled by the fact that you don't need to send your content to a known third party in order for somebody else to access it.
The link you get back is used to find devices in the P2P network that have a copy of your data so that you can start downloading from them.
If somebody wants to access your content, they download it directly from your device, or from any other device that has a copy of it.

If you explain this to people, however, they don't get what the point is.
Sharing stuff is already as easy as running a command and getting a link.
You can shove it on something like [Dropbox](https://www.dropbox.com) and create a link from there.
Similarly, if you're a techy type, you can put your website on Github and get a free [Github.io](https://github.io) subdomain.
Publishing content on the web is already easy because there's lots of companies to choose from, plus most of them are already handling the bandwidth issue from before.

Not all of these providers might be happy to host your content, and in the end, they get to be the ones that decide how and what you can share.
This leads to situations where companies like Tumblr can [purge content from their servers and leave people without a platform](https://www.latimes.com/business/technology/la-fi-tn-tumblr-adult-content-ban-20181203-story.html).
When you use a third party for sharing content and building your community, you're leaving all control of it to them.
Right now, it might be easy, but they can impose any restrictions or additional costs that they want and make it as hard as possible to switch to a different provider.
P2P tech on the other hand doesn't have that problem.
There's no worries about your community being ripped out from under your feet because there's no single entity controlling it.
In the end, the people that are interacting with each other decide what they want to be exposed to and opt into and out of content based on what they're comfortable with.

## Privacy

Our current model for privacy on the web is that we can trust the services we use to not screw us over.
We send them all our private messages, our personal photos, and our browsing habits.
The unspoken promise is that they're going to keep that stuff private and not spread it on the internet.
Sadly, that promise is [A](https://www.huffingtonpost.ca/entry/facebook-lawsuit-private-messages_n_4536154?ec_carp=5949834185700470415) [Big](https://www.theguardian.com/technology/2017/nov/22/google-track-android-users-location-services-turned-off-sim) [Lie](https://www.zdnet.com/pictures/biggest-hacks-leaks-and-data-breaches-2018/).

Peer to peer tech doesn't inherently provide higher privacy guarantees out of the box.
In fact, it can be worse because people can look up [every IP address](https://torrentfreak.com/video-how-people-are-tracked-using-bittorrent-080114/) downloading content, and see how much of it they have downloaded.
What it does, however, is bring all of this stuff in the open.
With centralized systems, people must assume that they can trust the service to protect their data, but with P2P, you need to use encryption to prove that something is private.
This means that if somebody wants to share private content, it'll have to be truly private rather than having it fully visible to a corporation.

The main thing I hear when I mention privacy is that "Users don't care about privacy" or "I don't care if Facebook sees my private messages".
This is great when your private data isn't being used maliciously.
Keeping information private is important for everyone to avoid [having people manipulate you](https://www.nytimes.com/2018/03/19/technology/facebook-cambridge-analytica-explained.html), your life being messed up because of [identity theft](https://www.fightingidentitycrimes.com/tax-fraud-scammers-ramp-up-their-tactics-in-2019/), and to prevent [abusive partners and stalkers](https://www.npr.org/sections/alltechconsidered/2014/09/15/346149979/smartphones-are-used-to-stalk-control-domestic-abuse-victims) from having more power over their victims.
Another thing to consider is that users don't really have a choice on the matter. All major platforms are doing sketchy stuff with our data and there's no real alternatives to all of Google's products or Facebook's ecosystem.
P2P tech is in a great opportunity to offer people a new default for how they interact with each other.

## Users Own Their Data

When you upload something to a hosting provider on the web, you don't really have control over who they decide can and can't see it, and whether they'll keep it up at all.
You're basically giving them your data, and they get to decide what to do with it.
When you create a [Dat Archive](https://datproject.org/), even though anybody can download a copy once you give them the link, you're the only one that can change anything.
This means that you have full control over the data that's in there and you get to decide who can see it.

An interesting side effect of centralization is that you no longer own the data that you put into an app.
Think of Twitter.
You make posts, you follow people, like their tweets, but in the end all of that data you've created is stored on Twitter's servers and it's a pain in the butt to get access to it.
In fact, Twitter recently decided to make it [even harder](https://www.macrumors.com/2018/04/06/twitter-api-changes-disabling-third-party-features/) for people to use the data they create within third party apps.
This is all thanks to centralization.
Data that you post on Twitter is now owned and controlled by Twitter, and it's in their best interests to hoard it for themselves.
This leaves users with less control over the communities they engage with.
If you don't like Twitter's app layout, tough luck.

In the P2P space, even if an app is generating some sort of content based on your posts, it's not able to keep that data from users.
In the end, that data is going to be shoved in a folder of some sort to share with the network, and there's nothing stopping you from sharing that folder with another one of your apps.
This gives us a great building block for innovation.
You can now separate the data from the application interacting with it.
A great example of this is the [Secure Scuttlebutt](https://www.scuttlebutt.nz/applications) ecosystem.
They defined a standard for data that could be shared in their P2P network, and from there anybody could create applications that built on top of it.
The result is that there's different social media applications like [Patchwork](https://www.scuttlebutt.nz/applications#patchwork) or [Manyverse](https://www.manyver.se/) which are totally separate projects which can interact with each other.
If you don't like a given application or want to make your own that does things differently, all you need to do is generate data in the right format and not worry about API keys or rate limits.
Having users own their data by default gives them more choice and makes it easier to try new things.

## Offline First / Local First

P2P networks work by getting data from any source they can find and having changes propagate throughout the network once peers connect to each other.
This results in two useful properties that you can't get with centralized services: Being able to download from your local WiFi or via crazy things like Bluetooth and being able to produce content that eventually syncs out when you connect to the internet.

To explain the first one, let me briefly go into how peers are discovered over the internet. When you start up your BitTorrent client, it connects to what's called a Distributed Hash Table which is a mesh of computers that allows them to advertise their IP address for a given torrent ID.
This is how other major protocols do it (other than SSB).
A downside to this is that it only works for computers that you can connect to over the internet.
You can't really use it to connect to a friend that's sitting beside you unless both your devices can be accessed via public IP addresses.
Finding devices on your local network is something that we need to do all the time.
Protocols for this have been created in order to find network printers and to connect to each others’ computers based on their name.
These protocols can be used by P2P browsers in order to connect devices directly on your WiFi rather than going over the internet.
If I have a file I want to send my friend, I can send them the link to it like I would normally, but instead of having to wait for it to travel to some server in Amazon, it'll be shared directly between our devices.
This gives you a speed improvement, but also helps if you don't have internet.
P2P applications can work when you're out camping but have a WiFi hotspot connected to a battery, or festivals where cell reception is too slow to do anything with.
This property is also useful for developing countries where they might not have a good internet connection but could feasibly have a WiFi network set up by the community.

Since you create your p2p content locally, and have it propagate out, you don't need to have an internet connection in order to author it.
If I want to make a post on a social media app, either the app developer needs to figure out a way to defer posting it to the server once I'm online, or it'll fail and make me try again later.

## How can this be leveraged?

To summarize, we need to make something that:
- Makes it easy to share data between users
- Emphasizes users owning their own data
- Works offline and shares data on the local network
- Makes it easy to form ad-hoc communities

With that in mind, I think it'd be cool to make something like Tumblr or Instagram where you have a timeline with posts that can contain text or videos and stuff.
Users should be able to "create an account" on their local device, set up tags for their profile, and find other people by their tags.
Then, they should be able to create posts on their profile and follow other's people's profiles to see their posts on a "timeline".

This should use existing technology as much as possible to make it easy for people to implement their own clients.
It should also be possible to post from multiple devices and have something or other for letting them sync with each other.
Since most people are using smartphones as their means of accessing the internet, it should be available on Android and iOS.

Once the app is established, there should be some sort of service for backing people's feeds up when they're offline.
This is to show how businesses can still offer services for P2P applications without having to have control over everything.
Other opportunities would be search indexes or spotlights which are accounts that could be followed.

This app isn't the end goal of P2P, of course.
Most apps we use either store all data locally, or share data as "lists of posts from a person".
Once developers have access to a high level API for "lists of posts", it should be easier for them to create more specialized apps like offline-first conference info, or a P2P marketplace.

The goal of this application is to demonstrate that you can have offline and local-first applications, with faster downloads, which isn't complicated for developers to set up.
Hopefully that'll wake some people up to the downsides of centralization, and turn more people towards the distributed web.