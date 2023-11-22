---
title: component()
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 30
anchors: true
---

The `component()` method creates a reactive component.

{{<toc>}}


## Overview

Pass in the element (or selector string for the element) to render into, and a template function that returns an HTML string to render.

The `component()` method will render it into the UI, and automatically update the UI whenever a `reef:signal` event is emitted.

```js
let {signal, component} = reef;

// Create a signal
let todos = signal(['Swim', 'Climb', 'Jump', 'Play']);

// Create a template
function template () {
	return `
		<ul>
			${todos.map(function (todo) {
				return `<li>${todo}</li>`;
			}).join('')}
		</ul>`;
}

// Create a reactive component
// It automatically renders into the UI
component('#app', template);

// Automatically render a new list item in the UI
todos.push('Take a nap... zzzz');
```

**[Try creating a component on CodePen &rarr;](https://codepen.io/cferdinandi/pen/NWeVBvL)**


## Options

The `component()` method also accepts an object of `options` as a third argument.

- **`events`** - an object of allowed event callback functions.
- **`signals`** - an array of signal namespaces to use [for `signal` events](/api/signal).

```js
// Allow registered on* events
component('#app', template, {events: {reverseWizards}});

// Use a custom event name
let wizards = signal([], 'wizards');
component('#app', template, {signals: ['wizards']});

// Use a custom name AND allow register on* events
component('#app', template, {
	signals: ['wizards'], 
	events: {reverseWizards}
});
```

**[Try component options on CodePen &rarr;](https://codepen.io/cferdinandi/pen/MWZdBvd)**


## Methods

If you assign your component to a variable, you can stop reactive rendering with the `component.stop()` method, and start it again with the `component.start()` method.

The `component.render()` method manually renders a component in the UI.

```js
// Create a component
let app = component('#app', template);

// Stop reactive rendering
app.stop();

// Restart reactive rendering
app.start();

// Manually render a component
app.render();
```

**[Try component methods on CodePen &rarr;](https://codepen.io/cferdinandi/pen/QWzRBqz?editors=1011)**
