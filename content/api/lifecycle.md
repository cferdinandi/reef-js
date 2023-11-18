---
title: Lifecycle Events
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 60
anchors: true
---

Reef emits custom events throughout the lifecycle of a reactive signal or component.

- **`reef:signal`** is emitted when a signal is modified. The `event.detail` property contains the `prop` and `value` that were changed, and the `action` that was done to the data.
- **`reef:start`** is emitted on a component element when reef starts listening for reactive data changes.
- **`reef:stop`** is emitted on a component element when reef stops listening for reactive data changes.
- **`reef:before-render`** is emitted on a component element before it renders a UI update. Running the `event.preventDefault()` method will cancel the render.
- **`reef:render`** is emitted on a component element when reef renders a UI update.

You can listen for Reef events with the `Element.addEventListener()` method.

```js
// Log whenever an element is rendered into
document.addEventListener('reef:render', function (event) {
	console.log('The UI was just updated inside this element.');
	console.log(event.target);
});
```