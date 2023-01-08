---
title: "Scratch your own itch"
date: "2021-12-26"
author:
  name: "Brendon Otto"
  picture: "/assets/blog/authors/brendon.jpg"
slug: "scratch-your-own-itch"
coverImage:
  path: "/assets/blog/scratch-your-own-itch/scratches.jpg"
  height: "427"
  width: "640"
ogImage:
  url: "/assets/blog/scratch-your-own-itch/scratches.jpg"
imageAttribution: 'Photo by <a href="https://unsplash.com/@ashkfor121?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ashkan Forouzani</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
excerpt: "There's a saying in open source 'scratch your own itch' which means to solve your own problems and you'll likely solve someone else's too"
---

import ExternalLink from '../components/external-link.tsx'

There's a saying in open source 'scratch your own itch' which means to solve your own problems and you'll likely solve someone else's too. The open source part comes in when you share freely the solution you came up with. To push this code publicly allows others to solve their problems either directly with your solution or to extend/modify your publicly available solutions and tweak it to their needs.

I'm advocating that one does this but extend to practicing it at work too (this may limit your ability to open source it I realize). I recently built a console app to give me the current time in several times zones across the globe (I work in a team distributed across North America, Europe and South America). I want to be respectful of my team mates working hours and will set a reminder to follow up with them the next day instead of pinging them in their off hours.

I built a console app in Rust that makes concurrent requests to the <ExternalLink url={`https://timezoneapi.io/developers/timezone`}>TimeZone API</ExternalLink>. About a day after I got everything working how I wanted, we needed to test a bunch of domains being migrated to verify DNS resolution at work. This console app was already designed to make a bunch of concurrent HTTP requests, all that was need was to tweak it to receive a file of domains for testing. A colleague of mine did a little competition between our solutions using different languages, he Ruby and I Rust. Turns out Rust was faster which wasn't a surprise but what was eye opening to me was how fast he was able to get Ruby to the Rust implementation (it still ended up being about twice as fast).

I had a need and built myself a solution which in turn enabled me to have a solution ready for a very valid work use case. In scratching my own itch, knowing times across continents, I had already written about 80% of a program that solved a need at work. Solving your own problems may not always have a future use case in your job but the more you do it the more it might happen to you :).

Thanks for reading.
