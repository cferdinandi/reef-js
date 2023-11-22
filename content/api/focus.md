---
title: focus()
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 50
anchors: true
---

The `focus()` method sets focus on an element after the next UI render.

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
