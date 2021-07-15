---
title: "Advanced Components"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

As your project gets bigger, the way you manage components and data may need to grow with it. Reef has some options to help make things a little easier.

<div id="table-of-contents"></div>

## HTML Templates

### Default and state-based HTML attributes

You can use component data to conditionally include or change the value of HTML attributes in your template.

Use the `reef-checked`, `reef-selected`, and `reef-value` attributes to dynamically control the `checked`, `selected`, and `value` attributes, respectively. Use a _falsy value_ when the item should _not_ be checked or selected.

In the example below, the checkbox is `checked` when `agreeToTOS` is `true`.

```js
let app = new Reef('#app', {
	data: {
		agreeToTOS: true
	},
	template: function (props) {
		return `
			<label>
				<input type="checkbox" reef-checked="${agreeToTOS}">
			</label>`;
	}
});
```

You might also want to use a default value when an element initially renders, but defer to any changes the user makes after that.

You can do that with the `reef-default-checked`, `reef-default-selected`, and `reef-default-value` attributes.

In this example, `Hermione` has the `[selected]` attribute on it when first rendered, but will defer to whatever changes the user makes when diffing and updating the UI.

```js
let app = new Reef('#app', {
	template: function () {
		return `
			<label for="wizards">Who is the best wizard?</label>
			<select>
				<option>Harry</option>
				<option reef-default-selected>Hermione</option>
				<option>Neville</option>
			</select>`;
	}
});
```

**[Try controlling form attributes on CodePen &rarr;](https://codepen.io/cferdinandi/pen/oNWZdxG)**

### Preventing Cross-Site Scripting (XSS) Attacks

To reduce your risk of cross-site scripting (XSS) attacks, Reef automatically encodes any markup in your data before passing it into your template.

You can disable this feature by setting the `allowHTML` option to `true`.

*__Important!__ Do NOT do this with third-party or user-provided data. This exposes you to the risk of cross-site scripting (XSS) attacks.*

```js
let app = new Reef('#app', {
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

**[Try allowing HTML in your data on CodePen &rarr;](https://codepen.io/cferdinandi/pen/ZEKeoOb)**


### Getting the element the template is being rendered into

An optional second argument is passed into the `template()` function: the element the template is being rendered into.

This is particularly handy if you have data attributes on your element that affect what's rendered into the template.

```html
<div id="app" data-greeting="Hello"></div>
```

```js
let app = new Reef('#app', {
	data: {
		name: 'world'
	},
	template: function (props, elem) {
		return `<h1>${elem.getAttribute('data-greeting')}, ${props.name}!</h1>`;
	}
});
```

**[Try getting the HTML element that the template was rendered into on CodePen &rarr;](https://codepen.io/cferdinandi/pen/Vwbpxjy)**




## Nested Components

If you're managing a bigger app, you may have components nested inside other components.

Reef provides you with a way to attach nested components to their parent components. When the parent component is updated, it will automatically update the UI of its nested components if needed.

Associate a nested component with its parent using the `attachTo` key in your `options` object. You can provide a component or array of components for a value.

You only need to render the parent component. It's nested components will render automatically.

```js
// Parent component
let app = new Reef('#app', {
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
let todos = new Reef('#todos', {
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

**[Try nested components on CodePen &rarr;](https://codepen.io/cferdinandi/pen/XWRMqjj)**


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

**[Try attaching nested components on CodePen &rarr;](https://codepen.io/cferdinandi/pen/GRmWdjX)**



## Shared State with Data Stores

A *Data Store* is a special Reef object that holds reactive data you can share with multiple components.

Any time you update the data in your *Data Store*, any components that use the data will also be updated, and will render again if there are any UI changes.

Create a *Data Store* using the `new Reef.Store()` constructor.

```js
let store = new Reef.Store({
	data: {
		heading: 'My Todos',
		todos: ['Swim', 'Climb', 'Jump', 'Play']
	}
});
```

To use your *Data Store* with a component, pass it in with the `store` property instead of providing a `data` object.

```js
let app = new Reef('#app', {
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

**[Try creating a Data Store on CodePen &rarr;](https://codepen.io/cferdinandi/pen/GRmWdNX)**



## Setters & Getters

Reef's reactive `data` makes updating your UI as simple updating an object property.

But as your app scales, you may find that keeping track of what's updating state and causing changes to the UI becomes harder to track and maintain.

Setters and getters provide you with a way to control how data flows in and out of your component.

### Setters

Setters are functions that update your component or store data.

Create setters by passing in an object of setter functions with the `setters` property in your `options` object. The first parameter on a setter function is the store or component data. You can add as many other parameters as you'd like.

```js
let store = new Reef.Store({
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

Use setter functions by calling the `do()` method on your component or store. Pass in the name of the setter, along with any required arguments (except for `props`).

```js
// Add a new todo item
store.do('addTodo', 'Take a nap... zzzz');
```

**When a component or store has setter functions, they become the only way to update app or store data.**

This protects your component or store data from unwanted changes. The `data` property always returns an immutable copy.

```js
// This will NOT update the store.data or the UI
store.data.todos.push('Take a nap... zzzz');
```

**[Try working with setter functions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/yLbMjgN)**

### Getters

Getters are functions that parse data from your component or store and return a value.

They're useful if you need to manipulate and retrieve the same data across multiple views of components. Rather than having to import helper functions, you can attach them directly to the component or store.

Create getters by passing in an object of getter functions with the `getters` property in your `options` object. The first parameter on a getter function is the store or component data. You can add as many other parameters as you'd like.

_Support for parameters besides `props` requires version `8.2.0` or higher._

```js
let store = new Reef.Store({
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

Use getter functions by calling the `get()` method on your component or store. Pass in the name of getter, along with any required arguments (except for `props`).

```js
// Get the number of todo items
store.get('total');
```

**[Try working with getter functions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/bGWqMgJ)**



## Asynchronous Data

You can use asynchronous data (such as content from an API) in your templates.

Set an initial default value, make your API call, and update the `data` property once you get data back. This will automatically trigger a render.

```js
// Create an app
let app = new Reef('#app', {
	data: {
		articles: []
	},
	template: function (props) {

    // If there are no articles
    if (!props.articles.length) {
      return `<p>There are no articles.</p>`;
    }

    // Otherwise, show the articles
	return `
		<ul>
			${props.articles.map(function (article) {
				return `<li>
					<strong><a href="#">${article.title}.</a></strong>
					${article.body}
				</li>`;
			}).join('')}
		</ul>`;
	}
});

// Fetch API data
// Then, update the app data
fetch('https://jsonplaceholder.typicode.com/posts').then(function (response) {
	return response.json();
}).then(function (data) {
	app.data.articles = data;
});
```

**[Try create a template from asynchronous data on CodePen &rarr;](https://codepen.io/cferdinandi/pen/yLbMjMN)**

You might also choose to hard-code a _loading message_ in your markup.

```html
<div id="app">Loading...</div>
```



## Debugging

By default, Reef fails silently. You can put Reef into _debug mode_ to expose helpful error message in the Console tab of your browser's Developer Tools.

Turn debug mode on or off with the `Reef.debug()` method. Pass in `true` to turn it on, and `false` to turn it off.

```js
// Turns debug mode on
Reef.debug(true);

// Turns debug mode off
Reef.debug(false);
```

{{<mailchimp intro="true">}}