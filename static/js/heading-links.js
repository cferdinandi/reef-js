/**
 * Add links to headings
 */
(function () {

	// Get headings
	let headings = document.querySelectorAll('h2, h3, h4, h5, h6');

	// Create link
	let link = document.createElement('a');
	link.className = 'anchor-link';

	// Add link to headings
	for (let heading of headings) {
		if (!heading.id) continue;
		heading.innerHTML =
			`<a class="anchor-link" href="#${heading.id}">
				${heading.innerHTML} <span class="anchor-link-icon" aria-hidden="true">#</span>
			</a>`;
	}

})();