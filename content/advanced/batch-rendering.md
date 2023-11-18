---
title: Batch Rendering
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 30
---

With a `component()`, multiple reactive data updates are often batched into a single render that happens asynchronously.

```js
// Reactive store
let todos = store(['Swim', 'Climb', 'Jump', 'Play']);

// Create a component from a template
component('#app', template);

// These three updates would result in a single render
todos.push('Sleep');
todos.push('Wake up');
todos.push('Repeat');
```

You can detect when a UI update happens inside a component by listening for [the `reef:render` event](/api#lifecycle-events).

It's emitted directly on the element that was rendered, and also bubbles if you want to listen for all render events.

```js
// Log whenever an element is rendered into
document.addEventListener('reef:render', function (event) {
	console.log('The UI was just updated inside this element.');
	console.log(event.target);
});
```

**[Try batch rendering on CodePen &rarr;](https://codepen.io/cferdinandi/pen/wvRbxyE?editors=1011)**
