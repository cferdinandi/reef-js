---
title: "Getting Started"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

## 1. Include Reef on your site

Reef works without any build step.

[The CDN is the fastest and simplest way to get started](https://cdn.jsdelivr.net/npm/reefjs/dist/), but you can use importable modules or a direct download if you'd prefer.

```html
<!-- Get the latest major version -->
<script src="https://cdn.jsdelivr.net/npm/reefjs@11/dist/reef.min.js"></script>
```

Reef uses semantic versioning. You can grab a major, minor, or patch version from the CDN with the `@1.2.3` syntax. You can find all available versions [under releases](https://github.com/cferdinandi/reef/releases).

<details>
<summary class="margin-bottom-small"><strong>More ways to install Reef</strong></summary>
{{%md%}}
**ES Modules**

Reef also supports modern browsers and module bundlers (like Rollup, Webpack, Snowpack, and so on) using the ES modules `import` syntax. Use the `.es` version.

```js
import Reef from 'https://cdn.jsdelivr.net/npm/reefjs@11/dist/reef.es.min.js';
```

**NPM**

You can also use NPM (or your favorite package manager). First, install with NPM.

```bash
npm install reefjs --save
```

Then import the package.

```js
import Reef from 'reefjs';
```

**CommonJS**

If you use NodeJS, you can import Reef using the `require()` method with the `.cjs` version.

```js
let Reef = require('https://cdn.jsdelivr.net/npm/reefjs@11/dist/reef.cjs.min.js');
```

**AMD**

If you use RequireJS, SystemJS, and other AMD formats, you can import Reef with the `.amd` version.

```js
requirejs(['https://cdn.jsdelivr.net/npm/reefjs@11/dist/reef.amd.min.js'], function (Reef) {
  //...
});
```

**Direct Download**

You can [download the files directly from GitHub](https://github.com/cferdinandi/reef/archive/master.zip).

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code.

```html
<script src="path/to/reef.min.js"></script>
```
{{%/md%}}
</details>



## 2. Add an element to render your component/UI into

This is typically an empty `div` with a targetable selector.

```html
<div id="app"></div>
```

## 3. Create your component

Create a new `Reef()` instance, passing in two arguments: your selector, and your options.

### Provide a selector

The first argument is the selector for the element you want to render the UI into. Alternatively, you can pass in the element itself.

```js
// This works
let app = new Reef('#app');

// This does too
let elem = document.querySelector('#app');
let app = new Reef(elem);
```

### Provide a Template

The second argument is an object of `options`. It requires a `template` property, a function that returns an HTML string to render into the DOM.

```js
let app = new Reef('#app', {
	template: function () {
		return '<h1>Hello, world!</h1>';
	}
});
```

### [Optional] Add State/Data

As an optional property of the `options` argument, you can include state for your component with the `data` property.

An immutable copy of the data object is automatically passed into your template function, so that you can use it to customize your template.

```js
// Some data
let app = new Reef('#app', {
	data: {
		greeting: 'Hello',
		name: 'world'
	},
	template: function (props) {
		return `<h1>${props.greeting}, ${props.name}!</h1>`;
	}
});
```

_Template literals give you a simple, JSX-like templating experience._

## 4. Render your component

Render your component by calling the `render()` method on it.

```js
app.render();
```

**[Try the demo on CodePen &rarr;](https://codepen.io/cferdinandi/pen/ExwmeWZ)**

{{<mailchimp intro="true">}}