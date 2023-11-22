---
title: HTML Attributes
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 10
---

You can use data to conditionally include or change the value of HTML attributes in your template.

{{<toc>}}


## Form field values

To dynamically set `checked`, `selected`, and `value` attributes, prefix them with an `@` symbol. Use a _falsy value_ when the item should _not_ be `checked` or `selected`.

In the example below, the checkbox is `checked` when `agreeToTOS` is `true`.

```js
// The reactive store
let data = store({
	agreeToTOS: true
});

// The template
function template () {
	return `
		<label>
			<input type="checkbox" @checked="${agreeToTOS}">
		</label>`;
}

// The component
component('#app', template);
```


## Default values

You might instead want to use a default value when an element initially renders, but defer to any changes the user makes after that.

You can do that by prefixing your attributes with a `#` symbol.

In this example, `Merlin` has the `[selected]` attribute on it when first rendered, but will defer to whatever changes the user makes when diffing and updating the UI.

```js
function template () {
	return `
		<label for="wizards">Who is the best wizard?</label>
		<select>
			<option>Gandalf</option>
			<option #selected>Merlin</option>
			<option>Ursula</option>
		</select>`;
}
```

**[Try controlling form attributes on CodePen &rarr;](https://codepen.io/cferdinandi/pen/LYdbOdY)**
