---
title: "Reef Router"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef Router is an optional router that you can use to handle URL/route management with your single-page apps (SPA's).

- Automatically renders your Reef components whenever the route changes.
- Works with any link element. Unlike bigger frameworks, you don't need custom routing components.
- Baked-in accessibility. Reef's router automatically handles focus management and title updates.
- Supports real URL paths, with an optional hashbang pattern (`#!`) fallback.
- Compatible with nested routing structures.
- Weighs just 2.7kb minified and gzipped.

<div id="table-of-contents"></div>



## Installation

Reef Router is just as easy to install as Reef itself. Reef must also be installed as a dependency.

[The CDN is the fastest and simplest way to get started](https://cdn.jsdelivr.net/npm/reefjs/dist/), but you can use importable modules or a direct download if you'd prefer.

```html
<script src="https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reefjs@8/dist/router.min.js"></script>
```

<details>
<summary class="margin-bottom-small"><strong>More ways to install Reef Router</strong></summary>
{{%md%}}
When used with a module system, you must explicitly associate Reef with the router with the `Reef.use()` method.

**ES Modules**

```js
import Reef from 'https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.es.min.js';
import ReefRouter from 'https://cdn.jsdelivr.net/npm/reefjs@8/dist/router.es.min.js';

Reef.use(ReefRouter);
```

**NPM**

```js
import Reef from 'reefjs';
import ReefRouter from 'reefjs/router';

Reef.use(ReefRouter);
```

**CommonJS**

```js
let Reef = require('https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.cjs.min.js');
let ReefRouter = require('https://cdn.jsdelivr.net/npm/reefjs@8/dist/router.cjs.min.js');

Reef.use(ReefRouter);
```

**AMD**

```js
requirejs([
	'https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.amd.min.js',
	'https://cdn.jsdelivr.net/npm/reefjs@8/dist/router.amd.min.js'
],function (Reef, ReefRouter) {
	Reef.use(ReefRouter);
});
```

**Direct Download**

```html
<script src="path/to/reef.min.js"></script>
<script src="path/to/router.min.js"></script>
```
{{%/md%}}
</details>



## Getting Started

**Step 1: Create your links**

No custom components required. Any link element with an `href` will work.

```html
<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/about">About</a></li>
	<li><a href="/contact">Contact</a></li>
</ul>
```

**Step 2: Define your routes**

Create a `new ReefRouter()` instance to define your routes.

Every route requires a `title` and `url`. The `title` can be a string, or a function that returns a string and accepts the `route` object as an argument. You can add any additional properties that you want (for example, an `id` for the route).

Optionally, you can use `*` as a `url` to catch any unmatched URLs.

```js
let router = new ReefRouter({
	routes: [
		{
			id: 'home',
			title: 'Home',
			url: '/'
		},
		{
			id: 'about',
			title: function (route) {
				return 'About';
			},
			url: '/about'
		},
		{
			id: 'contact',
			title: 'Contact Us',
			url: '/contact'
		}
	]
});
```

**Step 3: Associate your router with one or more components**

For any Reef component that should be updated when the route changes, add a `router` property and use your router component as the value.

Details about the current route are automatically passed into the `template` function as a second argument. If you don't provide a catchall (`url: '*'`) route, an unmatched `route` will have a value of `null`.

```js
let app = new Reef('#app', {
	router: router,
	data: {
		greeting: 'hello!'
	},
	template: function (props, route) {
		return `
			<h1>${route.title}</h1>
			<p>${props.greeting}</p>`;
	}
});
```

_**Note:** when using a router, the element that [the template was rendered into](/advanced/#getting-the-element-the-template-is-being-rendered-into) becomes the third argument on the `template()` function._



## Accessibility

Any time the route changes, any associated components automatically re-render.

The `document.title` is also updated, and focus is shifted to the primary heading on the page (or an anchor element if scrolling to an anchored location).

### Focus rings on headings

Headings and anchor locations will appear with a focus ring around them, which you may find visually unappealing.

Elements that don't normally receive focus are given a `tabindex` of `-1` to make them focusable with JS. You can remove the focus ring by styling `[tabindex="-1"]`.

```css
[tabindex="-1"] {
	outline: 0;
}
```

_**Note:** you should NOT remove focus styles from elements that are natively focusable._



## Server Configuration

Single page apps works great when you visit the homepage first. But when someone visits one of your routes directly or hits reload, they get a 404 page.

To fix that, you need to configure your server to point all pages to your `index.html` file. Paul Sherman has a great deep-dive on how that all works titled [Single-Page Applications and the Server](https://blog.pshrmn.com/single-page-applications-and-the-server/).

Here's an `.htaccess` file example for apache servers.

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . index.html [L]
</IfModule>
```

And here's what it might look like in express (taken from [the Reach Router docs](https://reach.tech/router/server-config)).

```js
const path = require('path');
const express = require('express');
const app = new express()

// requests for static files in the "public" directory
// like JavaScript, CSS, images will be served
app.use(express.static('public'));

// Every other request will send the index.html file that
// contains your application
app.use('*', function(req, resp) {
	resp.sendFile('/public/index.html');
});

app.listen('8000');
```



## Advanced Routing

### Getting parameters from routes

You can include variable parameters in your URLs, either in the path itself or as query or search parameters.

Reef Router will add them to the `route` object that gets passed into your `template()`. Path parameters are included under the `params` property, and query/search parameters are included under the `search` property.

```html
<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/account/tom?photo=true">My Account</a></li>
</ul>
```

```js
let router = new ReefRouter({
	routes: [
		{
			id: 'home',
			title: 'Home',
			url: '/'
		},
		{
			id: 'user-account',
			title: function (route) {
				return `User Account: ${route.params.user}`;
			},
			url: '/account/:user'
		}
	]
});

// In this example:
// route.params.user will be "tom"
// route.search.photo will be "true"
let app = new Reef('#app', {
	router: router,
	data: {
		greeting: 'hello!'
	},
	template: function (props, route) {
		return `
			<h1>${route.title}</h1>
			<p>${props.greeting} ${route.params.user}</p>
			${route.search.photo ? `<p>
				<img alt="A photo of ${route.params.user}" src="/img/${route.params.user}.jpg">
			</p>` : ''}`;
	}
});
```

### Nested routes

Reef Router supports nested routes out-of-the-box.

The order does not matter. Reef Router will check deeper routes for matches first.

```js
let router = new ReefRouter({
	routes: [
		{
			id: 'home',
			title: 'Home',
			url: '/'
		},
		{
			id: 'account',
			title: 'Account',
			url: '/account/'
		},
		{
			id: 'user-account',
			title: 'User Account',
			url: '/account/:user'
		},
		{
			id: 'user-password',
			title: 'Change Password',
			url: '/account/:user/password'
		}
	]
});
```

### Redirects

As your app grows, routes may change. You can setup redirects from one route to another.

When creating the route, create the `url` property as normal, and add a `redirect` property with the route that the URL should point to.

```js
let router = new ReefRouter({
	routes: [
		{
			id: 'contact',
			title: 'Contact',
			url: '/contact/'
		},
		{
			url: '/contact-us/',
			redirect: '/contact/'
		}
	]
});
```

The `redirect` property can also be a function that returns a string.

The function automatically receives the existing `route` object, with URL and search parameters, as an argument.

```js
let router = new ReefRouter({
	routes: [
		{
			id: 'user-account',
			title: 'User Account',
			url: '/account/:user'
		},
		{
			url: '/my-account/:user',
			redirect: function (route) {
				return `/account/${route.params.user}/`;
			}
		},
	]
});
```



## Options & Settings

In addition to your routes, Reef Router accepts a few options you can use to customize how the router behaves.

```js
let router = new ReefRouter({
	root: '', // The root URL for your app, if using a subdirectory
	// The pattern to use for the document.title
	// Receives the current route and route.title as arguments
	title: function (route, title) {
		if (route.url === '/') return 'My Awesome App';
		return `${title} | My Awesome App`;
	},
	useHash: false // If true, uses a hashbang (#!) pattern instead of true URL paths
});
```

The `title` property can be a string *or* a function that returns a string. As a function, it receives the current `route` and the `route.title` as arguments.

The `useHash` property is automatically set to `true` for local `file:` pages.

### Examples

The app lives at `my-site.com/my-app/`.

```js
let router = new ReefRouter({
	root: '/my-app'
});
```

The `document.title` will always be the `router.title`.

```js
let router = new ReefRouter({
	title: function (route, title) {
		return title;
	}
});
```

The `document.title` will always have ` | My Awesome App` after it, except on the homepage, where it's just `My Awesome App`.

```js
let router = new ReefRouter({
	title: function (route, title) {
		if (route.url === '/') return 'My Awesome App';
		return `${title} | My Awesome App`;
	},
});
```

Always use the hashbang pattern.

```js
let router = new ReefRouter({
	useHash: true
});
```


_**Kudos!** Reef Router's URL path matching and parameter extraction is adapted from [Navigo by Krasimir Tsonev](https://github.com/krasimir/navigo). Click handling is adapted from [pages.js by Vision Media](https://github.com/visionmedia/page.js)._