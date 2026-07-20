# Ideas

Random ideas I want to work on but that don't get a full post yet

## Wifi HaLow P2P File Transfer

Inspired by [this video](https://www.youtube.com/watch?v=0XhqjaGmKiw&t=926s)

- Get some HaLow adapters
- Get MDNS peer discovery working on them
- Get Hypercore connecting over them
- Demo Agregore over Wifi HaLow mesh
- Maybe have a gateway on one of these [t-halow](https://lilygo.cc/products/t-halow) boards?

## Headless Screen Reader

Instead of relying on orca on linux, I should make my own.

- Ignore mouse movement
- Run in a "headless" session by having the window manager render to a fake display
- Focus on navigating the acessibility tree instead of window coordinates.

## wxWidgets.js

NodeJS bindings for [C++ based cross platform wxwidgets library](https://docs.wxwidgets.org/stable/page_topics.html).

- Slop to analyze how its used
- Generate bindings
- Maybe fork from [wxNode?](https://github.com/joeferner/wxNode)
