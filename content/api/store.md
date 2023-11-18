---
title: store()
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 40
anchors: true
---

Create a `signal()` object that can only be updated [with _action functions_](/advanced/#stores) that you define at time of creation.

It accepts the data as the first argument, and an object of _action functions_ as the second argument. Action functions automatically receive the data object as their first argument.

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

You can update your data by calling one of your action methods directly on the `store()` object. Trying to update the data directly will not work.

```js
// Access the todos
let firstTodo = todos.value[0];

// This will update the data
todos.add('Take a nap');
todos.delete('Jump');

// This WILL not
todos.value.push('Do it again tomorrow');
```

**[Try store actions on CodePen &rarr;](https://codepen.io/cferdinandi/pen/GRPaBOy?editors=1011)**

The `store()` method creates a `signal()` under-the-hood, and emits a `reef:signal` event on the `document` whenever a property is modified with an action function.

You can customize the event name by passing a third argument into the `store()` method. It gets added to the end of the `reef:signal` event with a dash delimiter (`-`).

```js
let todos = store([], {
	add (todos, todo) {
		todos.push(todo);
	},
}, 'todos');

// A "reef:signal-todos" event gets emitted
todos.add('Go to the store');
```
