# LLMs in the User Agent

???

Thanks for coming out!
My name is Mauve,
my pronouns are they/it,
I'm a decentralized software consultant,
and today I'm going to be talking an idea I have for user-controlled LLM APIs for web applications.

---

```dot
digraph {
  label="Cloud Based AI"
  labelloc=t
  rankdir=LR
  bgcolor="#111"
  fontname="system-ui"
  fontcolor="#F2F2F2"
  pad=0.5
  node [
    shape=rect
    style="filled,rounded"
    fillcolor="#6e2de5"
    fontcolor="#F2F2F2"
    fontname="System-UI"
    width=2
  ]
  edge [color="#2de56e"]


  user -> frontend
  frontend -> backend
  backend -> LLMAPI
}
```

---

## Tradeoffs - Cloud

- ✅ No need for GPU setup
- ✅ Huge and capable models
- ❌ Usage spikes = cost spikes
- ❌ LLM owners see all your data

---

## Tradeoffs - Local

- ❌ Need to use GPU/CPU/RAM
- ❌ Less capable small models
- ✅ No deployment costs
- ✅ All data stays local

---

## ✨ User Agency ✨

**User Agents** should provide applications with powerful APIs while enabling user agency and choice.

---

## Web LLM APIs

```javascript
const {role, content} = await window.llm.chat({
  messages: [
    {role: 'system', content: 'You are a friendly AI'},
    {role: 'user', content: 'What is your favorite thing?'}
  ]
})
```

---

## User Configurable

```javascript
{
  "llm": {
    "enabled": true,
    "baseURL": "http://127.0.0.1:11434/v1/",
    "apiKey": "ollama",
    "model": "qwen2.5-coder"
  }
}
```

---

## Use cases

- Offline chatbots
- LLM-enabled workflows
- Local translation / rewording
- LLM-Enabled Web extensions

---

## Models

- qwen2.5-coder
- phi3.5
- hermes3
- `1b` - usually gibberish
- `3B` - okay for text transform / writing
- `7B` - okay for code generation / logic
- `70b` - generally useful, needs beefy hardware

---

## Let's Build Together

- Looking for: Funding, Collaborators, Educators, Developers
- mailto:contact@mauve.moe
- https://agregore.mauve.moe

???

So that's the gist of it.
Next steps are to make it a reality, and for that we need to start working together.
Specicifically we need to figure out how to fund all this work, who's interested in building and deploying this stuff, and how we can make it accessible to people to build on top of.

If this is up your alley, send me an email or come hop into one of the chats linked to at the bottom of the Agregore website.
