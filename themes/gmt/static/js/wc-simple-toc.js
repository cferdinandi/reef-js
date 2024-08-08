customElements.define('simple-toc', class extends HTMLElement {

	/**
	 * Instantiate the Web Component
	 */
	constructor () {

		// Get parent class properties
		super();

		// Generate HTML
		let heading = this.getAttribute('heading');
		let navList = Array.from(document.querySelectorAll('h2')).map(function (heading) {
			if (!heading.id) {
				heading.id = `toc_${crypto.randomUUID()}`;
			}
			return `<li><a class="link-no-underline link-no-visited" href="#${heading.id}">${heading.textContent}</a></li>`;
		}).join('');

		// Make sure a navList exists
		if (navList.length < 1) return;

		// Render the HTML
		this.innerHTML = `<ul class="list-inline">${heading ? `<li><strong>${heading}</strong></li>` : ''}${navList}</ul>`;

	}

});