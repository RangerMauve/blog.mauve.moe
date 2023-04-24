# Agregore Blog Workshop

Originally created for the Browsers 3000 hackathon in July 2021.

## Overview:

- Intro
  - Intro to P2P Web
	- What is Agregore
	- How to use Fetch(): `await fetch('hyper://blog.mauve.moe')`
- Protocol Overview
	- IPFS:
		- Good for data that doesn't change often / gets reused a lot between websites (CDN)
    - Not as good for private data / data that changes often
  - Hyper:
    - Good for data that's a bit more private / stuff that changes often
    - Not good for dedupliating content across websites, smaller ecosystem
- What we'll do:
  - Install Agregore
	- Learn about Devtools
	- Make our first HTML page
		- Open `hyper://blog/index.html`
		- Import `helpers.js`
		- `save()` with some default HTML
		- Elements tab in Devtools
	- Adding some CSS
		- Positioning
		- Colors
	- Add Images
		- Use this tool to upload them https://agregoreweb.github.io/agregore-drag-and-drop/
		- Show how to add a `<img>` tag
		- (Optionally) add a helper to add drag and drop to the current page
	- Q&A / Time to Work on our Pages
  - Showcase
