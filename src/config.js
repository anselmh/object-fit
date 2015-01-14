/**
 * RequireJS configuration
 */
require.config({
	// Initialize the application with the main application file
	deps: [
		'plugins/polyfill.rAF',
		'plugins/polyfill.dom-console',
		'plugins/polyfill.css-syntax',
		'plugins/polyfill.css-style',
		'plugins/polyfill.css-cascade',
		'plugins/polyfill.dom-events',
		'plugins/polyfill.dom-query-selector-live',
		'plugins/polyfill.dom-experimental-event-streams',
		'polyfill.object-fit.core'
		// 'plugins/polyfill.polyfill.getMatchedCSSRules',
	],

	paths: {
		// More additional paths here
	},

	shim: {
		// If you need to shim anything, put it here
	},

	// Prevent caching issues, by adding an additional URL argument
	urlArgs: 'bust=' + (new Date()).getDate()
});
