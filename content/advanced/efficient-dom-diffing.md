---
title: Efficient DOM Diffing
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 40
---

Unique IDs can help Reef more effectively handle UI updates.

{{<toc>}}


## Overview

Imagine you have a list of items, and you're rendering them into the UI as an unordered list.

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


## The key attribute

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


## Don't use `index`

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
