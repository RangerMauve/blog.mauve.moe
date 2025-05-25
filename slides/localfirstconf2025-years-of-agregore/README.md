# 5 Years of Agregore

---

## Goals

- Recap what I've been doing this whole time
  - Why? To talk about the decisions made and why they were made.
- Why offline and mesh networks are important
  - Why?: Cloud sync is not enough due to power imbalances and limitations on reliability / longevity

## Why Agregore

- Current app development is tightly coupled with internet and centralized cloud infra
- Nothing works without internet
- The stuff that does work is usually offline
- It's hard to make and distribute apps that fall outside this
- It takes deep technical knowledge to make apps that fall outside of this

Agregore makes the default for the web friendly to local networks and enables anyone that can write a bit of HTML create apps like this without needing to deal with native app distribution and platform specific quirks.

## Timeline

- Beaker Browser Jun 2018 [presented at Ottawa JS](https://github.com/RangerMauve/ottawajs-p2p-web-talk)
	- [Paul Frazee](https://www.pfrazee.com/about) and [Tara Vancil](https://taravancil.com/about) made something easy to use with great documentation
	- Why? This is what inspired me to think about websites and apps served over local networks.
- Dat Archive Web - April 2018 [Link](https://github.com/RangerMauve/dat-archive-web/tree/master)
	- Wanted to get Beaker apps working in other areas
	- Used websocket based gateway to load from p2p network
	- First time presenting this in Berlin at DTN 2019
	- Why? This was the precursor work of me trying to get p2p into existing browsers
- "dat-fetch" - June 2019 [link](https://github.com/RangerMauve/hypercore-fetch/commits/master/?after=dd00e62931281b11e97cfb7d9d47b66737a8b136+209)
	- Focus on protocol handlers and browser "fetch API"
	- Why? This got me to the edge of what is practical in regular browsers. In the end I decided that getting p2p into regular browsers just won't cut it because they're made for isolated HTTP sites.
- Natakanu - March 4 2020 [link](https://github.com/Wapikoni-Technique/Natakanu/commit/f24212e34e006381f8c5a804edd5f998f7e1142b)
	- Work by Wapikoni Mobile and Condordia University
	- Local-First file sharing for Indigenous communties
	- Used dat-fetch to serve previews of files
	- Why? This showed me that it's actually pretty easy to get a P2P Browser shell going with Electron
- "DWeb Browser" - June 18 2020
	- Initial release, slapped a basic electron UI over dat-fetch
	- Why? This is the birth of Agregore, an offshot one afternoon when I had time to tinker.
- Agregore Browser - June 20 2020
	- Brainstorming with friends David and Aldous to get the new name
	- Why? The original name was uninspired and I wanted something unique
- First code contribution - June 23 2020 [link](https://github.com/metanomial)
  - Metanomial added context menus
  - Why? From the get go this has been an open project that welcomes improvements. It's got a copyleft license so there's no way to close it and run away even if I wanted to.
- PUT to `hyper://` - Jul 2020 [link](https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.0.0-10)
  - Why? This helped solidify my philosophy around focusing on URLs and existing HTTP methods. If devs know to GET/PUT/DELETE we should do that with p2p URLs to keep the transition seamless and to reduce the API surface
- First time presenting Agregore - July 31 2020 - [links](https://www.youtube.com/watch?v=TnYKvOQB0ts)
  - Why? Working with the community around dat was foundational to me view on how software works and presenting to them was the first time I presented my goals around the project and my work in general.
- Gemini Protocol - August 18 2020 [link](https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.0.0-14)
  - A sort of simplified web protocol
  - Kinda like Markdown + raw TLS
  - Why? This was the first dip into adding more protocols beyond what I was familiar with. It's not really offline capable but the low tech and indie community around it is cyberpunk as heck and I'm still working on improvements for it today.
- Ad Blocker extension - August 20 2020 [link](https://github.com/AgregoreWeb/agregore-browser/tree/6cc51b8d7988c0f89d08b97ae4df62f9a2bba2f2)
  - Ads are malware
  - Wrote as a web extension to allow customization
  - Why? My first extension was the core "history" extension, this was the first one that seemed like it could truly be replaceable and was an example of customizing the core of Agregore without needing to fuss with Electron code. I hate ads and the advertising industry with the passion of a thousand suns and will do anything I can to shield users from this plage on the noosphere.
- First extension contribution - October 2020
  - KyGhost contributed a markdown renderer
  - Why? KyGhost seemed to get the spirit of the browser and supporting new content types has been a major feature that I've been developing further.
- IPFS support - October 24 2020 [link](https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.0.0-26)
  - Now supporting multiple p2p protocols
  - Also in a `-fetch` based interface
  - Why? IPFS has been a major player in the P2P file transfer space. Beaker actually had it integrated until they removed it to focus more on Dat. Adding it in opened up a whole world of possibilities to think outside of just one protocol.
- BitTorrent support - April 2021
  - Most popular p2p protocol!
  - Via webtorrent-hybrid
  - Why? I'd messed around with webtorrent and bittorrent in the past and it seemed like a natural extension to what we had already. I was hoping someone would build a p2p web app on top of it for viewing videos and the such, but no such luck yet.
- QR Code Scanner - April 10 2021 [link](https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.0.0-69)
  - [Zooko's Triangle](https://en.wikipedia.org/wiki/Zooko's_triangle)
  - Chose Decentralized and Secure
  - P2P URLs long and hard to type
  - Two devices can share via camera and connect over local network
  - Why? I think that decentralization and security should be the priority in p2p sites and we should find ways to ease the burdon on people wanting to share links. Most devices have cameras these days and QR codes have the benefit of being easy to print permenantly.
- Agregore Mobile - May 18 2022 [link](https://github.com/AgregoreWeb/agregore-mobile/releases/tag/100.0.4896.135)
	- Funded by Filecoin Foundation
	- Protocol test suite matching Desktop
	- Why? This was the first time I actually got paid to work on Agregore related code directly. I'd been messing with getting P2P protocols into native webviews in the past, but I knew that to get true support we'd need to operate at the same level as HTTP which meant customizing the browser engine. Mobile devices are how most folks access information systems these days and I want to support that use case.
- Robust Extension System - June 3 2022
  - Official 1.0.0 release
	- Funded by FF
	- In collaboration with WebRecorder team
  - Start saving high fidelity replayes of pages for offline use
  - P2P publishing of archives to IPFS to load back as ReplayWeb sites
	- Why? After overhauling the extension system it felt like the browser was stable enough that I wouldn't be totally rewriting it from scratch again. Having Webrecorder in there also helped support the case of empowering users to start collecting whatever sites they wanted for offline use and not needing to worry about whether their bookmark would work next year.
- Hybrid Browser First Active Fork - October 2022 [Link](https://github.com/neobitweb/hybrid-browser/commit/32bae7637d69531652834a89b4bdb0903eb92408)
  - Why? Other browsers in the space that are mostly compatible?
- Tutorials and Docs - Jan 30 2023 [link](https://github.com/AgregoreWeb/website/pull/35)
  - Lots of features but lacking explanations
  - Funded by Filecoin Foundation
  - Added a bunch of tutorials and better documentation for protocol handlers
  - Why? I think a major part of why Beaker was so powerful wasn't just that it had APIs, but that it had a bunch of tutorials and documentation for folks to get started with. Thanks to the Filecoin Foundation and the hard work of Ankeet,Caprice,Dirk,Judy and Vincent we got some progress towards that capability.
- Distributed Press - April 25 2023 [link](https://hypha.coop/dripline/distributed-press-v1-announcement/)
  - Agregore reads / computes
  - Distributed Press Publishes accross protocols
  - Why? One issue I kept seeing was that people would be curious about the dweb and wanted to get started, 
- Local AI API - September 25 2024 [link](https://github.com/AgregoreWeb/agregore-browser/releases/tag/v2.6.1)
	- User controlled language models
	- Using ollama and 8B models
	- Why? My goal is to make it possible to make and publish p2p web apps by non coders and local LLMs make this possible for folks without needing to be always online and paying some cloud company per token.
- LLM App Generator - Nov 11 2024 [link](https://github.com/AgregoreWeb/website/commit/fe25ffb4796cb1514c9dbef4277dedba9701f272)
  - First step towards "vibe code" based app generation
  - Text prompt and publishes a p2p web app all locally
- explore.distributed.press - Feb 2025
  - Helps with discovering p2p sites and content
  - Why? People would often come into chatrooms related to the dweb asking where to find stuff. Thankfully we now have an aswer that's semi automated!
- Finally got a View History Page - April 5 2025
  - Fuzzy search in the URL bar was the way to go
  - Now you can search through more entries and delete history items
  - Why? It took me like five years to get around to doing something that's table stakes in other scenarios. I think this also means that this year I'll be able to focus more on the polish now that a lot of the core has stabilized.
- Collab with Peersky on browser styling - May 11 2025 [link](https://github.com/AgregoreWeb/agregore-browser/releases/tag/v2.12.0)
  - Peersky released in June 18 2023 with a similar approach to Agregore
  - Now we're collaborating on standards to make p2p web apps compatible between us
  - Why? I've been working on making the dweb usable for a while, and this collaboration with Peersky shows that it's not just me here. There's a whole ecosystem forming and unlike the major browser engines it's easier for new projects to get started and collaborate with each other without needing to be fortune 500 companies.

## Future

- App Gen should know about the fetch and LLM APIs to enable more compex p2p apps
- More features for mobile
- Even more polish
- P2P Extension potlucks for finding new extensions to customize your browser

## Thanks To

Here's a list in no particular order of Github accounts of people that contributed to the development of Agregore and the adjacent tooling around it.

- https://github.com/ASoTNetworks
- https://github.com/AnaFukelman
- https://github.com/Arskan17
- https://github.com/DeltaF1
- https://github.com/KyGost
- https://github.com/Madrets
- https://github.com/Vexon2000
- https://github.com/akhileshthite
- https://github.com/almereyda
- https://github.com/autonome
- https://github.com/av8ta
- https://github.com/benhylau
- https://github.com/brechtcs
- https://github.com/canadaduane
- https://github.com/capriceesmas
- https://github.com/cerrussell
- https://github.com/cinnamon-bun
- https://github.com/dirkcuys
- https://github.com/ducksandgoats
- https://github.com/fauno
- https://github.com/gardenappl
- https://github.com/jackyzha0
- https://github.com/jolindroth
- https://github.com/josephmolina256
- https://github.com/lidel
- https://github.com/maisutton
- https://github.com/makew0rld
- https://github.com/metanomial
- https://github.com/reggi
- https://github.com/resession
- https://github.com/rex4539
- https://github.com/sudocurse
- https://github.com/techie177
- https://github.com/todrobbins
- https://github.com/tripledoublev
- https://github.com/unmellow
- https://github.com/writerly03
