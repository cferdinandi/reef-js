/*! vanillajs v1.5.0 | (c) 2023 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/vanilla-js-toolkit */
(function () {
	'use strict';

	function tableOfContents () {

		// Get the nav
		let nav = document.querySelector('[data-toc]');
		if (!nav) return;

		// Show heading
		let heading = nav.getAttribute('data-toc');

		// Variables
		let navList = Array.from(document.querySelectorAll('h2')).map(function (heading) {
			if (!heading.id) return '';
			return `<li><a class="link-no-underline link-no-visited" href="#${heading.id}">${heading.textContent}</a></li>`;
		}).join('');

		// Make sure a navList exists
		if (navList.length < 1) return;

		nav.innerHTML =
			`<ul class="list-inline">${heading ? `<li><strong>${heading}</strong></li>` : ''}${navList}</ul>`;

	}
	tableOfContents();

}());
