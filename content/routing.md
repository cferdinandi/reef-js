---
title: "Routing"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef includes an optional router you can use to handle URL/route management with your single-page apps (SPA's).

<div id="table-of-contents"></div>

## Features

- Automatically renders your Reef components whenever the route changes.
- Works with any link element. Unlike bigger frameworks, you don't need custom routing components.
- Baked-in accessibility. Reef's router automatically handles focus management and title updates.
- Supports real URL paths, with an optional hashbang pattern (`#!`) fallback.
- Weighs just 1.9kb minified and gzipped.



## Installation

Reef Router is just as easy to install as Reef itself. Reef must also be installed as a dependency.

**_Reef Router requires Reef v7.1.0 or higher._**

**CDN**

```html
<script src="https://cdn.jsdelivr.net/npm/reefjs/dist/reef.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reefjs/dist/router.min.js"></script>
```

**ES Modules**

```js
import Reef from 'https://cdn.jsdelivr.net/npm/reefjs/dist/reef.es.min.js';
import 'https://cdn.jsdelivr.net/npm/reefjs/dist/router.es.min.js';
```

<details>
<summary class="margin-bottom-small"><strong>More ways to install Reef</strong></summary>
{{%md%}}
**Direct Download**

```html
<script src="path/to/reef.min.js"></script>
<script src="path/to/router.min.js"></script>
```

**NPM**

```js
import Reef from 'reefjs';
import 'reefjs/router';
```

**CommonJS**

```js
var Reef = require('https://cdn.jsdelivr.net/npm/reefjs/dist/reef.cjs.min.js');
var Router = require('https://cdn.jsdelivr.net/npm/reefjs/dist/router.cjs.min.js');
```

**AMD**

```js
requirejs(['https://cdn.jsdelivr.net/npm/reefjs/dist/reef.amd.min.js', 'https://cdn.jsdelivr.net/npm/reefjs/dist/router.amd.min.js'], function (Reef) {
  //...
});
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

Create a `new Reef.Router()` to define your routes.

Every route requires a `title` and `url`. You can add any additional properties that you want (for example, an `id` for the route). You can use `*` as a `url` to catch any unmatched URLs.

```js
var router = new Reef.Router({
	routes: [
		{
			id: 'home',
			title: 'Home',
			url: '/'
		},
		{
			id: 'about',
			title: 'About',
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

For any Reef component that should be updated when the route changes, add a `router` property and associate your router component with it.

Details about the current route are automatically passed into the `template` function as a second argument. By default, for unmatched routes the `route` argument will have a value of `null`.

```js
var app = new Reef('#app', {
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



## Accessibility

Any time the route changes, any associated components automatically re-render.

The `document.title` is also updated, and focus is shifted to the primary heading on the page (or an anchor element if scrolling to an anchored location).

### Focus rings on headings

Headings and anchor locations will appear with a focus ring around them, which you may find visually unappealing.

Elements that don't normally receive focus are given a `tabindex` if `-1` to make them focusable with JS. You can remove the focus ring by styling `[tabindex="-1"]`.

```css
[tabindex="-1"] {
	outline: 0;
}
```

_**Note:** you should NOT remove focus styles from elements that are normally focusable._



## Advanced Routing

### Getting parameters from routes

You can include variable parameters in your URLs, either in the path itself or as query or search parameters.

Reef Router will add them to the `route` object that gets passed into your `template()`. Path parameters are included under the `params` property, and query or search parameters are included under the `search` property.

```html
<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/account/tom?photo=true">My Account</a></li>
</ul>
```

```js
var router = new Reef.Router({
	routes: [
		{
			id: 'home',
			title: 'Home',
			url: '/'
		},
		{
			id: 'user-account',
			title: 'User Account',
			url: '/account/:user'
		}
	]
});

// In this example:
// route.params.user will be "tom"
// route.search.photo will be "true"
var app = new Reef('#app', {
	router: router,
	data: {
		greeting: 'hello!'
	},
	template: function (props, route) {
		return `
			<h1>${route.title}</h1>
			<p>${props.greeting} ${route.params.user}</p>
			${route.params.photo ? `<p>
				<img alt="A photo of ${route.params.user}" src="/img/${route.params.user}.jpg">
			</p>` : ''}`;
	}
});
```

### Nested routes

Reef Router supports nested routes out-of-the-box.

The order does not matter. Reef Router will check deeper routes for matches first.

```js
var router = new Reef.Router({
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
var router = new Reef.Router({
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

The function automatically receive the existing `route` object, with URL and search parameters, as an argument.

```js
var router = new Reef.Router({
	routes: [
		{
			id: 'user-account',
			title: 'User Account',
			url: '/account/:user'
		},
		{
			url: '/my-account/:user',
			redirect: function (route) {
				return `/account/${route.params.user}/`
			}
		},
	]
});
```



## Options & Settings

In addition to your routes, Reef Router accepts a few options you can use to customize how the router behaves.

```js
var router = new Reef.Router({
	root: '', // The root URL for your app, if using a subdirectory
	title: '{{title}}', // The pattern to use for the page title. {{title}} will be replaced with the actual title
	useHash: false // If true, uses a hashbang (#!) pattern instead of true URL paths
});
```

The `title` property can be a string *or* a function that returns a string.

The `useHash` property is automatically set to `true` in browsers that don't support the `history.pushState()` method, and local `file:` pages.

### Examples

The app lives at `my-site.com/my-app/`.

```js
var router = new Reef.Router({
	root: '/my-app'
});
```

The `document.title` will always have ` | My App` after it.

```js
var router = new Reef.Router({
	title: '{{title}} | My App'
});
```

The `document.title` will always have ` | My App` after it *except* on the homepage, where it's just `My App`.

```js
var router = new Reef.Router({
	title: function (route) {
		if (route && route.id === 'home') {
			return 'My App';
		}
		return '{{title}} | My App';
	}
});
```

Always use the hashbang pattern.

```js
var router = new Reef.Router({
	useHash: true
});
```



## API

Reef.Router exposes a few public methods you can use in your scripts.

### `addRoutes()`

Add routes to an existing route. Accepts an array of routes, or an individual route object.

```js
// Add an individual route
router.addRoutes({
	id: 'sale',
	title: 'Holiday Sale!',
	url: '/sale'
});

// Add multiple routes
router.addRoutes([
	{
		id: 'about',
		title: 'About',
		url: '/about'
	},
	{
		id: 'contact',
		title: 'Contact Us',
		url: '/contact'
	}
]);
```

### `navigate()`

Programmatically navigate to a URL. Pass in the URL as an argument.

```js
// Go to the /about page
router.navigate('/about');
```

### `addComponent()`

Associate a component with the router for automatic rendering.

```js
// Add the app component
router.addComponent(app);
```



## Routing Events

Reef Router emits two custom events on the `window` whenever a route change happens.

- **`beforeRouteUpdated`** fires before the route is changed. It includes the `current` and `next` routes as properties under `event.detail`
- **`routeUpdated`** fires after the route has been changed. It includes the `current` and `previous` routes as properties under `event.detail`.

```js
// Run a callback before the route changes
// Useful for tearing down scripts that won't be needed on the next view
window.addEventListener('beforeRouteUpdated', function (event) {

	// The route that's about to the change
	var current = event.detail.current;

	// The new route
	var next = event.detail.next;

});

// Run a callback after the route changes
// Useful for loading or re-initializing scripts
window.addEventListener('routeUpdated', function (event) {

	// The new route
	var current = event.detail.current;

	// The previous route
	var previous = event.detail.previous;

});
```



## Kudos

Reef Router's URL path matching and parameter extraction is adapted from [Navigo by Krasimir Tsonev](https://github.com/krasimir/navigo).

Click handling is adapted from [pages.js by Vision Media](https://github.com/visionmedia/page.js).