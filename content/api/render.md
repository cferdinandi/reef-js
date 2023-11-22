---
title: render()
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 20
anchors: true
---

The `render()` method renders an HTML template string into the UI.

{{<toc>}}


## Overview

Pass in the element (or selector string for the element) to render into, and an HTML string to render. Unlike the `Element.innerHTML` property, this... 

1. Sanitizes your HTML to reduce the risk of XSS attacks. 
2. Diffs the DOM, only updating the things that have changed.

```js
let {render} = reef;

// Create a template
function template () {
	return '<p>Hello, world!</p>';
}

// Render it into the #app element
render('#app', template());
```

**[Try rendering HTML on CodePen &rarr;](https://codepen.io/cferdinandi/pen/BavePRx)**


## Event listeners

To reduce the risk of XSS attacks, dangerous properties (including `on*` events) are removed from the HTML before rendering. 

```js
// The onerror event is removed before rendering
render('#app', '<p><img src="x" onerror="alert(1)"></p>');
```

**[Try HTML sanitization on CodePen &rarr;](https://codepen.io/cferdinandi/pen/abPrjwv)**

If you want to allow `on*` event listeners, pass an object of named `events` listener functions into `render()` function as the third argument. 

Any `on*` events that are _not_ passed into your `render()` function are removed to reduce the risk of XSS attacks.

```js
// Track clicks
let count = 0;

// Log clicks
function log () {
	count++;
	console.log(`Clicked ${count} times.`);
}

// Warn clicks
// Won't run because it's not registered
function warn () {
	count++;
	console.warn(`Clicked ${count} times.`);
}

// Render a button with an onclick event
render('#app', `<button onclick="log()">Activate Me</button> <button onclick="warn()">This won't work</button>`, {log});
```

**[Try event listener binding on CodePen &rarr;](https://codepen.io/cferdinandi/pen/mdaYjwB?editors=1111)**

<div class="callout">
	👋 <strong>Heads up!</strong> This is only needed if you're using <code>on*</code> events directly on your elements. If you're using event delegation, you can skip it.
</div>
