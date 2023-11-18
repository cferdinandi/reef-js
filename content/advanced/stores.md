---
title: Stores
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 60
---

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
