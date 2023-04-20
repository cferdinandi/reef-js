---
title: "Advanced Techniques"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef is a set of small functions you can mix-and-match as needed. As your project gets bigger, the way you manage components and data may need to grow with it.

<div id="table-of-contents"></div>



## Default and state-based HTML attributes

You can use data to conditionally include or change the value of HTML attributes in your template.

To dynamically set `checked`, `selected`, and `value` attributes, prefix them with an `@` symbol. Use a _falsy value_ when the item should _not_ be `checked` or `selected`.

In the example below, the checkbox is `checked` when `agreeToTOS` is `true`.

```js
// The reactive store
let data = store({
	agreeToTOS: true
});

// The template
function template () {
	return `
		<label>
			<input type="checkbox" @checked="${agreeToTOS}">
		</label>`;
}

// The component
component('#app', template);
```

You might instead want to use a default value when an element initially renders, but defer to any changes the user makes after that.

You can do that by prefixing your attributes with a `#` symbol.

In this example, `Merlin` has the `[selected]` attribute on it when first rendered, but will defer to whatever changes the user makes when diffing and updating the UI.

```js
function template () {
	return `
		<label for="wizards">Who is the best wizard?</label>
		<select>
			<option>Gandalf</option>
			<option #selected>Merlin</option>
			<option>Ursula</option>
		</select>`;
}
```

**[Try controlling form attributes on CodePen &rarr;](https://codepen.io/cferdinandi/pen/LYdbOdY)**



## Multiple Stores

With Reef, you can create components that use data from multiple reactive stores.

```js
// Create multiple reactive store
let data = store({
	heading: 'My Todos',
	emoji: '👋🎉'
});
let todos = store(['Swim', 'Climb', 'Jump', 'Play']);

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
// It automatically renders into the UI
component('#app', template);
```

If your stores use custom event names, pass them in as an array of store names with the `options.stores` property.

```js
// Create multiple reactive store
let data = store({
	heading: 'My Todos',
	emoji: '👋🎉'
}, 'heading');
let todos = store(['Swim', 'Climb', 'Jump', 'Play'], 'todos');

// ...

// Create a reactive component with multiple stores
component('#app', template, {stores: ['heading', 'todos']});
```

**[Try components with multiple stores on CodePen &rarr;](https://codepen.io/cferdinandi/pen/YzaZPMx?editors=1011)**




## Batch Rendering

With a `component()`, multiple reactive data updates are often batched into a single render that happens asynchronously.

```js
// Reactive store
let todos = store(['Swim', 'Climb', 'Jump', 'Play']);

// Create a component from a template
component('#app', template);

// These three updates would result in a single render
todos.push('Sleep');
todos.push('Wake up');
todos.push('Repeat');
```

You can detect when a UI update happens inside a component by listening for [the `reef:render` event](/api#lifecycle-events).

It's emitted directly on the element that was rendered, and also bubbles if you want to listen for all render events.

```js
// Log whenever an element is rendered into
document.addEventListener('reef:render', function (event) {
	console.log('The UI was just updated inside this element.');
	console.log(event.target);
});
```

**[Try batch rendering on CodePen &rarr;](https://codepen.io/cferdinandi/pen/BarQmxd?editors=1011)**




## More efficient DOM diffing with IDs

Unique IDs can help Reef more effectively handle UI updates.

For example, imagine you have a list of items, and you're rendering them into the UI as an unordered list.

```js
// Reactive store
let todos = store(['Swim', 'Climb', 'Jump', 'Play']);

// The template
function template () {
	return `
		<ul>
			${todos.map(function (todo) {
				return `<li>${todo}</li>`;
			})}
		</ul>`;
}

// Create a component
component('#app', template);
```

The resulting HTML would look like this.

```html
<ul>
	<li>Swim</li>
	<li>Climb</li>
	<li>Jump</li>
	<li>Play</li>
</ul>
```

Next, let's imagine that you remove an item from the middle of your array of `todos`.

```js
// remove "Climb"
todos.splice(1, 1);
```

Because of how Reef diffs the UI, rather than removing the list item (`li`) with `Climb` as it's text, it would update the text of `Climb` to `Jump`, and the text of `Jump` to `Play`, and _then_ remove the last list item from the UI.

For larger and more complex UIs, this can be really inefficient.

You can help Reef more effectively diff the UI by assigning unique IDs to elements that may change.

```js
// The template
function template () {
	return `
		<ul>
			${todos.map(function (todo) {
				let id = todo.toLowerCase();
				return `<li id="${id}">${todo}</li>`;
			})}
		</ul>`;
}
```

Now, the starting HTML looks like this.

```html
<ul>
	<li id="swim">Swim</li>
	<li id="climb">Climb</li>
	<li id="jump">Jump</li>
	<li id="play">Play</li>
</ul>
```

If you remove `Climb` from the `todos` array, Reef will now remove the `#climb` element rather than updating all of the other list items (and any content within them).

_**Tip:** you can easily [generate unique IDs using the `crypto.randomUUID()` method](https://gomakethings.com/generating-a-uuid-universally-unique-identifier-with-vanilla-js/)._



## Setter Functions

Reef’s `store()` method makes updating your UI as simple as updating an object property. But as your app scales, you may find that keeping track of what’s updating state and causing changes to the UI becomes harder to track and maintain.

Setter functions provide you with a way to control how data flows in and out of `store` object. Use the `setter()` method to create a `store` that can only be updated with _setter functions_ that you define at time of creation. 

Pass in your data and an object of functions as arguments. Setter functions automatically receive the data object as their first argument.

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

This protects your component or store data from unwanted changes. The data property always returns an immutable copy.

```js
// This will update the data
todos.add('Take a nap');
todos.delete('Jump');

// This WILL not
todos.push('Do it again tomorrow');
```

**[Try setter functions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/oNaYoWV?editors=0011)**



## Reactive data and manual UI updates

If you have a more simple UI component, you can combine the `store()` method with the browser-native `Element.addEventListener()` to manually update your UI instead of using the `render()` function.

For example, imagine you have an element that displays the number of items in a shopping cart.

```html
Cart (<span id="cart-items">0</span>)
```

Rather than diffing the DOM every time that number of items changes, you can listen for data updates and use the `Element.textContent` property to manually update the UI. It will be faster and simpler.

```js
// Get the cart element
let cartCount = document.querySelector('#cart-items');

// Create a reactive store
let cart = store([], 'cart');

// Update how many cart items are displayed in the UI
document.addEventListener('reef:store-cart', function () {
	cartCount.textContent = cart.length;
});

// Add an item to the cart
// The UI will automatically be updated
cart.push({
	item: 'T-Shirt',
	size: 'M',
	cost: 29
});
```

**[Try manual UI updates on CodePen &rarr;](https://codepen.io/cferdinandi/pen/MWVbOXP)**



## Native Web Components

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