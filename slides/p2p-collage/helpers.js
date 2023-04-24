/* global fetch */

export async function save (
  content = getPage(),
  location = window.location.href
) {
  const res = await fetch(location, {
    method: 'PUT',
    body: content
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }
}

export async function append (content, location = window.location.href) {
  const page = getPage()
  const finalContent = page + content + '\n'

  await save(finalContent, location)
}

export async function addImage (url) {
  const parsed = new URL(url)

  const { pathname } = parsed

  const parts = pathname.split('/')
  const file = parts[parts.length - 1]

  if (!file) throw new Error('No Filename Found')

  const imageURL = new URL(`/${file}`, url)

  // We don't need to upload the image if we already have it.
  if (false && !await hasPage(url)) {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(await res.text())
    }

    await save(res.body, imageURL)
  }

  const imgTag = `<img src="${url}"/>`

  await append(imgTag)
}

function getPage () {
  return document.documentElement.outerHTML
}

async function hasPage (url) {
  const res = await fetch(url, { method: 'HEAD' })

  return res.ok
}
