---
title: "API Reference"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef, Snorkel, and Reef Router expose a set of options, methods, and custom events that you can hook into.

<div id="table-of-contents"></div>

## Global Methods

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

### `Reef.trueTypeOf()`

Get the true type of an object.

```js
Reef.trueTypeOf([]); // "array"
Reef.trueTypeOf({}); // "object"
Reef.trueTypeOf(''); // "string"
Reef.trueTypeOf(1);  // "number"
```

### `Reef.err()`

Log a warning in the console conditionally only if debug mode is on.

```js
Reef.debug('You did something, silly!');
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



## Instance Methods

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

### `ReefSnorkel.prototype.run()`

Start or restart a Snorkel instance. This is run automatically when instantiating a new Snorkel instance.

```js
// A snorkel instance
let snorkel1 = new ReefSnorkel();

// Another instance
// This stops snorkel1 from running
let snorkel2 = new ReefSnorkel({
	autoLinks: false
});

// This restarts snorkel1, and stops snorkel2
snorkel1.run();
```

### `ReefSnorkel.prototype.stop()`

Stops a snorkel instance from running.

```js
let snorkel = new ReefSnorkel();
snorkel.stop();
```

### `ReefSnorkel.prototype.visit()`

Visit a URL. Pass the URL in as an argument.

```js
let snorkel = new ReefSnorkel();
snorkel.visit('/about');
```

### `ReefSnorkel.prototype.clearCache()`

Clear the cache for a snorkel instance.

```js
let snorkel = new ReefSnorkel();
snorkel.clearCache();
```

### `ReefSnorkel.prototype.addComponent()`

Add one or more Reef components to be automatically rendered whenever the route changes. Pass in the component or an array of components as an argument.

```js
// A Reef component
let app = new Reef('#app', {
	template: 'Hello world!'
});

// Snorkel
let snorkel = new ReefSnorkel();

// Add one component
snorkel.addComponent(app);

// Add an array of components
snorkel.addComponent([app]);
```

### `ReefSnorkel.prototype.removeComponent()`

Remove one or more Reef components from being automatically rendered whenever the route changes. Pass in the component or an array of components as an argument.

```js
// A Reef component
let app = new Reef('#app', {
	template: 'Hello world!'
});

// Snorkel
let snorkel = new ReefSnorkel();

// Remove one component
snorkel.removeComponent(app);

// Remove an array of components
snorkel.removeComponent([app]);
```

### `ReefRouter.prototype.addRoutes()`

Add one or more routes to a Reef Router instance. Pass in a route or array of routes as an argument.

```js
let router = new ReefRouter();

// Add one route
router.addRoutes({
	url: '/about',
	title: 'About'
});

// Add an array of routes
router.addRoutes([
	{
		url: '/about',
		title: 'About'
	},
	{
		url: '/contact',
		title: 'Contact Us'
	}
]);
```

### `ReefRouter.prototype.removeRoutes()`

Remove one or more routes from a Reef Router instance. Pass in a route or array of routes as an argument.

```js
let router = new ReefRouter({
	routes: [
		{
			url: '/about',
			title: 'About'
		},
		{
			url: '/contact',
			title: 'Contact Us'
		}
	]
});

// Remove one route
router.removeRoutes({
	url: '/about',
	title: 'About'
});

// Remove an array of routes
router.removeRoutes([
	{
		url: '/about',
		title: 'About'
	},
	{
		url: '/contact',
		title: 'Contact Us'
	}
]);
```

### `ReefRouter.prototype.addComponent()`

Add one or more Reef components to be automatically rendered whenever the route changes. Pass in the component or an array of components as an argument.

```js
// A Reef component
let app = new Reef('#app', {
	template: 'Hello world!'
});

// Reef Router
let router = new ReefRouter();

// Add one component
router.addComponent(app);

// Add an array of components
router.addComponent([app]);
```

### `ReefRouter.prototype.removeComponent()`

Remove one or more Reef components from being automatically rendered whenever the route changes. Pass in the component or an array of components as an argument.

```js
// A Reef component
let app = new Reef('#app', {
	template: 'Hello world!'
});

// Reef Router
let router = new ReefRouter();

// Add one component
router.removeComponent(app);

// Add an array of components
router.removeComponent([app]);
```

### `ReefRouter.prototype.visit()`

Visit a URL. Pass the URL in as an argument.

```js
let router = new ReefRouter();
router.visit('/about');
```

### `ReefRouter.prototype.navigate()` (_deprecated_)

This method has been replaced with `ReefRouter.prototype.visit()`. It still works, but will be removed in the next major version release.



## Instance Properties

### `Reef.prototype.data`

Get a reactive copy of the app data.

```js
let data = app.data;
```

### `Reef.prototype.elem`

The element the component is associated with. Returns a string or Node.

```js
let elem = app.elem;
```

### `Reef.prototype.allowHTML`

Whether or not HTML is allowed in the Reef component data. Returns a boolean.

```js
let allowed = app.allowHTML;
```

### `ReefRouter.prototype.routes`

An immutable array of the routes for a router instance.

```js
let routes = router.routes;
```

### `ReefRouter.prototype.current`

The current route for a router.

```js
let current = router.current;
```



## Events

Reef, Snorkel, and Reef Router emit custom events throughout the life cycle of a component or instance.

All Reef events follow a `library:event` pattern. Unless otherwise specified, all events are emitted on the `document` element. Event details can be accessed on the `event.details` property.

```js
// Listen for when Reef components are rendered into the DOM
document.addEventListener('reef:render', function (event) {
	console.log(event.target); // The element it was rendered into
	console.log(event.detail); // The data used for the render
});
```

### Reef Events

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

### Snorkel Events

- **`snorkel:ready`** is emitted when Snorkel is loaded into the DOM and ready to use.
- **`snorkel:initialized`** is emitted when a new Snorkel instance is initialized.
	+ `event.detail` - the instance
- **`snorkel:stopped`** is emitted when a Snorkel instance is stopped.
	+ `event.detail` - the instance
- **`snorkel:before`** is emitted before a new route is fetched.
	+ `event.detail` - an object with the `current` and `next` URLs
	+ `event.preventDefault()` - stop the route from being fetched
- **`snorkel:after`** is emitted after a new route is fetched and loaded into the UI
	+ `event.detail` - an object with the `current` and `previous` URLs
- **`snorkel:not-found`** is emitted when a fetched route is not found
	+ `event.detail` - an object with the `current` and `notFound` URLs
- **`snorkel:components-added`** is emitted when one or more components are added for rendering on route changes.
	+ `event.detail` - an object with the `snorkel` instance and an array of added `components`
- **`snorkel:components-removed`** is emitted when one or more components are removed from rendering on route changes.
	+ `event.detail` - an object with the `snorkel` instance and an array of removed `components`
- **`snorkel:cache-updated`** is emitted when a URL is added to the internal cache.
	+ `event.detail` - an object with the `url` and `html` string
- **`snorkel:cache-cleared`** is emitted when the internal cache is cleared.
	+ `event.detail` - the Snorkel instance

### Router Events

- **`router:ready`** is emitted when Reef Router is loaded into the DOM and ready to use.
- **`router:initialized`** is emitted when a new Router instance is initialized.
	+ `event.detail` - the instance
- **`router:before`** is emitted before a new route is fetched.
	+ `event.detail` - an object with the `current` and `next` URLs
	+ `event.preventDefault()` - stop the route from being fetched
- **`router:after`** is emitted after a new route is fetched and loaded into the UI
	+ `event.detail` - an object with the `current` and `previous` URLs
- **`router:routes-added`** is emitted when one or more routes are added to the router.
	+ `event.detail` - an object with the `router` instance and an array of added `routes`
- **`router:routes-removed`** is emitted when one or more routes are removed from the router.
	+ `event.detail` - an object with the `router` instance and an array of removed `routes`
- **`router:components-added`** is emitted when one or more components are added for rendering on route changes.
	+ `event.detail` - an object with the `router` instance and an array of added `components`
- **`router:components-removed`** is emitted when one or more components are removed from rendering on route changes.
	+ `event.detail` - an object with the `router` instance and an array of removed `components`

### Deprecated Events

These are events that are still emitted, but will be removed in the next major version release. You should migrate to one of the events listed above whenever possible.

- **`render`** was replaced by `reef:render`
- **`beforeRouteUpdated`** was replaced by `router:before`
- **`routeUpdated`** was replaced by `router:after`



## Options

All of the options for Reef, Snorkel, and Reef Router. This section is still a work-in-progress.

### Reef Options

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

	// A router to use for this component
	router: null,

	// An object of setter methods
	setters: {},

	// An object of getter methods
	getters: {}

});
```

### Snorkel Options

```js
new ReefSnorke({

	// If true, automatically run Snorkel on all links
	autoLinks: true,

	// The selector for links to follow
	// Only needed if autoLinks is false or if you've used an ignore selector
	follow: '[snorkel]',

	// The selector for links to ignore
	ignore: '[snorkel-ignore]',

	// The selector for links that should replace the current state
	// (instead of adding a new entry to browser history)
	replace: '[snorkel="replace"]',

	// The class that's added to the HTML element while a new route is loading
	loading: 'reef-loading',

	// The root for your app
	// If your app is on a sub-page, you may want to change this
	root: '/',

	// If true, cache views for use with the forward/back button
	cache: true,

	// How many items to store in cache
	cacheSize: 50,

	// How long to keep cached items for, in seconds
	cacheTime: 3600,

});
```

### Reef Router Options

```js
new ReefRouter({

	// An array of routes
	routes: [],

	// The root path for your app
	root: '',

	// The format to use for the document.title
	// Can be a string, or a function that returns a string
	// Accepts the route object and page title as arguments
	title: function (route, title) {
		return title;
	},

	// If true, use a hashbang pattern instead of real URLs
	useHash: false

});
```