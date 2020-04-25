---
title: "State Management"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

Reef provides two different ways to manage your state: reactive and manual.

<div id="table-of-contents"></div>

## Data Reactivity

Data reactivity means that the UI "reacts" to changes in your data. Update your data, and the UI automatically renders any required updates based on the new state.

You can get an immutable clone of your current state using the `getData()` method. This lets you make any updates or changes you want without affecting the actual state of your component.

```js
var data = app.getData();
data.greeting = 'Hi there';
```

When you're ready to update your state, use the `setData()` method to update the state *and* cause the UI to render (if anything has changed).

The `setData()` method accepts an object with your changed state as an argument. You don't need to pass in the whole state again---only what's changed.

```js
// Pass in an entirely new state
app.setData({
	greeting: 'Hi there',
	name: 'universe'
});

// Or update just one key
app.setData({greeting: 'Hi there'});
```

**[Try data reactivity on CodePen &rarr;](https://codepen.io/cferdinandi/pen/RXeapE)**


## Manual State

Sometimes, you want more manual control over when your UI renders again.

You can update your component's state by directly accessing the `data` property of the component. After updating your state, run the `.render()` method again to update the DOM.

```js
app.data.greeting = 'Hi there';
app.data.name = 'universe';
app.render();
```

**[Try manual state management on CodePen &rarr;](https://codepen.io/cferdinandi/pen/GVYZWe)**

{{<mailchimp intro="true">}}