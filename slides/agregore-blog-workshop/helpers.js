/* global fetch */

const IMAGE_ENDINGS = ['png', 'svg', 'jpg', 'jpeg', 'gif']

window.ondragover = () => false
window.ondrop = async (e) => {
  e.preventDefault()
  const { dataTransfer } = e
  if (!dataTransfer) return

  for (const file of dataTransfer.files) {
    const url = await uploadFile(file)
    if (isImage(url)) await addImage(url)
  }
}

function isImage (url) {
  return IMAGE_ENDINGS.some((ending) => url.toLowerCase().endsWith(ending))
}

export async function save (
  content = getPage(),
  location = getDefaultURL()
) {
  const res = await fetch(location, {
    method: 'PUT',
    body: content
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }
}

function getDefaultURL () {
  const location = window.location.href

  if (location.endsWith('/')) {
    return location + 'index.html'
  }
  return location
}

export async function addImage (url) {
  const img = document.createElement('img')
  img.src = url
  document.body.appendChild(img)
  await save()
}

export function getPage () {
  return document.documentElement.outerHTML
}

export async function getPublicURL (name = '/') {
  console.log('Generating public URL', name)
  const response = await fetch('/.well-known/dat')
  if (!response.ok) throw new Error(await response.text())
  const record = await response.text()
  const base = record.split('\n')[0]
  const full = new URL(name, base)
  full.protocol = 'hyper:'

  const url = full.href

  console.log('Generated URL', name, url)
  return url
}

export async function uploadFile (file) {
  const name = file.name
  const body = await file.arrayBuffer()

  console.log('Uploading', { name, body })

  const response = await fetch(`/assets/${name}`, {
    method: 'PUT',
    body
  })

  if (!response.ok) throw new Error(await response.text())

  await response.text()

  const url = await getPublicURL('assets/' + name)

  console.log('Uploaded', { name, url })

  return url
}

globalThis.save = save
globalThis.getPublicURL = getPublicURL
globalThis.addImage = addImage
