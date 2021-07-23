---
title: "State Management"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef uses _data reactivity_ to update your UI.

Data reactivity means that the UI "reacts" to changes in your data. Update your data, and the UI automatically renders any required updates based on the new state.

```js
// Create a component
let app = new Reef('#app', {
	data: {
		greeting: 'Hello',
		name: 'world'
	},
	template: function (props) {
		return `<h1>${props.greeting}, ${props.name}!</h1>`;
	}
});

// Render the initial UI
app.render();

// This causes component to update with "Hi, universe"
app.data.greeting = 'Hi';
app.data.name = 'Universe';
```

You can also update the entire data object.

```js
// This will also update the UI
app.data = {
	greeting: 'Hi',
	name: 'Universe'
};
```

**[Try data reactivity on CodePen &rarr;](https://codepen.io/cferdinandi/pen/ExmbbzR)**

*For better performance, multiple property updates may be batched into a single, asynchronous render. You can detect when a render has been completed using [the `reef:render` event hook](/advanced/#event-hooks).*


## Non-Reactive Data

Sometimes, you want to update data _without_ updating the UI.

You can get an _immutable copy_ of your data with the `Reef.prototype.dataCopy` property. This returns an immutable, non-reactive copy of your data that won't affect the state of your component or cause a UI update.

```js
// Get an immutable copy of the app.data
let data = app.dataCopy;

// Update the copy
// This does NOT update the app.data or render a new UI
data.name = 'Universe';
```

When you're ready to update your component data, you can set the component's `data` property to your cloned copy.

```js
// Reactively update the component data
app.data = data;
```

**[Try non-reactive data on CodePen &rarr;](https://codepen.io/cferdinandi/pen/YzVEEbb)**

{{<mailchimp intro="true">}}