# Why the p2p web?

I've been thinking about how I can explain the benefits of the p2p web, and really to understand what the real-word benefits are myself. Here's what I've come up with.

First of all, let me give a breif description of what the `p2p web` even is: What if websites were like torrents? What if they were loaded through a peer to peer network instead of from a centralized server.

## It has better privacy

With peer to peer software three's no central authority monitoring everything you do. You load and publish data to "the peer to peer network" which means it goes through any computer participating in the network rather than the servers controlled by a company. This makes it harder for a single authority to monitor everything people do. If they can't see the traffic, then they can't do sketchy stuff with it.

Stuff is kept secret by encryption rather than trusting a third party with all your data. A lot of people say that they don't care if Facebook knows everything they're doing online since they can trust them. But the problem isn't just that Facebook knows. The real risk is that Facebook might get a data break (or might sell the data willingly) to malicious third parties that could use your information to impersonate you, steal credentials, or other sketchy things. With peer to peer systems, the system isn't designed to trust a third party, if a developer wants something to be secure, they need to encrypt it, which leads to applications being designed more securely.

People can only access data if you link it to them. The current web has the concept of "private links" in that you can upload something to YouTube or Dropbox and create a link to share it with somebody. But the thing that gets missed is that this isn't _really_ private. The service you shared the content on has full access to your data and as mentioned before, there's no guarantee that there's nothing else analyzing it.

## Downloads are faster, and you save internet bandwidth

With the centralized web, you need to establish a connection to a server to download content. This means that your speed is limited by the single server. With the p2p web, however, you download bits of the content from any other computer in the p2p network that has downloaded it before. This results in a speed boost since you can have a bunch of parallel connections at once.

With the centralized web, if somebody's blog becomes popular, their server sudedently gets hammered and goes down due to the load. When thre's no central server to worry about, popular content has more people sharing it, and as such results in less load on the original publisher. The load of loading the content is shared amongst everyone that's accessed it.

Sharing files is more efficient with the p2p web. When you share a file on Google Drive, you first need to upload your file to Google's servers, then whoever is loading your file needs to download it from Google's server. This means the file gets transmitted twice and likely has to bounce all around the world before it's shared. This is especially crazy when people are in the same room or on the same network. With peer-to-peer tech, the devices connect directly to each other and the file only needs to go over the network once. If you're connected to the same WiFi, you can avoid using the internet alltogether and get even better speeds.

## Simple publishing

Creating a website on the web is a little bit scary if you're making something from scratch. You need hardware to be set up, server software to create and load your content, and domain names to get people to visit your website.

Even if you have the hosting figured out through a third party, coding the back-end is an extra hassel on top of the presentaion of your website. There's a bunch of stuff you need to think about like databases, different programming languages and frameworks, and accounting for all load-related issues of having everything going to one place.

With the peer to peer web, you get rid of all of that. You create a website by making the HTML/CSS/JS files in a folder, and creating what's essentially a torrent. Then you share the link to your torrent and that's it. You only need to focus on what your website content is rather than how it gets to users.

Since websites are just files in a torrent, it's easy to create authoring tools to generate these websites. In fact, it's easy enough for a website to generate another website without going to any external source. Best of all, it works offline. You don't need to be connected to a server to update anything. You just make the changes on your device, and it'll sync with the rest of the network next time you're online (or immediately if people are on the same WiFi).

## Business opportunities

In aiddition to benefits for users and content creators, there's also benefits for developers and new businesses.

### Applications

Developers can focus on building apps and don't need to worry about centralized services to distribute them. A new peer to peer foundation will open the doors to new possibilities for how applications can be built. Reducing the overhead of centralized systems allows developers to focus on what the application does, and the p2p aspect leads data to being controlled by the users first instead of a third party.

### Backups

People don't always have their devices online, so having backups is important to have highly available data. In addition to sharing data, backups are good for peace-of-mind so that users know that their content is safe if their devices get borked.

This doesn't need to be handled by browsers directly, services just need the URL of the users resource and can use whatever interfaces they want fo managing the backups. Since backups only need the user's URL, users can easily switch between backup providers without having to figure out how to export theie data.

This also opens the door for all-in-one hardware packages so that people can set up a backup-box on their own network instead of relying on a cloud provider.

### Inboxes

Since p2p lends itself best to `opt-in` following of people's data, there's still space for centralized tools for letting people get notifications.

Ideally, there should be a standard for inboxes that uses cryptography so that people encrypt their data before it gets sent to the recipient in such a way that only the recipient (not the service provder) can see what the contents are.

### Payments

Of course people should be able to make money, and payment platforms will still be relevant. Ideally, browsers should extend the WebPayments API to support decentralized forms of currency in addition to existing methods.

Developers should be able to set up payments in their apps, and users should be able to pay for things with as little friction as possible.

## Projects to start following

### Beaker / Dat

- Updates to your data are fast
- Has a web browser that lets you load and publish content using the dat protocol

### IPFS

- Has global deduplication of files
- If two websites have the same file, then the load for sharing that file is shared between users of both websites
- Supports a lot of different transports with the goal of working across planets in the future

### MaidSafe

- The network automatically backs up your content across servers using SafeCoin
- You can donate compute and storage power of machines to earn SafeCoin to publish your content

### BitTorrent

- Arguably the most popular p2p software
- Already used for sharing files, just needs a web browser for sharing websites