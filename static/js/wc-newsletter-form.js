customElements.define('newsletter-form', class extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();

		// Add a form status element
		this.announce = this.querySelector('[role="status"]') || document.createElement('div');
		this.announce.setAttribute('role', 'status');

		// Set base properties
		this.form = this.querySelector('form');
		this.form.append(this.announce);

		// Define options
		this.msgSubmitting = this.getAttribute('msg-submitting') ?? 'Submitting...';

		// Listen for events
		this.form.addEventListener('submit', this);

	}

	/**
	 * Handle events on the component
	 * @param  {Event} event The event object
	 */
	handleEvent(event) {
		this[`on${event.type}`](event);
	}

	/**
	 * Handle submit events
	 * @param  {Event} event The event object
	 */
	async onsubmit (event) {

		// Stop form from reloading the page
		event.preventDefault();

		// If the form is already submitting, do nothing
		// Otherwise, disable future submissions
		if (this.isDisabled()) return;
		this.disable();

		// Show status message
		this.showStatus(this.msgSubmitting, true);

		try {

			// Call the API
			let {action, method} = this.form;
			let response = await fetch(action, {
				method,
				body: new FormData(this.form),
				headers: {
					'Accept': 'application/json'
				}
			});

			// Get the response data
			let data = await response.json();

			// If there's an error, throw
			if (!response.ok) throw data;

			// If message, display it
			if (data.msg) {
				this.showStatus(data.msg, true);
			}

			// If URL, redirect
			if (data.redirect) {
				window.location.href = data.redirect;
			}

			// Clear the form
			this.reset();

		} catch (error) {
			console.warn(error);
			this.showStatus(error.message);
		} finally {
			this.enable();
		}

	}

	/**
	 * Disable a form so I can't be submitted while waiting for the API
	 */
	disable () {
		this.setAttribute('form-submitting', '');
	}

	/**
	 * Enable a form after the API returns
	 */
	enable () {
		this.removeAttribute('form-submitting');
	}

	/**
	 * Check if a form is submitting to the API
	 * @return {Boolean} If true, the form is submitting
	 */
	isDisabled () {
		return this.hasAttribute('form-submitting');
	}

	/**
	 * Update the form status in a field
	 * @param  {String} msg     The message to display
	 * @param {Boolean} success If true, add success class
	 */
	showStatus (msg, success) {
		this.announce.innerHTML = msg;
		this.announce.className = success ? 'success-message' : 'error-message';
	}

	/**
	 * Reset the form element values
	 */
	reset () {
		this.form.reset();
	}

});