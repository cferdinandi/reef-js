---
title: signal()
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 10
anchors: true
---

The `signal()` method creates a reactive data object. 

{{<toc>}}


## Overview

The `signal()` method accepts any value as an argument. 

If no value is provided, it uses an empty object by default. If a primitive (like a string or number) is used, it returns an object with the `value` property.

```js
let {signal} = reef;

// Create a signal object
let data = signal({
	greeting: 'Hello',
	name: 'World'
});

// returns {value: 42}
let num = signal(42);
```

A `signal` emits a `reef:signal` event on the `document` whenever one of its properties is modified. 

The `event.detail` property contains the `prop` and `value` that were updated, and the `action` done to the data (either `set` or `delete`).

```js
// Listen for data changes
document.addEventListener('reef:signal', function (event) {
	console.log('The data was updated!');
	let {prop, value, action} = event.detail;
});

// Update the data
data.greeting = 'Hi there';
```

**[Try signals on CodePen &rarr;](https://codepen.io/cferdinandi/pen/NWeVBpB?editors=1111)**


## Namespaces

You can customize the event name by passing a second argument into the `signal()` method. It gets added to the end of the `reef:signal` event with a dash delimiter (`-`).

This provides useful way to differentiate updates to one `signal` from another.

```js
let wizards = signal([], 'wizards');

// A "reef:signal-wizards" event gets emitted
wizards.push('Merlin');
```

**[Try signal namespaces on CodePen &rarr;](https://codepen.io/cferdinandi/pen/JjwqBNX?editors=1111)**
