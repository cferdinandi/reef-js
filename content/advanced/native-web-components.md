---
title: Native Web Components
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 90
---

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
