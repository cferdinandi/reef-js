// Initialize the service worker
if (navigator && navigator.serviceWorker) {
	navigator.serviceWorker.register('/sw.js');
}

// Cleanup old cache on page load
if (navigator.serviceWorker.controller) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.controller.postMessage('cleanUp');
	});
}