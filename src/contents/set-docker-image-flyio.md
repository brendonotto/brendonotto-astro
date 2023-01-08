---
title: "Set Docker Image to use on Fly"
date: "2022-09-09"
author:
  name: "Brendon Otto"
  picture: "/assets/blog/authors/brendon.jpg"
slug: "set-docker-image-flyio"
coverImage:
  path: ""
  height: ""
  width: ""
ogImage:
  url: ""
imageAttribution: ''
excerpt: ""
---

I'm working on a new Phoenix application that I wanted to deploy to [Fly.io](https://fly.io/). I started with version 1.14 of Elixir which was released [a few days ago](https://elixir-lang.org/blog/2022/09/01/elixir-v1-14-0-released/) and when I went to deploy it Fly failed to deply because it couldn't find the correct Docker image:

```bash
Error failed to fetch an image or build from source: error building: failed to solve with frontend dockerfile.v0: 
failed to create LLB definition: docker.io/hexpm/elixir:1.14.0-erlang-25.0.4-debian-bullseye-20210902-slim: not found
```

I thought it was strange that it's trying to find an image with a date in the name that pre-dates the release of the version I'm using 🤔. There must be a way to tell Fly what image I want to use as a base, right? There is! Open `fly.toml` and add an entry for the following:

```toml
[build]
  image = "hexpm/elixir:1.14.0-erlang-25.0.4-debian-bullseye-20220801-slim"
```

This will go get the appropriate image for my use case but any image on Docker hub can be specified here. 