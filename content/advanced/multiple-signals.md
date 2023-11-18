---
title: Multiple Signals
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 20
---

With Reef, you can create components that use data from multiple reactive signals.

```js
// Create multiple reactive signals
let data = signal({
	heading: 'My Todos',
	emoji: '👋🎉'
});
let todos = signal(['Swim', 'Climb', 'Jump', 'Play']);

// Create a template
function template () {
	let {heading, emoji} = data;
	return `
		<h1>${heading} ${emoji}</h1>
		<ul>
			${todos.map(function (todo) {
				return `<li id="${todo.toLowerCase().replaceAll(' ', '-')}">${todo}</li>`;
			}).join('')}
		</ul>`;
}

// Create a reactive component
component('#app', template);
```

If your signals use custom event names, pass them in as an array of signals names with the `options.signals` property.

```js
// Create multiple named signals
let data = signal({
	heading: 'My Todos',
	emoji: '👋🎉'
}, 'heading');
let todos = signal(['Swim', 'Climb', 'Jump', 'Play'], 'todos');

// ...

// Create a reactive component with multiple named signals
component('#app', template, {signals: ['heading', 'todos']});
```

**[Try components with multiple signals on CodePen &rarr;](https://codepen.io/cferdinandi/pen/oNJRMEZ?editors=0011)**
