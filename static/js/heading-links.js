/**
 * Add links to headings
 */
(function () {

	// Get headings
	let headings = document.querySelectorAll('h2, h3, h4, h5, h6');

	// Create link
	let link = document.createElement('a');
	link.textContent = '#';
	link.className = 'link-no-underline';
	link.setAttribute('aria-hidden', true);

	// Add link to headings
	for (let heading of headings) {
		if (!heading.id) continue;
		let hLink = link.cloneNode(true);
		hLink.href = `#${heading.id}`;
		heading.append(' ', hLink);
	}

})();