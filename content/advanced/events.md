---
title: Events
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 50
---

The preferred way to listen for user interaction events in a Reef template is _event delegation_.

Run the `addEventListener()` method on the element you're rendering your template into, and filter out events that occur on elements you don't care about.

```js
// The count
let count = signal(0);

// Increase the count by 1 when the [data-count] button is clicked
function increase (event) {
	if (!event.target.matches('[data-count]')) return;
	count.value++;
}

// The template
function template () {
	return `<button data-count>Clicked ${count.value} times</button>`;
}

// Render the component
let app = document.querySelector('#app');
component(app, template);

// Listen for events
app.addEventListener('click', increase);
```

**[Try event delegation on CodePen &rarr;](https://codepen.io/cferdinandi/pen/bGOyjvm)**

By default, `on*` events on elements are removed when rendering to reduce the risk of XSS attacks.

If you'd prefer to attach events directly to elements in your template using `on*` events, you must register them by passing an object of named event listener callback functions into your `component` as the `events` option.

Under-the-hood, Reef will remove any event handlers that aren't registered.

```js
// The count
let count = signal(0);

// Increase the count by 1
function increase () {
	count.value++;
}

// The template
function template () {
	return `<button onclick="increase()">Clicked ${count.value} times</button>`;
}

// Render the component
component('#app', template, {events: {increase}});
```

**[Try event binding on CodePen &rarr;](https://codepen.io/cferdinandi/pen/mdaYjwB?editors=1111)**
