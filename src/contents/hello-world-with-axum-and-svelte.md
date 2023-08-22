---
title: Hello world with Axum and Svelte
author: Brendon Otto
datetime: 2023-08-21T10:18:34Z
slug: hello-world-with-axum-and-svelte
featured: true
draft: false
tags:
  - Rust
  - Axum
  - Svelte
description: "I've been wanting to play around with Rust/Axum with a front end, particularly Svelte(Kit)."
---

I've been wanting to play around with Rust/Axum with a front end, particularly [Svelte(Kit)](https://kit.svelte.dev/). I realize both Rust and Svelte have full frameworks for building full stack applications but I don't love running JavaScript on the server (with SvelteKit). I am super excited about [Leptos](https://leptos.dev/) but didn't want to jump down the path of a bunch of extra tooling. That being said I may write a post down the road that builds this application in Leptos just to compare both sides of the story.

I've wanted to have a way to collect quotes I like from newsletters, blogs, books, any source really :). I'd love an API so I could add it to this site, possibly down in the footer. I am a subscriber to [Readwise](https://readwise.io/i/brendon8) (affiliate link) which allows me to do this also (and probably get from their API) but wanted something different than _any_ arbitrary highlight. That way it's a better stand alone quote instead of a random highlight. Plus with thinking about this stack it's a simple problem to solve while testing various ways of building webapps in Rust :).

### Project structure

I started by creating a new directory `quotes` in my local dev folder. From there I also created
`client` and `server` directories within `quotes`. To generate the Rust back end I `cd` into `server` and ran `cargo init` which initializes an existing directory instead of generating a new structure as `cargo new` would have done. I then moved into the `client` directory and ran `npm create svelte@latest` which I realized about halfway through creates a _SvelteKit_ project instead of a Svelte one. Once I realized this I thought about cleaning it and starting over but realized I'd have to pick a router and make some other choices down the road so I went with it. 🤷

I prefer working on the back end so I started building that out first. Switch back to `quotes/server` to start with Axum setup.

Add Rust dependencies:

```bash
cargo add tokio -F full
cargo add axum
```

Replace what's in `main.rs` with: 

```rust
use std::net::SocketAddr;
use axum::{response::Html, routing::get, Router};

#[tokio::main]
async fn main() {
	let app = Router::new().route("/", get(handler));

	let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
	println!("--> Listening on {addr}");

	axum::Server::bind(&addr)
		.serve(app.into_make_service())
		.await
		.unwrap();
}

async fn handler() -> Html<&'static str> {
	Html("<h1>Hello, world!</h1>")
}
```

Now when running `cargo run` from `quotes/server` directory you should get the following at `http://localhost:8080`:
![Axum application in the browser that says Hello from Axum](/assets/images/hello-axum.png)

But we don't want Rust to serve or handle HTML. We really want Svelte to handle the client side. Axum should serve the initial page and anything Svelte needs and be the back end layer for data for Svelte. Let's get Svelte running and then have Axum serve the Svelte app.

Opening up the `client` directory and running `npm install` to get all the dependencies, I'll go change the default `+page.svelte` file to say `<h1>Hello from Svelte!</h1>`
![Vite application in the browser that says Hello from Svelte](/assets/images/hello-vite.png)

From here we need to wire up writing the output from Vite (the bundler Svelte uses by default) to output to a directory where Axum can serve it.

First we need to ask SvelteKit to generate a static build for us. In order to do so we'll need to add the static adapter from SvelteKit:

```bash
npm i -D @sveltejs/adapter-static
```

Once added, we'll need to update `svelte.config.js` and remove `adapter-auto` in favor of `adapter-static`: 

```js
import adapter from '@sveltejs/adapter-static';
```

Then add this config object to the adapter init call:

```js
adapter: adapter({
	pages: 'build',
	assets: 'build',
	fallback: undefined,
	precompress: false,
	strict: true
})
```

With the adapter defined we'll now need the route to generate statically. Add a `+layout.js` file to the root of `src/routes` with the contents of `export const prerender = true;` to tell SvelteKit/Vite that this should render every page in this route statically.

Now when running `npm run build` Vite will dump the app to `client/build` directory for Axum to route to.

Axum, time to serve a Svelte app! In order to have Axum serve the `build` directory we'll need to add two more dependencies (switching gears back to the Rust app):

```rust
cargo add tower -F util
cargo add tower-http -F fs
```

Tower HTTP is what we'll use to serve a directory and it depends on Tower. We'll now need to ask Tower HTTP's `ServeDir` service to please serve the `client/build` directory. Add a use for Tower's `ServerDir`:

```rust
use tower_http::services::ServeDir;
```

Then we'll add a function that returns a router for Axum:

```rust
fn static_frontend() -> Router {
	// Give ServeDir the location to be served
	let static_frontend_dir = ServeDir::new("../client/build");

	// Generate the router to use the root path
	Router::new().nest_service("/", static_frontend_dir)
}
```
Full `main.rs` file up to this point:

```rust
use axum::Router;
use std::net::SocketAddr;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
	let app = static_frontend();
	
	let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
	println!("--> Listening on {addr}");
	
	axum::Server::bind(&addr)
	.serve(app.into_make_service())
	.await
	.unwrap();
}

fn static_frontend() -> Router {
	let static_frontend_dir = ServeDir::new("../client/build");
	Router::new().nest_service("/", static_frontend_dir)
}
```

That cleans up the `main.r` file and now when running `cargo run` you should see `Hello from Svelte!` on port 8080 instead of 5173 which is what Vite uses by default! We have Axum serving out a Svelte app! That's awesome! 🙌

![](/assets/images/hello-svelte-from-axum.png)

BUT, we lost our nice developer experience in our front end. When you run `npm run dev` and make a change, nothing happens to the markup that Axum serves because it's only coming from the `build` directory. That's a bummer! We'll see what we can do about that in the next post. 