# Cool Links to Neat Stuff

## 2025/10/22

- [glassworm malware](https://www.koi.ai/blog/glassworm-first-self-propagating-worm-using-invisible-code-hits-openvsx-marketplace) it uses webrtc, bit torrent DHT, and blockchain smart contracts to distribute commands and payloads which is really neat.

## 2025/10/21

- [Cyberdoof](https://www.cyberdoof.com/guides/how-to-doof), kinda like mozilla hubs but voxel based
- [Edge AI using the Rockchip NPU](https://tristanpenman.com/blog/posts/2025/07/20/edge-ai-using-the-rockchip-npu/). I've been considering migrating to the Khadas Edge 2 as my portal machine so this is appealing.
- [Why today's humanoids won't learn dexterity](https://rodneybrooks.com/why-todays-humanoids-wont-learn-dexterity/). Talks about how current training data and robot designs are lacking tactile feedback needed for dexterity.

## 2025/09/15

- [Vapeserver](https://bogdanthegeek.github.io/blog/projects/vapeserver/), webserver hosted on a disposable vape.

## 2025/09/01

- [Chartwell ligature charts](https://www.vectrotype.com/chartwell). Absolutely amazing use of font ligatures to render charts from basic text!

## 2025/08/14

- [Stochastic Code Monkey Theorem](https://www.stephendiehl.com/posts/ai_for_coding/), another take on AI focused on code generation. a bit more nuanced than "AI bad forever" but also clear on where there is utility to be had.

## 2025/08/07

- [HTML is dead long live HTML](https://acko.net/blog/html-is-dead-long-live-html/). Another post about everything wrong with HTML/CSS dev and some ideas for remaking the DOM from first principles.

## 2025/08/06

- [Hackerpager](https://www.hackerpager.net/). Kinda like a flipper zero but for LoRa / meshtastic

## 2025/08/04

- [Serializable Transactions in P2P Databases](https://joelgustafson.com/posts/2025-07-21/serializable-transactions-for-peer-to-peer-databases). a novel design for serializable database transactions in multi-writer eventually-consistent environments

## 2025/07/21

- [TCP in UDP](https://blog.mptcp.dev/2025/07/14/TCP-in-UDP.html). Method to bypass censorship by hiding TCP inside UDP streams
- [parakeet-tdt-0.6b-v2](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v2) an LLM based speech recognition model. Apparently comparable in performance to models 4x its size.
- [Unbounded Browser Extension](https://unbounded.lantern.io/). Uses QUIC to route people's traffic through your browser to help circumvent internet traffic censorship accross the world.

## 2025/07/15

- [Secure Minions](https://ollama.com/blog/secureminions). Neat setup where local models talk to remote models using secure enclaves.

## 2025/07/14

- [Cost of health optimization](https://www.precisionnutrition.com/the-cost-of-health-optimization). Great article about how investing in basic health improvements can have a drastic effect compared to aiming for very expensive "advanced" optimizations.

## 2025/07/10

- [Programming Sucks](https://www.stilldrinking.org/programming-sucks), a fun post about all the pain involved in getting computers to do anything for a living.
- [smollm3](https://huggingface.co/blog/smollm3), 3b model that's competitive with Qwen3:4b. Cool thing is that it is fully open. Writeup talks about how they improved perf.
- [Running Ollama on AMD iGPU](https://blog.machinezoo.com/Running_Ollama_on_AMD_iGPU), I've had a lot of issues with this on my GPD WIN 4 so I'll see if this guide can help with that.

## 2025/07/09

- [Mu Language Model](https://blogs.windows.com/windowsexperience/2025/06/23/introducing-mu-language-model-and-how-it-enabled-the-agent-in-windows-settings/). Great writeup about how M$ optimized a tiny 500M model to run on their hardware accelerated computers with support for function calling.

## 2025/07/05

- [Memory blocks](https://www.letta.com/blog/memory-blocks). Good article for strategies around LLM memory creation and retrieval. One neat idea was to give it a rewritable prompt.
- [Project Discovery - Nuclei](https://docs.projectdiscovery.io/tools/nuclei/mass-scanning-cli). Framework for detecting vulnerabilities.

## 2025/06/24

- [Reinforcement Learning Teachers of Test Time Scaling](https://sakana.ai/rlt/). A new approach for training "teacher models" that distill knowledge down to smaller "student models" which results in smart small models.

## 2025/06/19

- [Homomorphically encrypted CRDTs](https://jakelazaroff.com/words/homomorphically-encrypted-crdts/). Great writeup about practical uses of homomorphic encryption in Rust.

## 2025/06/18

- [End-to-end encryption using WebCrypto APIs and Diffie-Hellman Key Exchange](https://www.keithbartholomew.com/blog/posts/2024-01-22-webcrypto-diffie-hellman/). Excellent post about how to use the web crypto API to do public key cryptography stuff.

## 2025/06/12

- [SQISign](https://sqisign.org/) a post-quantum cryptographic signing scheme.
- [App-pocalypse now](https://blog.codinghorror.com/app-pocalypse-now/), a rant about how apps suck pretty much.

## 2025/06/11

- [Datomic pro](https://jepsen.io/analyses/datomic-pro-1.0.7075). Great overview of the Datomic graph database. I'm a huge fan of their approach and this is a pretty comprehensive overview.

## 2025/06/09

- [cursed knowledge](https://immich.app/cursed-knowledge/). Fun collection of how tech can behave weirdly. Could be useful to avoid issues in the future!

## 2025/06/02

- [easytier p2p VPN](https://easytier.cn/en/). Been wanting an easy way to route betweeb my devices. This could be it! Gotta read the source first to see how it works.

## 2025/05/23

- [the copilot delusion](https://deplet.ing/the-copilot-delusion/). some more ramblings about the risk of depending on LLM code generation

## 2025/05/21

- [gtoolkit - browse code with grsphs](https://gtoolkit.com/). I've idly considered making a code editor that treats code as a traverseable graph. This seems to go one step further and link between text and graph views with multiple tabs. It's customized with smalltalk which I've been wanting to learn. Overall seems like it'd useful for inspo if not to actually use.

## 2025/05/19

- [Scrappy app maker](https://pontus.granstrom.me/scrappy/). They made a tool for drag and drop UIs for "small apps". It'd be cool to do something similar with Agregore.
- [benui - why I refuse AI](https://benui.ca/why-i-refuse-ai/). Good summary of some of the issues with relying on LLMs for coding. I feel some of the same convictions.

## 2025/05/14

- [oniux tor isolation](https://blog.torproject.org/introducing-oniux-tor-isolation-using-linux-namespaces/). Runs linux processes in isolated contexts to make sure all their networking is running through tor

## 2025/05/12

- [LLM codgen workflow](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) pro tips for making LLM based code generation work. Maybe I can steal some ideas for Agregore

## 2025/05/05

- [Notes from the local AI talk I did in feb](https://agora.exo.cat/t/ia-de-km-0/371/2), part of it is in Spanish.
- [~dozens bookmarks](gemini://tilde.town/~dozens/bookmarks.gmi), useful for finding gemlogs and capsuls. E.g. here's a [search engine](gemini://tlgs.one/search?agregore) I found through them.

## 2025/04/24

- [yazi - command line file browser](https://github.com/sxyazi/yazi), seems pretty fast! I've been tired of messing with GUI based editors so this will be a nice change of pace.
- [ai predictions for 2027](https://ai-2027.com/). A sort of speculative fiction about where AI might be going. Could be cool to revisit over the years (Assuming we're alive still).

## 2025/04/17

- [omnisvg, vector image gneration model](https://omnisvg.github.io/). I love SVG and prefer vectors to rastors whenever possible, it'd be cool to make a lil app with it some day.

## 2025/04/15

- [sqlite + telegram = ai assistant](https://www.geoffreylitt.com/2025/04/12/how-i-made-a-useful-ai-assistant-with-one-sqlite-table-and-a-handful-of-cron-jobs). Inspiring for getting my Mind Goblin assistant to finally have a memory and maybe connecting that memory to the network.

## 2025/04/09

- [dolthub prolly tree vector index](https://www.dolthub.com/blog/2024-10-08-how-to-build-a-vector-index-with-prolly-trees/), I've literally been wanting to do this for over a year but haven't had time to sit down and do it so it's great to see somebody beat me to it! Their approach requires rebalancing which IMO isn't ideal.

## 2025/04/08

- [olmo2 model](https://allenai.org/blog/olmo2), fully open with the training data, weights, and recipe.

## 2025/04/03

- [Stop syncing everything](https://sqlsync.dev/posts/stop-syncing-everything/) post about the value of sparse replication

## 2025/03/20

- [Zero Shot TTS Voice Clone](https://sparkaudio.github.io/spark-tts/) could be cool for trying to make an LLM talk in my voice down the line.
- [Interaction Nets](https://wiki.xxiivv.com/site/interaction_nets.html), neat way to think of computation as graph transformations. I've been wanting to do a graph manipulation programming tool so this could be good inspo

## 2025/03/14

- [Machine learning applied to brain-computer interfaces](https://medium.com/@re-ak/machine-learning-applied-to-brain-computer-interfaces-cheat-sheet-f616d28909c1) I've been wanting to do more EEG BCI so this will be handy for that.

## 2025/03/01

- [Graph Neural Networks](https://distill.pub/2021/gnn-intro/) graph manipulation and visualization has been on my mind so this should be relevat to that.
- [Leaf protocol](https://zicklag.katharos.group/blog/introducing-leaf-protocol/) a new protocol for federated data. Focuses on data rather than events between servers.

## 2025/01/21

- [Group Key Agreement](https://www.inkandswitch.com/keyhive/notebook/02/) Tool for agreeing on shared encryption keys in p2p groups that change over time.
