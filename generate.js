#!/usr/bin/env node
const marked = require('./marked.min.js')
const fs = require('fs').promises
const path = require('path')

const POSTS = path.join(__dirname, 'posts')

run()

async function run () {
  await generateAll()
}

async function generateAll () {
  const files = await fs.readdir(POSTS)
  const posts = JSON.parse(await fs.readFile(path.join(POSTS, 'posts.json')))

	for(let {url, title} of posts) {
		const postContent = await makePost(url, title)
		await makeIfChanged(url + '.html', postContent)
	}

	const homeContent = await makeHome(posts)
  await makeIfChanged('index.html', homeContent)
}

async function makePost(url, title) {
	const source = path.join(__dirname, url + '.md')
	const markdown = await fs.readFile(source, 'utf8')
	const content = marked(markdown)

	const tokens = marked.lexer(markdown)
	const firstParagraph = tokens.find(({type}) => type === 'paragraph')
	const description = firstParagraph.text

	return makePage(content, title, description)
}

async function makeIfChanged(output, content) {
	const location = path.join(__dirname, output)
	try {
		const existing = await fs.readFile(location, 'utf8')
		if(existing === content) return
	} catch(e) {
		console.log(e.stack)
	}

  console.log('Writing file', location)
	await fs.writeFile(location, content)
}

function makeHome (posts) {
  const content = `
  <ul>
${posts.map(({ url, title }) => `    <li class="rm-post-item"><a href="${url}">${title}</a></li>`).join('\n')}
  </ul>
`
  return makePage(content, 'Home', 'Blog posts by RangerMauve')
}

function makePage (content, title, description) {
  return `
<!DOCTYPE html>
<title>Mauve's Blog - ${title}</title>

<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="description" content="${description}" />

<style>
  @import url("/style.css");

  /* Import the syntax highlighting theme*/
  @import url("/monokai.css");
</style>

<h1>
  <a class="rm-title" href="/">
    Mauve's Blog
  </a>
</h1>

<main>

${content}

</main>

<footer>
  Copyright RangerMauve.
  You can contact me on <a href="https://mobile.twitter.com/RangerMauve">Twitter</a>
</footer>

<script src="/highlight.pack.js"></script>
<script src="/index.js"></script>
`
}
