(() => {
	hljs.initHighlightingOnLoad();
	const toAnchor = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]')
	console.log('Anchoring', toAnchor)

	for(let element of toAnchor) {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', `#${element.id}`)
		anchor.innerText = '# '
		element.prepend(anchor)
	}
})()
