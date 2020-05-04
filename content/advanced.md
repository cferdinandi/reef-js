---
title: "Advanced Components"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

<div id="table-of-contents"></div>

## HTML Templates

### Default and state-based HTML attributes

You can use component data to conditionally include or change the value of HTML attributes in your template.

In the example below, the checkbox is `checked` when `agreeToTOS` is `true`.

```js
var app = new Reef('#app', {
	data: {
		agreeToTOS: true
	},
	template: function (props) {
		return `
			<label for="tos">
				<input type="checkbox" id="tos" ${props.agreeToTOS ? 'checked' : ''}>
			</label>`;
	}
});
```

You might also want to use a default value for an attribute, but not change it based on your component's state. You can do that by prefixing any attribute with `default` in your template.

In this example, `option[value="hermione"]` has the `[selected]` attribute on it when first rendered, but will defer to whatever changes the user makes when diffing and updating the UI.

```js
var app = new Reef('#app', {
	data: {},
	template: function () {
		return `
			<label for="wizards">Who is the best wizard?</label>
			<select>
				<option value="harry">Harry</option>
				<option value="hermione" defaultSelected>Hermione</option>
				<option value="neville">Neville</option>
			</select>`;
	}
});
```

### Preventing Cross-Site Scripting (XSS) Attacks

To reduce your risk of cross-site scripting (XSS) attacks, Reef automatically encodes any markup in your data before passing it into your template.

You can disable this feature by setting the `allowHTML` option to `true`.

*__Important!__ Do NOT do this with third-party or user-provided data. This exposes you to the risk of cross-site scripting (XSS) attacks.*

```js
var app = new Reef('#app', {
	data: {
		greeting: '<strong>Hello</strong>',
		name: 'world'
	},
	template: function (props) {
		return `<h1>${props.greeting}, ${props.name}!</h1>`;
	},
	allowHTML: true // Do NOT use with third-party/user-supplied data
});
```

**[Try allowing HTML in your data on CodePen &rarr;](https://codepen.io/cferdinandi/pen/KKdZwYB)**


## Nested Components

If you're managing a bigger app, you may have components nested inside other components.

Reef provides you with a way to attach nested components to their parent components. When the parent component is updated, it will automatically update the UI of its nested components if needed.

Associate a nested component with its parent using the `attachTo` key in your options. You can provide a component or array of components for a value.

You only need to render the parent component. It's nested components will render automatically.

```js
// Parent component
var app = new Reef('#app', {
	data: {
		greeting: 'Hello, world!'
	},
	template: function (props) {
		return `
			<h1>${props.greeting}</h1>
			<div id="todos"></div>`;
	}
});

// Nested component
var todos = new Reef('#todos', {
	data: {
		todos: ['Swim', 'Climb', 'Jump', 'Play']
	},
	template: function (props) {
		return `
			<ul>
				${props.todos.map(function (todo) {
					return `<li>${todo}</li>`;
				}).join('')}
			</ul>`;
	},
	attachTo: app
});

app.render();
```

**[Try nested components on CodePen &rarr;](https://codepen.io/cferdinandi/pen/gOaobJW)**


### Attaching and Detaching Nested Components

You can attach or detach nested components at any time using the `attach()` and `detach()` methods on the parent component.

Provide an individual component or array of components as an argument.

```js
// Attach components
app.attach(todos);
app.attach([todos]);

// Detach components
app.detach(todos);
app.detach([todos]);
```

**[Try attaching nested components on CodePen &rarr;](https://codepen.io/cferdinandi/pen/zYvpxQV)**



## Shared State with Data Stores

A *Data Store* is a special Reef object that holds reactive data you can share with multiple components.

Any time you update the data in your *Data Store*, any components that use the data will also be updated, and will render again if there are any UI changes.

Create a *Data Store* using the `new Reef.Store()` constructor.

```js
var store = new Reef.Store({
	data: {
		heading: 'My Todos',
		todos: ['Swim', 'Climb', 'Jump', 'Play']
	}
});
```

To use your *Data Store* with a component, pass it in with the `store` property instead of providing a `data` object.

```js
var app = new Reef('#app', {
	store: store,
	template: function (props) {
		return `
			<h1>${props.heading}</h1>
			<ul>
				${props.todos.map(function (todo) {
					return `<li>${todo}</li>`;
				}).join('')}
			</ul>`;

	}
});
```

When using a *Data Store*, a component will have no `data` of its own. All state/data updates must happen by updating the `store`.

```js
// Add a todo item
store.data.todos.push('Take a nap... zzzz');
```

**[Try creating a Data Store on CodePen &rarr;](https://codepen.io/cferdinandi/pen/mdepyNW)**



## Setters & Getters

Reef's reactive `data` makes updating your UI as simple updating an object property.

But as your app scales, you may find that keeping track of what's updating state and causing changes to the UI becomes harder to track and maintain.

Setters and getters provide you with a way to control how data flows in and out of your component.

### Setters

Setters are functions that update your component or store data.

Create setters by passing in an object of setter functions with the `setters` property in your Reef options. The first argument on a setter function is the store or component data. You can pass in as many other arguments as you'd like.

```js
var store = new Reef.Store({
	data: {
		heading: 'My Todos',
		todos: ['Swim', 'Climb', 'Jump', 'Play']
	},
	setters: {
		// Add a new todo item to the component
		addTodo: function (props, todo) {
			props.todos.push(todo);
		}
	}
});
```

Use setter functions by calling the `do()` method on your component or store. Pass in the name of setter, along with any required arguments (except for `props`).

```js
// Add a new todo item
store.do('addTodo', 'Take a nap... zzzz');
```

**When a component/store has setter functions, you cannot update data directly.**

Setter functions are the only way to make updates. This protects your component or store data from unwanted changes. The `data` property always returns an immutable copy of the data.

```js
// This will NOT update the store.data or the UI
store.data.todos.push('Take a nap... zzzz');
```

**[Try working with setter functions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/qBOpdBO)**

### Getters

Getters are functions that parse data from your component or store and return a value.

They're useful if you need to manipulate and retrieve the same data across multiple views of components. Rather than having to import helper functions, you can attach them directly to the component or store.

Create getters by passing in an object of getter functions with the `getters` property in your Reef options. They accept the store or component data as their only argument.

```js
var store = new Reef.Store({
	data: {
		heading: 'My Todos',
		todos: ['Swim', 'Climb', 'Jump', 'Play']
	},
	getters: {
		total: function (props) {
			return props.todos.length;
		}
	}
});
```

Use getter functions by calling the `get()` method on your component or store. Pass in the name of getter as an argument.

```js
// Add a new todo item
store.get('total');
```

**[Try working with getter functions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/RwWxPNp)**


## Event Hooks

Whenever Reef updates the DOM, it emits a custom `render` event that you can listen for with `addEventListener()`.

The `render` event is emitted on the element that was updated, and bubbles, so you can also [use event delegation](https://gomakethings.com/checking-event-target-selectors-with-event-bubbling-in-vanilla-javascript/). The `event.detail` property includes a copy of the `data` at the time that the component template was rendered.

```js
document.addEventListener('render', function (event) {

	// Only run for elements with the #app ID
	if (!event.target.matches('#app')) return;

	// Log the data at the time of render
	console.log(event.detail);

}, false);
```

**[Try the `render` event hook on CodePen &rarr;](https://codepen.io/cferdinandi/pen/ZEbvGYP)**



### Emitting your own custom events

Reef includes a helper function, `Reef.emit()`, that you can use to emit your own custom events in your apps.

Pass in the element to emit the event on and the event name as arguments. You can optionally pass in an object with event details as a third argument.

```js
// Emit the 'partyTime' event on the document element
Reef.emit(document, 'partyTime', {
	msg: `It's party time!`
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