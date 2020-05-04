---
title: "State Management"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef uses *data reactivity* to update your UI.

Data reactivity means that the UI "reacts" to changes in your data. Update your data, and the UI automatically renders any required updates based on the new state.

```js
// Create a component and render it
var app = new Reef('#app', {
	data: {
		greeting: 'Hello',
		name: 'world'
	},
	template: function (props) {
		return `<h1>${props.greeting}, ${props.name}!</h1>`;
	}
});
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

**[Try data reactivity on CodePen &rarr;](https://codepen.io/cferdinandi/pen/MWarYLP)**


## Non-Reactive Data

Sometimes, you want to update data *without* updating the UI.

You can get an *immutable copy* of your data by passing it into the `Reef.clone()` method. This creates a non-reactive copy of your data that won't affect the state of your component.

```js
// Create an immutable copy of the app.data
var data = Reef.clone(app.data);

// Update the copy
// This does NOT update the app.data or render a new UI
data.name = 'Universe';
```

When you're ready to update your component data, you can set the component's `data` property to your cloned copy.

```js
// Reactively update the component data
app.data = data;
```

**[Try non-reactive data on CodePen &rarr;](https://codepen.io/cferdinandi/pen/vYNpEPX)**

_**Note:** You can use the `Reef.clone()` method to create an immutable copy of any array or object, not just your component data._

{{<mailchimp intro="true">}}