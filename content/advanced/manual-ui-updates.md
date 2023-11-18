---
title: Manual UI Updates
date: 2018-01-24T11:48:20-05:00
draft: false
weight: 80
---

If you have a more simple UI component, you can combine the `signal()` method with the `Element.addEventListener()` to manually update your UI instead of using the `render()` function.

For example, imagine you have an element that displays the number of items in a shopping cart.

```html
Cart (<span id="cart-items">0</span>)
```

Rather than diffing the DOM every time that number of items changes, you can listen for data updates and use the `Element.textContent` property to manually update the UI. It will be faster and simpler.

```js
// Get the cart element
let cartCount = document.querySelector('#cart-items');

// Create a reactive store
let cart = signal([], 'cart');

// Update how many cart items are displayed in the UI
document.addEventListener('reef:signal-cart', function () {
	cartCount.textContent = cart.length;
});

// Add an item to the cart
// The UI will automatically be updated
cart.push({
	item: 'T-Shirt',
	size: 'M',
	cost: 29
});
```

**[Try manual UI updates on CodePen &rarr;](https://codepen.io/cferdinandi/pen/JjwqBvR)**
