---
title: "Advanced Components"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

<div id="table-of-contents"></div>

## HTML in your data

Reef automatically encodes any markup in your data before passing it into your template to reduce your risk of cross-site scripting (XSS) attacks.

You can disable this feature by setting the `allowHTML` option to `true`.

*__Important!__ Do NOT do this with third-party or user-provided data. This exposes you to the risk of cross-site scripting (XSS) attacks.*

```js
var app = new Reef('#app', {
	data: {
		greeting: '<strong>Hello</strong>',
		name: 'world'
	},
	template: function (props) {
		return '<h1>' + props.greeting + ', ' + props.name + '!</h1>';
	},
	allowHTML: true // Do NOT use with third-party/user-supplied data
});
```

**[Try allowing HTML in your data on CodePen &rarr;](https://codepen.io/cferdinandi/pen/LwgNyr)**


## Default and state-based HTML attributes

You can use component data to conditionally include or change the value of HTML attributes in your template.

In the example below, the checkbox is `checked` when `agreeToTOS` is `true`.

```js
var app = new Reef('#app', {
	data: {
		agreeToTOS: true
	},
	template: function (props) {
		var html =
			'<label for="tos">' +
				'<input type="checkbox" id="tos" ' + (props.agreeToTOS ? 'checked' : '') + '>' +
			'</label>';
		return html;
	}
});
```

You might also want to use a default value for an attribute, but not change it based on your component's state. You can do that by prefixing any attribute with `default` in your template.

In this example, `option[value="hermione"]` has the `[selected]` attribute on it when first rendered, but will defer to whatever changes the user makes when diffing and updating the UI.

```js
var app = new Reef('#app', {
	data: {},
	template: function () {
		var html =
			'<label for="wizards">Who is the best wizard?</label>' +
			'<select>' +
				'<option value="harry">Harry</option>' +
				'<option value="hermione" defaultSelected>Hermione</option>' +
				'<option value="neville">Neville</option>' +
			'</select>';
		return html;
	}
});
```


## Nested Components

If you're managing a bigger app, you may have components inside components.

Reef provides you with a way to attach nested components to their parent components. When the parent component is updated, it will automatically update the UI of its nested components if needed.

Associate a nested component with its parent using the `attachTo` key in your options. This accepts an array of components to attach your nested component to. You only need to render the parent component. It's nested components will render automatically.

You can access a parent component's state from a nested component by assigning the parent component `data` property to the `data` key in your nested component's options.

```js
// Parent component
var app = new Reef('#app', {
	data: {
		greeting: 'Hello, world!',
		todos: [
			'Buy milk',
			'Bake a birthday cake',
			'Go apple picking'
		]
	},
	template: function (props) {
		var html =
			'<h1>' + props.greeting + '</h1>' +
			'<div id="todos"></div>';
		return html;
	}
});

// Nested component
var todos = new Reef('#todos', {
	data: app.data,
	template: function (props) {
		var html = '<h2>Todo List</h2><ul>';
		props.todos.forEach(function (todo) {
			html += '<li>' + todo + '</li>';
		});
		html += '</ul>';
		return html;
	},
	attachTo: [app]
});

app.render();
```

**[Try nested components on CodePen &rarr;](https://codepen.io/cferdinandi/pen/BXqKWX)**


## Attaching and Detaching Nested Components

You can attach or detach nested components at any time using the `attach()` and `detach()` methods. Both methods accept both individual components or arrays of components as arguments.

```js
// Attach components
app.attach(todos);
app.attach([todos]);

// Detach components
app.detach(todos);
app.detach([todos]);
```

**[Try attaching nested components on CodePen &rarr;](https://codepen.io/cferdinandi/pen/KOGzmz)**



## Shared State

There are two ways to handle shared state with Reef when your components (in addition to the [nested component/parent component relationship](#nested-components) documented above).

### Source of Truth Object

You can associate a named data object with multiple components.

The biggest downside to this approach is that it's non-reactive. You need to [manually run the `render()` method](/state-management#manual-state) on any component that needs to be updated when you update the state.

```js
var sourceOfTruth = {
	greeting: 'Hello, world!',
	todos: [
		'Buy milk',
		'Bake a birthday cake',
		'Go apple picking'
	]
};

// Parent component
var app = new Reef('#app', {
	data: sourceOfTruth,
	template: function (props) {
		var html =
			'<h1>' + props.greeting + '</h1>' +
			'<div id="todos"></div>';
		return html;
	}
});

// Nested component
var todos = new Reef('#todos', {
	data: sourceOfTruth,
	template: function (props) {
		var html = '<h2>Todo List</h2><ul>';
		props.todos.forEach(function (todo) {
			html += '<li>' + todo + '</li>';
		});
		html += '</ul>';
		return html;
	},
	attachTo: [app]
});

// Initial render
app.render();

// Update the state
sourceOfTruth.greeting = 'Hi, universe';

// Re-render the DOM
app.render();
```

**[Try working with a single source of truth on CodePen &rarr;](https://codepen.io/cferdinandi/pen/pMxyPb)**

### Create a Lagoon

A *lagoon* is a Reef instance that's only purpose is to store shared data.

It doesn't render any UI in the DOM, but allows you to reactively update state using the `setData()` method. You can automatically trigger renders in other components by attaching them to your lagoon.

Create a lagoon by setting the `lagoon` option to `true` when creating your Reef instance.

```js
var sourceOfTruth = new Reef(null, {
	data: {
		greeting: 'Hello, world!',
		todos: [
			'Buy milk',
			'Bake a birthday cake',
			'Go apple picking'
		]
	},
	lagoon: true
});

// Parent component
var app = new Reef('#app', {
	data: sourceOfTruth.data,
	template: function (props) {
		var html =
			'<h1>' + props.greeting + '</h1>' +
			'<div id="todos"></div>';
		return html;
	},
	attachTo: [sourceOfTruth]
});

// Nested component
var todos = new Reef('#todos', {
	data: sourceOfTruth.data,
	template: function (props) {
		var html = '<h2>Todo List</h2><ul>';
		props.todos.forEach(function (todo) {
			html += '<li>' + todo + '</li>';
		});
		html += '</ul>';
		return html;
	},
	attachTo: [sourceOfTruth, app]
});

// Initial render
app.render();

// Reactively update state
sourceOfTruth.setData({greeting: 'Hi, universe'});
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="cferdinandi" data-slug-hash="MNPymb" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Creating a Lagoon with ReefJS v4"></p>

**[Try creating a lagoon on CodePen &rarr;](https://codepen.io/cferdinandi/pen/MNPymb)**



## The `render` event

Whenever Reef updates the DOM, it emits a custom `render` event that you can listen for with `addEventListener()`.

The `render` event is emitted on the element that was update, and bubbles, so you can [use event delegation](https://gomakethings.com/checking-event-target-selectors-with-event-bubbling-in-vanilla-javascript/) if you'd prefer.

The `event.detail` property includes a copy of the `data` at the time that the template was rendered.

```js
document.addEventListener('render', function (event) {

	// Only run for elements with the #app ID
	if (!event.target.matches('#app')) return;

	// The data for this template
	var data = event.detail;

}, false);
```

**[Try the `render` event on CodePen &rarr;](https://codepen.io/cferdinandi/pen/XvxdRa)**



## Emitting your own custom events

Reef includes a helper function, `Reef.emit()`, that you can use to emit your own custom events in your apps.

Pass in the element to emit the event on and the event name as arguments. You can optionally pass in an object with event details as a third argument.

```js
// Emit the 'partyTime' event on the document element
Reef.emit(document, 'partyTime', {
	msg: 'It\'s party time!'
});
```



## Debugging

By default, Reef fails silently. You can put Reef into debugging mode to expose helpful error message in the Console tab of your browser's Developer Tools.

Turn debugging mode on or off with the `Reef.debug()` method. Pass in `true` to turn it on, and `false` to turn it off.

```js
// Turns debugging mode on
Reef.debug(true);

// Turns debugging mode off
Reef.debug(false);
```

{{<mailchimp intro="true">}}