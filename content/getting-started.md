---
title: Getting Started
date: 2018-01-24T11:48:20-05:00
draft: false
anchors: true
---

Let's look at how to get started with Reef.

<div id="table-of-contents"></div>


## Install

Reef works without any build step.

[The CDN is the fastest and simplest way to get started](https://cdn.jsdelivr.net/npm/reefjs/dist/), but you can use importable modules or a direct download if you'd prefer.

```html
<!-- Get the latest major version -->
<script src="https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>
```

With the global script, you can call the API methods on the `reef` object, or destructure them into their own variables.

```js
// You do this...
reef.store();

// or this...
let {store} = reef;
```

Reef uses semantic versioning. You can grab a major, minor, or patch version from the CDN with the `@1.2.3` syntax. You can find all available versions [under releases](https://github.com/cferdinandi/reef/releases).

<details>
<summary class="margin-bottom-small"><strong>More ways to install Reef</strong></summary>
{{%md%}}
**ES Modules**

Reef also supports modern browsers and module bundlers (like Rollup, Webpack, Snowpack, and so on) using the ES modules `import` syntax. Use the `.es` version.

```js
import {store, component} from 'https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.es.min.js';
```

**NPM**

You can also use NPM (or your favorite package manager). First, install with NPM.

```bash
npm install reefjs --save
```

Then import the package.

```js
import {store, component} from 'reefjs';
```

**CommonJS**

If you use NodeJS, you can import Reef using the `require()` method with the `.cjs` version.

```js
let {store, component} = require('https://cdn.jsdelivr.net/npm/reefjs@13/dist/reef.cjs.min.js');
```

**Direct Download**

You can [download the files directly from GitHub](https://github.com/cferdinandi/reef/archive/master.zip).

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code.

```html
<script src="path/to/reef.min.js"></script>
```
{{%/md%}}
</details>



## Quick Start

Reef is a tiny utility library with three core functions: `signal()`, `render()`, and `component()`.

**Create reactive data with the `signal()` method.** Pass in an array or object, and Reef will emit a `reef:signal` event whenever a property is updated.

```js
let {signal} = reef;

// Create a signal
let data = signal({
	greeting: 'Hello',
	name: 'World'
});

// Emits a reef:signal event
data.greeting = 'Hi';
```

**Safely render UI from an HTML string with the `render()` method.** Pass in an element or element selector and your HTML string. Reef will sanitize your HTML, then diff the DOM and update only the things that are different.

```js
let {render} = reef;

let name = 'world';
render('#app', `<h1>Hello, ${name}!</h1>`);
```

**Automatically update your UI when data changes with the `component()` method.** Pass in an element or element selector and a template function. Reef will listen for `reef:signal` events and and automatically run the `render()` function.

```js
let {signal, component} = reef;

// Create a signal
let data = signal({
	greeting: 'Hello',
	name: 'World'
});

// Create a template function
function template () {
	let {greeting, name} = data;
	return `<p>${greeting}, ${name}!</p>`;
}

// Create a component
// Renders into the UI, and updates whenever the data changes
component('#app', template);

// The UI will automatically update
data.greeting = 'Hi';
data.name = 'Universe';
```

**[Try this demo on CodePen &rarr;](https://codepen.io/cferdinandi/pen/rNogrjX?editors=1010)**
