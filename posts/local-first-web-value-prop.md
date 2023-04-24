# Local First Web Value Proposition

Local First software and the web is something that's close to my heart.
But at the end of the day, the value something brings to people and concrete improvements to their life is the important bit of it all.
In this post I'll be looking at some of concrete examples of the value that local-first tech brings (specifically in relation to Agregore).

## What is it?

- peer to peer protocols
- ad hoc mesh networks
- simple web apps / documents
- authoring within p2p web browsers
- distributing apps / data over the network

## Abstract value prop

Not everyone is served by the state of cloud tech.

Cloud based apps assume a constant connection to a data center somewhere and assume the operator has final say on everything.

For some folks, a constant connection isn't feasible.
For others, the values of the corp running the tech platform might not align.
Sometimes, just making a cloud based app and maintaining it can result in a lot of extra costs for maintaining and moderating centralized infrastructure.

Local-First apps sidestep these mismatches by focusing on person to person communication and community based moderation that results in bottom-up hierarchy rather than a top-down higherarchy (socially, and in terms of network topology).

Here's a few specific user stories for how folks aren't served by the state of cloud tech, and how local-first web tech can let them do things that are harder otherwise.

## User Story 1

Person with unreliable network connections.

From personal experience, I didn't always (and still don't sometimes) have access to a reliable internet connection everywhere I went.
I think this is also the case for a lot of folks who either need to go areas where there's no cell reception or wifi, or can't afford to pay for a reliable internet connection, or simly don't have local infrastructure for it.

The story looks like this: Somebody wants to use software installed on their phone or laptop.
The software happens to rely on loading stuff from a server in a data center somewhere to even boot.
Likely, it's doing an authentication check, or simply hasn't been architected to work without the constant connection.

Let's say there away from home or wherever they usually have access to internet, or there's been an outage in their area due to weather or ISP/Data Center outage (happens a bit too often, but rare enough most folks don't care).
Now what was once a useful tool to organize the persons data or to catch up on content from their friends/community, becomes a useless brick.
This is particularly true of web apps today. Even though we've got these new "Progressive Web Apps" that are supposed to work offline, they're not the default and even if you set up to use them, they end up being limited without a lot of extra effort.

Now, if you're lucky you have an app that cached some data offline, if you're extra lucky you have an app that can let you author data or make changes and sync once it's reconnected to the network.

What's frustrating is that even if you're physically next to somebody else that has a working device, you typically can't exchange data with them even if you could feasibly connect to each other directly.

With local-first tech, all of the apps a person has installed can be loaded from their local cache, and all data is authored locally to be synced out when connected.
What's more, if there's other devices nearby they want to communicate with, they can form an ad-hoc wifi network and their apps will be able to talk to each other as though they were talking over the internet.
The neat thing here is that the authors of the applications didn't need to do much to account for this scenario.
Apps "just work" whether you're on the internet, on an ad-hoc network, or fully offline.
This means that our devices can be that much more useful without being dependent on AWS being constantly online or your cell coverage being shaky when you're visiting the park.

The specific app here could be more than just "social media".
It might also be "performing a survey on the physical state of something" or other cases where you need software to "just work" so you can get your job done.
The most important part of software is that it works when people need it to, and a hard dependency on the cloud means it can't work in a lot of scenarios.

## User Story 3

Small scale app development / deployment.

## User Story 2

Community with their own network and local knowlege.

## User Story 3

Sex workers and LGBTQ folks being censored on cloud sites.

## Conclusion

Some people aren't served by centralized systems.
Local-first tech makes it easy to serve both them, and folks that are okay with the status quo.
It's also less effort to set up networked applications with less cost for development, server maintenance, and moderation upkeep.

---

Last updated December 2022
