---
title: Web Components
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 90
---

Reef pairs very nicely with native Web Components.

{{<toc>}}


## Reactive Web Components

You can use Reef's `signal()` and `component()` methods to reactively update the content inside a Web Component.

Whenever the `signal` object's data is updated, the Web Component content will automatically get updated.

```html
<todo-list></todo-list>
```

```js
// Create a reactive signal
let data = signal({
	heading: 'My Todos',
	todos: ['Swim', 'Climb', 'Jump', 'Play'],
	emoji: '👋🎉'
});

// Create a native Web Component
customElements.define('todo-list', class extends HTMLElement {

	// Use Reef to reactively render UI into the Web Component
	constructor () {
		super();
		component(this, this.template);
	}

	// Define the template
	template () {
		let {heading, todos, emoji} = data;
		return `
			<h1>${heading} ${emoji}</h1>
			<ul>
				${todos.map(function (todo) {
					return `<li key="${todo}">${todo}</li>`;
				}).join('')}
			</ul>`;
	}

});
```


## Scoping data

Web Components make it easy to scope data to the component.

You can use the `signal()` method to attach reactive data to the component instead of a global object.

```html
<count-up></count-up>
```

```js
customElements.define('count-up', class extends HTMLElement {

	// Instantiate the component
	constructor () {
		super();
		this.count = signal(0);
		this.events = {countUp: () => this.count.value++};
		component(this, this.template, {events: this.events});
	}

	// The UI template
	template = () => {
		return `<button onclick="countUp()">Clicked ${this.count.value} times</button>`;
	}

});
```

To reduce the amount of diffing that occurs with multiple components, you can use the `crypto.randomUUID()` method to create a unique ID and `signal` namespace for each component.

```js
customElements.define('count-up', class extends HTMLElement {

	// Instantiate the component
	constructor () {
		super();
		this.uuid = crypto.randomUUID();
		this.count = signal(0, this.uuid);
		this.events = {countUp: () => this.count.value++};
		component(this, this.template, {
			events: this.events,
			signals: [this.uuid]
		});
	}

	// The UI template
	template = () => {
		return `<button onclick="countUp()">Clicked ${this.count.value} times</button>`;
	}

});
```


## In Templates

You can include native web components inside the HTML template strings that get rendered by Reef.

Because web components control their own internal content, Reef _will_ modify element attributes, but will _not_ diff content within them.

```js
// Create a reactive store
let data = store({
	heading: 'My Counter',
	emoji: '👋🎉'
});

// Create a template
function template () {
	let {heading, emoji} = data;
	return `
		<h1>${heading} ${emoji}</h1>
		<count-up></count-up>`;
}

// Reef will NOT diff the content of the count-up element
data.heading = 'Count it';
```

This also means you can safely nest Web Components inside other Web Components.