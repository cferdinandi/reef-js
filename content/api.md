---
title: "API Reference"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef provides various options, methods, and custom events that you can hook into.

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
	template: function () {
		return 'Hello world!';
	}
});

app.render();
```

### `Reef.prototype.html()`

Get the compiled HTML string for a component. Used for nesting components.

```js
let app = new Reef('#app', {
	template: function () {
		return 'Hello world!';
	}
});

app.html();
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



## Events

Reef emits custom events throughout the lifecycle of a component or instance.

All Reef events follow a `reef:{event-name}` pattern. Unless otherwise specified, all events are emitted on the `document` element. Event details can be accessed on the `event.detail` property.

```js
// Listen for when Reef components are rendered into the DOM
document.addEventListener('reef:render', function (event) {
	console.log(event.target); // The element it was rendered into
	console.log(event.detail); // The component, and the data used for the render
});
```

- **`reef:ready`** is emitted when Reef is loaded into the DOM and ready to use.
- **`reef:initialized`** is emitted when a new Reef component is initialized.
	+ `event.detail` - the instance
- **`reef:before-render`** is emitted on an element before a new UI is rendered into it.
	+ `event.target` - the element the component is being rendered into
	+ `event.detail` - the `component` and the `data` at time of render
	+ `event.preventDefault()` - stop the component from rendering
- **`reef:render`** is emitted on an element after a new UI is rendered into it.
	+ `event.target` - the element the component was rendered into
	+ `event.detail` - the `component` and the `data` that was used for the render



## Options

All of the options for Reef.

```js
// This can be a string or a element
let elem = '#app';

new Reef(elem, {

	// The component data
	data: {},

	// A data store to use
	// If used, the data option is ignored
	store: null,

	// An object of setter methods
	setters: {},

	// An object of allowed event listeners
	listeners: {}

});
```