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

It accepts any value as an argument. If no value is provided, it uses an empty object by default. If a string or number is used, it returns an object with the `value` property.

```js
let {store} = reef;

let data = store({
	greeting: 'Hello',
	name: 'World'
});

// returns {value: 42}
let num = store(42);
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

You can customize the event name by passing a second argument into the `store()` method. It gets added to the end of the `reef:store` event with a dash delimiter (`-`).

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

If you want to allow `on*` event listeners, pass an object of named `events` listener functions into `render()` function as the third argument. 

Any `on*` events that are _not_ passed into your `render()` function are removed to reduce the risk of XSS attacks.

```js
let {render} = reef;

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

// Register event handlers
let events = {log};

// Render a button with an onclick event
render('#app', `<button onclick="log()">Activate Me</button> <button onclick="warn()">This won't work</button>`, {events});
```

**[Try event listener binding on CodePen &rarr;](https://codepen.io/cferdinandi/pen/JjLbOyQ?editors=1011)**

_**Note:** this is only needed if you're using `on*` events directly on your elements. If you're using event delegation outside of your template, it's not needed._



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

- `events` - An object of allowed event binding callback functions.
- `stores` - An array of custom event names to use [for `store()` events](#store).

```js
// Allow registered on* events
component('#app', template, {events: reverseWizards});

// Use a custom event name
let wizards = store([], 'wizards');
component('#app', template, {stores: ['wizards']});

// Use a custom name AND allow register on* events
component('#app', template, {stores: ['wizards'], events: reverseWizards});
```

**[Try component options on CodePen &rarr;](https://codepen.io/cferdinandi/pen/JjLbOOg)**

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

**[Try component methods on CodePen &rarr;](https://codepen.io/cferdinandi/pen/wvmoPyq?editors=1011)**



## setter()

Create a reactive data object that can only be updated [with _setter functions_](/advanced/#setter-functions) that you define at time of creation.

It accepts the data as the first argument, and an object of _setter functions_ as the second argument. Setter functions automatically receive the data object as their first argument.

```js
let {setter} = reef;

let todos = setter(['Swim', 'Climb', 'Jump', 'Play'], {

	// Add an item to the todo list
	add (todos, todo) {
		todos.push(todo);
	},

	// Remove a todo item by name
	delete (todos, todo) {
		let index = todos.indexOf(todo);
		if (index < 0) return;
		todos.splice(index, 1);
	}

});
```

You can update your data by calling one of your setter methods directly on the `setter` object. Trying to update the data directly will not work.

```js
// This will update the data
todos.add('Take a nap');
todos.delete('Jump');

// This WILL not
todos.push('Do it again tomorrow');
```

**[Try setter functions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/oNaYoWV?editors=0011)**

The `setter()` method creates a `store` under-the-hood, and emits a `reef:store` event on the `document` whenever a property is modified with a setter function.

You can customize the event name by passing a third argument into the `setter()` method. It gets added to the end of the `reef:store` event with a dash delimiter (`-`).

```js
let todos = setter([], {
	add (todos, todo) {
		todos.push(todo);
	},
}, 'todos');

// A "reef:store-todos" event gets emitted
todos.add('Go to the store');
```



## Lifecycle Events

Reef emits custom events throughout the lifecycle of a component or reactive store.

- **`reef:store`** is emitted when a reactive store is modified. The `event.detail` property contains the data object.
- **`reef:start`** is emitted on a component element when reef starts listening for reactive data changes.
- **`reef:stop`** is emitted on a component element when reef stops listening for reactive data changes.
- **`reef:before-render`** is emitted on a component element before it renders a UI update. The `event.preventDefault()` method cancels the render.
- **`reef:render`** is emitted on a component element when reef renders a UI update.

You can listen for Reef events with the `Element.addEventListener()` method.

```js
// Log whenever an element is rendered into
document.addEventListener('reef:render', function (event) {
	console.log('The UI was just updated inside this element.');
	console.log(event.target);
});
```