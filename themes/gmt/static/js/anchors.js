/*! vanillajs v1.5.0 | (c) 2023 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/vanilla-js-toolkit */
(function () {
	'use strict';

	/**
	 * Add links to headings
	 * @param {String} selector The headings to get in the DOM (uses querySelectorAll)
	 * @param {String} content  The content to add to the anchor link [default: #]
	 * @param {String} styles   The class(es) to add to the link [default: anchor-link]
	 */
	function addHeadingLinks (selector, content, styles) {

		// Make sure a selector was provided
		if (!selector) return;

		// Get headings
		let headings = document.querySelectorAll(selector);

		// Create link
		let link = document.createElement('a');
		link.textContent = content || '#';
		link.className = styles || 'anchor-link';

		// Add link to headings
		for (let heading of headings) {
			if (!heading.id) continue;
			let hLink = link.cloneNode(true);
			hLink.href = `#${heading.id}`;
			heading.append(' ', hLink);
		}

	}

	// Anchor links on posts
	addHeadingLinks('h2, h3, h4, h5, h6', '#', 'link-no-underline');

}());
