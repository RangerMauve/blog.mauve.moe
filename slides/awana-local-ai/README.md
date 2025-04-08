# State of Local AI

### Made for Awana Digital

<small><a href="https://ranger.mauve.moe">By Mauve Signweaver</a></small>

---

## Overview

- Local LLM tools / models
- Speech To Text
- Model Context Protocol
- Viability

---

## Local LLMs - tools

- [ollama](https://ollama.com/) - command line / server
- [LM Studio](https://lmstudio.ai/) - graphical app
- [Open Web UI](https://github.com/open-webui/open-webui) - Graphical chat app

---

## Quantization

- 32bits -> 4 bits
- Smaller size, same neurons
- Faster inference
- Needed for consumer hardware

---

## Local Models - Sizes

- 14B - Smarter, focus longer  `~9 GB`
- 7B/8B - Can follow instructions `~5 GB`
- 3B - Text transforms, confused fast, `~2 GB`
- 1.5B and down - Very fast, only simple instructions, `~1GB`

---

## Model flavors:

- Qwen: Multilingual, from China, my fave
- Llama: Facebook, better at larger sizes
- Gemma: From Google, small models made for phones
- Phi: Microsoft, likely built into windows soon
- Hermes: Fine tuned on corpo models, more "creative"
- Dolphin: Fine tuned, aim to be "uncensored"

---

## What can LLMs do?

- Summarize text
- Decide based on criteria
- Write code / Prose
- "Tool calling" -> Call APIs
- "Thinking" -> e.g. [DeepSeek](https://arxiv.org/abs/2501.12948)

---

## Fine tuning / Other languages

- Qwen is decent with cross-language
- 3B models can be tuned reasonably on consumer hardware
- Models train on trillions of tokens
- Foundation models cost millions of dollars to train
- Hard to find that much labelled data for indigenous langs
- [Te Reo Māori](https://news.microsoft.com/en-nz/2024/05/28/how-generative-ai-is-transforming-te-reo-maori-translation/)

---

## Speech To Text

- [OpenAI Whisper](https://github.com/openai/whisper)
- Small: Needs 2GB RAM, could run locally realtime
- Medium: ~5GB RAM, hard to do realtime
- Large: ~10 GB, high accuracy, needs dedicated hardware

[source](https://github.com/openai/whisper/discussions/5#discussioncomment-3703959)

---

![different languages have more or less training data](./language-datasets.svg)

---

## Limitations:

- Need lots of high quality labelled audio
- Training can be expensive
- Running inference along LLMs needs more hardware

[training](https://github.com/openai/whisper/discussions/64)

---

## Model Context Protocol

- New [standard](https://modelcontextprotocol.io/introduction) for defining tool calls for LLM frontends
- Run a local server and add tools to it
- LLM automatically chooses how to use tools
- E.g. used to control blender, local files, etc
- Could Comapeo data be available as a tool?

---

## So What?

- Grants going out for building on this stuff
- Could help interface with tech without needing to be a dev
- Small / offline models capable enough for basic tasks

