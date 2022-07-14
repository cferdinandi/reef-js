---
title: "API Reference"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef includes just three utility methods and a handful of lifecycle events.

<div id="table-of-contents"></div>

## store()

Create a reactive data object. 

It accepts an object (`{}`) or array (`[]`) as an argument. If no value is provided, it uses an empty object by default.

```js
let {store} = reef;

let data = store({
	greeting: 'Hello',
	name: 'World'
});
```

This emits a `reef:store` event on the `document` whenever a property is modified. The `event.detail` property contains the current value of the data.

```js
// Listen for data changes
document.addEventListener('reef:store', function (event) {
	console.log('The data was updated!');
	console.log(event.detail);
});

// Update the data
data.greeting = 'Hi there';
```

**[Try data reactivity on CodePen &rarr;](https://codepen.io/cferdinandi/pen/zYWoPwy?editors=0011)**

You can customize the event name by passing in a second argument into the `store()` method. It gets added to the end of the `reef:store` event with a dash delimiter (`-`).

```js
let wizards = store([], 'wizards');

// A "reef:store-wizards" event gets emitted
wizards.push('Merlin');
```

**[Try custom event names on CodePen &rarr;](https://codepen.io/cferdinandi/pen/QWmGOgO?editors=0011)**



## render()

Render an HTML template string into the UI. 

Pass in the element (or element selector) to render into, and an HTML string to render.

Unlike the `Element.innerHTML` property, this sanitizes your HTML to reduce the risk of XSS attacks, and diffs the DOM, only updating the things that have changed.

```js
let {render} = reef;

// Create a template
function template () {
	return '<p>Hello, world!</p>';
}

// Render it into the #app element
render('#app', template());
```

**[Try rendering HTML on CodePen &rarr;](https://codepen.io/cferdinandi/pen/abYBVwx)**

To reduce the risk of XSS attacks, dangerous properties (including `on*` events) are removed from the HTML before rendering.

```js
// The onerror event is removed before rendering
render('#app', '<p><img src="x" onerror="alert(1)"></p>');
```

**[Try HTML sanitization on CodePen &rarr;](https://codepen.io/cferdinandi/pen/bGvBYrr)**

If you want to allow `on*` event listeners, pass in `true` as an optional third argument.

```js
// Track clicks
let n = 0;

// Log clicks
function log () {
	n++;
	console.log(`Clicked ${n} times.`);
}

// Render a button with an onclick event
render('#app', `<button onclick="log()">Activate Me</button>`, true);
```

**[Try event listener binding on CodePen &rarr;](https://codepen.io/cferdinandi/pen/JjLbOyQ?editors=1011)**

_**Note:** Do NOT do this if your template contains any third-party data. It can expose you to cross-site scripting (XSS) attacks._


## component()

Create a reactive component.

Pass in the element (or element selector) to render into, and a template function that returns an HTML string to render.

The `component()` method will render it into the UI, and automatically update the UI whenever your reactive data changes.

```js
let {store, component} = reef;

// Create a reactive store
let todos = store(['Swim', 'Climb', 'Jump', 'Play']);

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

// Automatically adds a new list item to the UI
todos.push('Take a nap... zzzz');
```

**[Try creating a component on CodePen &rarr;](https://codepen.io/cferdinandi/pen/rNdWYGQ)**

The `component()` method also accepts an object of `options` as a third argument.

- `events` - If `true`, will allow inline events on the template.
- `stores` - An array of custom event names to use for `store()` events.

```js
// Allow on* events
component('#app', template, {events: true});

// Use a custom event name
let wizards = store([], 'wizards');
component('#app', template, {stores: ['wizards']});

// Use a custom name AND allow on* events
component('#app', template, {stores: ['wizards'], events: true});
```

**[Try component options on CodePen &rarr;](https://codepen.io/cferdinandi/pen/JjLbOOg)**

If you assign your component to a variable, you can stop reactive rendering with the `component.stop()` method, and start it again with the `component.start()` method.

```js
// Create a component
let app = component('#app', template);

// Stop reactive rendering
app.stop();

// Restart reactive rendering
app.start();
```

**[Try component methods on CodePen &rarr;](https://codepen.io/cferdinandi/pen/wvmoPyq?editors=1011)**



## Lifecycle Events

Reef emits custom events throughout the lifecycle of a component or reactive store.

- **`reef:store`** is emitted when a reactive store is modified. The `event.detail` property contains the data object.
- **`reef:start`** is emitted on a component element when reef starts listening for reactive data changes.
- **`reef:stop`** is emitted on a component element when reef stops listening for reactive data changes.
- **`reef:render`** is emitted on a component element when reef renders a UI update.

You can listen for Reef events with the `Element.addEventListener()` method.

```js
// Log whenever an element is rendered into
document.addEventListener('reef:render', function (event) {
	console.log('The UI was just updated inside this element.');
	console.log(event.target);
});
```