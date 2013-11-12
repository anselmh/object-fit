/*!
 * CSS object-fit Browser Support Test
 * http://helloanselm.com/object-fit
 *
 * @author: Anselm Hannemann <hello@anselm-hannemann.com>
 * @version: 0.1.0
 *
 */

(function (global) {

	'use strict';

	// Storage variable
	var objectFitTest = {};

	// Test native browser support (Standalone, you can also use Modernizr instead)
	objectFitTest.testSupport = function() {

		var testElem1 = document.createElement('div');
		testElem1.id = 'testObjectFitSupportContain';
		testElem1.style.cssText = 'object-fit: contain; display: none !important;';

		var testElem2 = document.createElement('div');
		testElem2.id = 'testObjectFitSupportCover';
		testElem2.style.cssText = 'object-fit: cover; display: none !important;';

		document.getElementsByTagName('body')[0].appendChild(testElem1);
		document.getElementsByTagName('body')[0].appendChild(testElem2);

		var createdElem1 = document.querySelector('#testObjectFitSupportContain');
		var createdElem2 = document.querySelector('#testObjectFitSupportCover');

		var objFitValue1 = window.getComputedStyle(createdElem1).getPropertyValue('object-fit');
		var objFitValue2 = window.getComputedStyle(createdElem2).getPropertyValue('object-fit');

		if (!objFitValue1 || !objFitValue2) {
			// No support for object-fit
			var htmlElem = document.querySelector('html');
			htmlElem.className = htmlElem.className + ' no-objectfit';

			// Remove helper element from DOM
			// @TODO: Avoid doubled code here
			if (createdElem1) {
				createdElem1.parentNode.removeChild(createdElem1);
			}
			if (createdElem2) {
				createdElem2.parentNode.removeChild(createdElem2);
			}

			return false;
		}
		else if (objFitValue1 && !objFitValue2) {
			// Support for contain but not cover
			var htmlElem = document.querySelector('html');
			htmlElem.className = htmlElem.className + ' objectfit-contain';

			// Remove helper element from DOM
			// @TODO: Avoid doubled code here
			if (createdElem1) {
				createdElem1.parentNode.removeChild(createdElem1);
			}
			if (createdElem2) {
				createdElem2.parentNode.removeChild(createdElem2);
			}

			return true;
		}
		else if (!objFitValue1 && objFitValue2) {
			// Support for cover but not contain
			var htmlElem = document.querySelector('html');
			htmlElem.className = htmlElem.className + ' objectfit-cover';

			// Remove helper element from DOM
			// @TODO: Avoid doubled code here
			if (createdElem1) {
				createdElem1.parentNode.removeChild(createdElem1);
			}
			if (createdElem2) {
				createdElem2.parentNode.removeChild(createdElem2);
			}

			return true;
		}
		else {
			// Full support for contain and cover
			var htmlElem = document.querySelector('html');
			htmlElem.className = htmlElem.className + ' objectfit';

			// Remove helper element from DOM
			// @TODO: Avoid doubled code here
			if (createdElem1) {
				createdElem1.parentNode.removeChild(createdElem1);
			}
			if (createdElem2) {
				createdElem2.parentNode.removeChild(createdElem2);
			}

			return true;
		}

		// Remove helper element from DOM
		// @TODO: Avoid doubled code here
		if (createdElem1) {
			createdElem1.parentNode.removeChild(createdElem1);
		}
		if (createdElem2) {
			createdElem2.parentNode.removeChild(createdElem2);
		}

		return false;

	};

	objectFitTest.testSupport();

	// Export into global space
	global.objectFitTest = objectFitTest;

}(window));
