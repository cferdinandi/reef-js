---
title: Ignoring Elements
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 100
---

Often, using browser native features or manual DOM manipulation scripts is easier than managing every aspect of a UI in a `signal()`.

For example, the `details` and `summary` elements provide browser-native disclosure functionality without any JavaScript.

```js
let name = signal('friend');

function template () {
	return `
		<h1>Hello ${name.value}</h1>
		<details>
			<summary><strong>Tap me to open</strong></summary>
			I'm open now!
		</details>`;
}
```

When a `details` element is expanded, it has an `[open]` attribute on it. If someone interacted with that element to expand it, and then a render event happened, Reef would notice the `[open]` attribute not present in the template and remove it, collapsing it.

You can prevent Reef from diffing an element by adding the `[reef-ignore]` attribute.

```js
let name = signal('friend');

function template () {
	return `
		<h1>Hello ${name.value}</h1>
		<details reef-ignore id="disclosure">
			<summary><strong>Tap me to open</strong></summary>
			I'm open now!
		</details>`;
}
```

<div class="callout">
	⚠️ <strong>Important!</strong> It's strongly recommended that you always include an <code>id</code> or <code>[key]</code> attribute when using the <code>[reef-ignore]</code> attribute. This helps Reef identify the element when comparing the template to the DOM.
</div>

Reef will still render the element, but it won't modify any attributes or content after its initially rendered into the UI.

**[Try ignoring elements on CodePen &rarr;](https://codepen.io/cferdinandi/pen/RwEmByj)**