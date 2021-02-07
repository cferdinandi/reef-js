---
title: "Snorkel"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Snorkel merges the speed of SPAs with the simplicity of multi-page apps.

**How it works.** You create separate HTML files for your app, and add links to them just like you normally would. Snorkel detects clicks on those links, fetches the HTML with ajax, and updates the UI _without_ causing a page reload.

- Automatically renders your Reef components whenever the view changes.
- No need to specify routes. Just build your multi-page app like you normally would.
- Baked-in accessibility. Scroll position is reset on each view change, and Snorkel's UI updates are automatically announced by screen readers.
- Weighs just 2.3kb minified and gzipped.

<div id="table-of-contents"></div>



## Installation

Snorkel is just as easy to install as Reef itself. Reef must also be installed as a dependency.

[The CDN is the fastest and simplest way to get started](https://cdn.jsdelivr.net/npm/reefjs/dist/), but you can use importable modules or a direct download if you'd prefer.

_Snorkel requires version `8.2.0` or higher of Reef._

```html
<script src="https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reefjs@8/dist/snorkel.min.js"></script>
```

<details>
<summary class="margin-bottom-small"><strong>More ways to install Snorkel</strong></summary>
{{%md%}}
When used with a module system, you must explicitly associate Reef with Snorkel with the `Reef.use()` method.

**ES Modules**

```js
import Reef from 'https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.es.min.js';
import ReefSnorkel from 'https://cdn.jsdelivr.net/npm/reefjs@8/dist/snorkel.es.min.js';

Reef.use(ReefSnorkel);
```

**NPM**

```js
import Reef from 'reefjs';
import ReefSnorkel from 'reefjs/snorkel';

Reef.use(ReefSnorkel);
```

**CommonJS**

```js
var Reef = require('https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.cjs.min.js');
var ReefSnorkel = require('https://cdn.jsdelivr.net/npm/reefjs@8/dist/snorkel.cjs.min.js');

Reef.use(ReefSnorkel);
```

**AMD**

```js
requirejs([
	'https://cdn.jsdelivr.net/npm/reefjs@8/dist/reef.amd.min.js',
	'https://cdn.jsdelivr.net/npm/reefjs@8/dist/snorkel.amd.min.js'
],function (Reef, ReefSnorkel) {
	Reef.use(ReefSnorkel);
});
```

**Direct Download**

```html
<script src="path/to/reef.min.js"></script>
<script src="path/to/snorkel.min.js"></script>
```
{{%/md%}}
</details>



## Getting Started

Once Snorkel is installed, activate it by creating a `new ReefSnorkel()` instance.

```js
let snorkel = new ReefSnorkel();
```

For any Reef component that should be updated when the route changes, add a `router` property and use the Snorkel instance as the value.

```js
var app = new Reef('#app', {
	router: snorkel,
	data: {
		greeting: 'hello!'
	},
	template: function (props) {
		return `
			<h1>Good morning</h1>
			<p>${props.greeting}</p>`;
	}
});
```



## What happens on a URL update?

Not much, actually.

- The entire `document.body` is replaced.
- The `<head>` element is diffed, and changes are selectively applied.
- The URL is updated using the `history.pushState()` method.
- Any associated Reef components are rendered.



## Advanced Features

### Ignoring Links

By default, Snorkel works on all links that point to pages on the same domain as your app automatically.

You can tell Snorkel to ignore certain links by adding the `[snorkel-ignore]` attribute to them or one of their parent elements.

```html
<!-- This link will be ignored -->
<a snorkel-ignore href="/about">About Us</a>

<!-- All of these links will be, too -->
<nav snorkel-ignore>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/about">About</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>
</nav>
```

You can activate Snorkel on a specific link while ignoring others by adding the `[snorkel]` attribute.

```html
<!-- All of these links will be ignored, except for /about -->
<nav snorkel-ignore>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a snorkel href="/about">About</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>
</nav>
```

You can also disable Snorkel globally by passing in an object of `options`, and setting `autoLinks` to `false`. Then, only links with the `[snorkel]` attribute on them will use Snorkel.

```js
let snorkel = new ReefSnorkel({
	autoLinks: false
});
```

### Replacing a view instead of creating a new one

By default, Snorkel creates a new entry in a browser's navigation history. Users can go back to the previous page with the browser's back button.

If you add the `[snorkel="replace"]` attribute to a link (or parent element of a link), the new page will replace the existing entry in the navigation history instead of creating a new one.

```html
<!-- This link will replace the current URL in browser history -->
<a snorkel="replace" href="/about">About Us</a>
```

### Caching views in history

To improve performance when navigating back through browser history, Snorkel caches the previous 50 pages for an hour.

These are _not_ used when a link is clicked, only when using a browser's forward/back buttons. On link clicks, fresh content is always fetched.

You can change how many pages are cached, and for how long, using the `cacheSize` and `cacheTime` properties on the `options` object. You can also disable caching entirely by seeing the `cache` property to `false`.

```js
// Change the default cache size and duration
let snorkel = new ReefSnorkel({
	cacheSize: 25, // Only cache the last 25 pages
	cacheTime: 60 * 30 // 30 minutes in seconds
});

// Disable caching entirely
let snorkel = new ReefSnorkel({
	cache: false
});
```



## Options & Settings

In addition to your routes, Reef Router accepts a few options you can use to customize how the router behaves.

```js
let snorkel = new ReefSnorkel({
	loading: 'reef-loading', // A class that's added to the HTML element while new content is loading
	root: '/', // The root domain for the app
});
```


_**Kudos!** Snorkel was inspired by [Hotwire from Basecamp](https://hotwire.dev/)._