---
title: Advanced Techniques
date: 2018-01-24T11:48:20-05:00
draft: false
anchors: true
---

Reef is a set of small functions you can mix-and-match as needed. As your project gets bigger, the way you manage components and data may need to grow with it.

<div id="table-of-contents"></div>



## HTML Attributes

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



## Multiple Signals

With Reef, you can create components that use data from multiple reactive signals.

```js
// Create multiple reactive signals
let data = signal({
	heading: 'My Todos',
	emoji: '👋🎉'
});
let todos = signal(['Swim', 'Climb', 'Jump', 'Play']);

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
component('#app', template);
```

If your signals use custom event names, pass them in as an array of signals names with the `options.signals` property.

```js
// Create multiple named signals
let data = signal({
	heading: 'My Todos',
	emoji: '👋🎉'
}, 'heading');
let todos = signal(['Swim', 'Climb', 'Jump', 'Play'], 'todos');

// ...

// Create a reactive component with multiple named signals
component('#app', template, {signals: ['heading', 'todos']});
```

**[Try components with multiple signals on CodePen &rarr;](https://codepen.io/cferdinandi/pen/oNJRMEZ?editors=0011)**




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

**[Try batch rendering on CodePen &rarr;](https://codepen.io/cferdinandi/pen/wvRbxyE?editors=1011)**




## Efficient DOM Diffing

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

### Using a key instead of an ID

Sometimes generating valid IDs is difficult. 

For example, imagine that some of the `todos` contain multiple words.

```js
let todos = store(['Swim', 'Climb', 'Jump', 'Play', 'Go to the store']);
```

The last item would generate a list item that looks like this...

```html
<li id="Go to the store">Go to the store</li>
```

That's not a valid ID. To get around that, we can instead use a `[key]` attribute, with the `todo` item as its value.

```js
// The template
function template () {
	return `
		<ul>
			${todos.map(function (todo) {
				return `<li key="${todo}">${todo}</li>`;
			})}
		</ul>`;
}
```

Reef will use the `[key]` attribute as a unique identified within the parent element when diffing.

### Don't use an `index` as the ID or key value

One common pitfall developers encounter with IDs and keys is using an array `index` as the value.

```js
// The template
function template () {
	return `
		<ul>
			${todos.map(function (todo, index) {
				return `<li key="${index}">${todo}</li>`;
			})}
		</ul>`;
}
```

Because the index changes when you add, remove, or reorder items in the array, they do not help uniquely identify elements and will have no effect on diffing performance.



## Events

The preferred way to listen for user interaction events in a Reef template is _event delegation_.

Run the `addEventListener()` method on the element you're rendering your template into, and filter out events that occur on elements you don't care about.

```js
// The count
let count = signal(0);

// Increase the count by 1 when the [data-count] button is clicked
function increase (event) {
	if (!event.target.matches('[data-count]')) return;
	count.value++;
}

// The template
function template () {
	return `<button data-count>Clicked ${count.value} times</button>`;
}

// Render the component
let app = document.querySelector('#app');
component(app, template);

// Listen for events
app.addEventListener('click', increase);
```

**[Try event delegation on CodePen &rarr;](https://codepen.io/cferdinandi/pen/bGOyjvm)**

By default, `on*` events on elements are removed when rendering to reduce the risk of XSS attacks.

If you'd prefer to attach events directly to elements in your template using `on*` events, you must register them by passing an object of named event listener callback functions into your `component` as the `events` option.

Under-the-hood, Reef will remove any event handlers that aren't registered.

```js
// The count
let count = signal(0);

// Increase the count by 1
function increase () {
	count.value++;
}

// The template
function template () {
	return `<button onclick="increase()">Clicked ${count.value} times</button>`;
}

// Render the component
component('#app', template, {events: {increase}});
```

**[Try event binding on CodePen &rarr;](https://codepen.io/cferdinandi/pen/mdaYjwB?editors=1111)**




## Stores

Reef’s `signal()` method makes updating your UI as simple as updating an object property. But as your app scales, you may find that keeping track of what’s updating state and causing changes to the UI becomes harder to track and maintain.

Stores and action functions provide you with a way to control how data flows in and out of `signal` object. Use the `store()` method to create a `signal` that can only be updated with _action functions_ that you define at time of creation. 

Pass in your data and an object of functions as arguments. Action functions automatically receive the data object as their first argument.

```js
let {store} = reef;

// Create a store with `add()` and `delete()` actions
let todos = store(['Swim', 'Climb', 'Jump', 'Play'], {

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

You can access an immutable copy of the data with the `.value` property.

You can update your data by calling one of your action methods directly on the `store()` object. Updating the data directly will not work.

This protects your component or signal data from unwanted changes. The store always returns an immutable copy of your data.

```js
// Access the todos
let firstTodo = todos.value[0];

// This will update the data
todos.add('Take a nap');
todos.delete('Jump');

// This WILL not
todos.value.push('Do it again tomorrow');
```

**[Try store action functions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/GRPaBOy?editors=1011)**



## Managing Focus

Managing focus is a common challenge for UI libraries, because rendering often happens asynchronously. Reef includes a `focus()` function that you can use to set focus on an element after the next render occurs.

Pass in a selector for the element you want to set focus on as an argument. It will set focus on the target element, if one exists, after the next `reef:render` event is emitted.

```js
let {focus} = reef;
focus('h1');
```

If you're using the `render()` method to render the UI, you need to run the `focus()` method first. If you're using the `component()` method, you can run it before _or_ after.

```js
// You have to run focus() before the render() function
focus('h1');
render('#app', template());

// With component(), it can go before or after
component('#app', template);
focus('h1');
```

**[Try setting focus on CodePen &rarr;](https://codepen.io/cferdinandi/pen/YzdbjYQ)**

<div class="callout">
	⚠️ <strong>Use this sparingly.</strong> You generally only need to set focus in limited circumstances, like if your initial UI render is delayed when calling an API.
</div>



## Manual UI Updates

If you have a more simple UI component, you can combine the `signal()` method with the `Element.addEventListener()` to manually update your UI instead of using the `render()` function.

For example, imagine you have an element that displays the number of items in a shopping cart.

```html
Cart (<span id="cart-items">0</span>)
```

Rather than diffing the DOM every time that number of items changes, you can listen for data updates and use the `Element.textContent` property to manually update the UI. It will be faster and simpler.

```js
// Get the cart element
let cartCount = document.querySelector('#cart-items');

// Create a reactive store
let cart = signal([], 'cart');

// Update how many cart items are displayed in the UI
document.addEventListener('reef:signal-cart', function () {
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

**[Try manual UI updates on CodePen &rarr;](https://codepen.io/cferdinandi/pen/JjwqBvR)**



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



## Ignoring Elements

Often, using browser native features or manual DOM manipulation scripts is easier than managing every aspect of a UI in a `signal()`.

For example, the `details` and `summary` elements provide browser-native disclosure functionality without any JavaScript.

```js
let name = signal('friend');

function template () {
	return `
		<h1>Hello ${name.value}</h1>
		<details>
			<summary><strong>Tap me to open</strong></summary>
			I'm open now!
		</details>`;
}
```

When a `details` element is expanded, it has an `[open]` attribute on it. If someone interacted with that element to expand it, and then a render event happened, Reef would notice the `[open]` attribute not present in the template and remove it, collapsing it.

You can prevent Reef from diffing an element by adding the `[reef-ignore]` attribute to it.

```js
let name = signal('friend');

function template () {
	return `
		<h1>Hello ${name.value}</h1>
		<details reef-ignore>
			<summary><strong>Tap me to open</strong></summary>
			I'm open now!
		</details>`;
}
```

Reef will still render the element, but it won't modify any attributes or content after its initially rendered into the UI.

**[Try ignoring elements on CodePen &rarr;](https://codepen.io/cferdinandi/pen/RwEmByj)**