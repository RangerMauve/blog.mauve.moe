# Dat Password Manager

Dat got it's first release of the [SDK](https://github.com/datproject/sdk) recently, which has got me thinking about an example app to use it for.

I've spoken to a few people about using Dat for a password manager style app that would work cross platform without dedicated cloud providers, and recentl [Karissa (aka okdistribute)](https://github.com/karissa/) suggested it as a good starting point.

## Multi device

Each device should create their own archive for passwords that they create.
Each new device will need to exchange archive URLs with a previous device in order for them to start sharing data.
If you lose a device, you can just copy the URL to the new device and pull the data from wherever it was before.

You can share URLs to other devices either by copy pasting them or by [generating QR codes](https://github.com/papnkukn/qrcode-svg) and then [scanning them](https://github.com/zxing-js/library).


## Privacy

It's not enough to keep the URls as secrets, we should also be encrypting the contents.
There should be a master password (generated with diceware or using secure random number generators), and names of websites as well as credentials for websites should be encrypted with it.
It's not too scary if somebody learns your Dat URL since your actual data and metadata is still secure.

## Keeping stuff online

Ideally you'll need to add all your archives to some sort of storage provider like [hashbase](https://hashbase.io/) or [dat-store](https://www.npmjs.com/dat-store).
This is also why the encryption is important. If a storage provider can seed your data, they can potentially scan the contents, too.
