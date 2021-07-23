---
title: "API Reference"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef exposes a set of options, methods, and custom events that you can hook into.

<div id="table-of-contents"></div>

## Global Methods

Run these methods directly on the `Reef` object.

### `Reef.debug()`

Turn _debug mode_ on or off. Pass in `true` to turn debug mode on, and `false` to turn it off.

```js
// Turn debug mode on
Reef.debug(true);

// Turn debug mode off
Reef.debug(false);
```

### `Reef.clone()`

Create an immutable copy of an array, object, `Map()`, or `Set()`.

```js
Reef.clone({});
```

### `Reef.err()`

Log a warning in the console conditionally only if debug mode is on.

```js
Reef.err('You did something, silly!');
```

### `Reef.emit()`

Emit a custom event. Pass in the element to emit the event on, the event name, and optionally, event details as arguments.

```js
// Emits the "awesome" event on the document
Reef.emit(document, 'awesome');

// Emit the "awesome" event on the #app element, with some details
let app = document.querySelector('#app');
Reef.emit(app, 'awesome', {
	whoIs: 'You are'
});
```

You can listen for custom events with the `Element.addEventListener()` method.



## Component Properties

Access these properties on individual Reef components.

### `Reef.prototype.data`

Get a reactive copy of the app data.

```js
let data = app.data;
```

### `Reef.prototype.dataCopy`

Get a non-reactive, immutable copy of the app data.

```js
let copy = app.dataCopy;

// This will not update the component data or cause a render
copy.todos.push('Zzzz... take a nap!');
```

### `Reef.prototype.elem`

The element the component is associated with. Returns a string or Node.

```js
let elem = app.elem;
```



## Component Methods

Run these methods on individual Reef components.

### `Reef.prototype.render()`

Render a Reef component in the UI.

```js
let app = new Reef('#app', {
	template: 'Hello world!'
});

app.render();
```

### `Reef.prototype.attach()`

Attach one or more components to a Reef component. Pass in the component or an array of components as an argument.

```js
let app = new Reef('#app', {
	template: '<ul id="todos"></ul>'
});

let todos = new Reef('#todos', {
	template: '<li>Build something with Reef</li>'
});

// Attach one item
app.attach(todos);

// Attach an array of items
app.attach([todos]);
```

### `Reef.prototype.detach()`

Detach an attached component. Pass in the component or an array of components as an argument.

```js
// Detach one component
app.detach(todos);

// Detach an array of components
app.detach([todos]);
```

### `Reef.prototype.do()`

Run a setter function. Pass in the name of the setter, and a comma-separate list of any arguments.

```js
let app = new Reef('#app', {
	data: {
		count: 0
	},
	template: function (props) {
		return count;
	},
	setters: {
		increase: function (props) {
			props.count++;
		}
	}
});

// Run the increase setter
app.do('increase');
```

### `Reef.prototype.get()`

Run a getter function. Pass in the name of the getter, and a comma-separate list of any arguments.

```js
let app = new Reef('#app', {
	data: {
		count: 0
	},
	template: function (props) {
		return count;
	},
	getters: {
		count: function (props) {
			return props.count;
		}
	}
});

// Run the count getter
app.get('count');
```



## Events

Reef emits custom events throughout the lifecycle of a component or instance.

All Reef events follow a `reef:{event-name}` pattern. Unless otherwise specified, all events are emitted on the `document` element. Event details can be accessed on the `event.details` property.

```js
// Listen for when Reef components are rendered into the DOM
document.addEventListener('reef:render', function (event) {
	console.log(event.target); // The element it was rendered into
	console.log(event.detail); // The data used for the render
});
```

- **`reef:ready`** is emitted when Reef is loaded into the DOM and ready to use.
- **`reef:initialized`** is emitted when a new Reef component is initialized.
	+ `event.detail` - the instance
- **`reef:before-render`** is emitted on an element before a new UI is rendered into it.
	+ `event.target` - the element the component is being rendered into
	+ `event.detail` - the current component `data`
	+ `event.preventDefault()` - stop the component from rendering
- **`reef:render`** is emitted on an element after a new UI is rendered into it.
	+ `event.target` - the element the component was rendered into
	+ `event.detail` - the component `data` at time of render
- **`reef:attached`** is emitted when one or more components is attached to a component.
	+ `event.detail` - an object with the `component` and an array of `attached` components
- **`reef:detached`** is emitted when one or more components is detached from a component.
	+ `event.detail` - an object with the `component` and an array of `detached` components



## Options

All of the options for Reef.

```js
// This can be a string or a element
let elem = '#app';

new Reef(elem, {

	// The component data
	data: {},

	// A component or array of components to attach to
	attachTo: [],

	// A data store to use
	// If used, the data option is ignored
	store: null,

	// An object of setter methods
	setters: {},

	// An object of getter methods
	getters: {}

});
```