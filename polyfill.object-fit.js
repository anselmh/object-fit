/*!
 * Polyfill CSS object-fit
 * http://helloanselm.com/object-fit
 *
 * @author: Anselm Hannemann <hello@anselm-hannemann.com>
 * @version: 0.1.0
 *
 */

(function (global) {

	'use strict';

	// Storage variable
	var objectFit = {};

	// Detects Img Orientation
	objectFit.orientation = function(object) {
		var imgOrientation;
		var imgWidth = parseInt(window.getComputedStyle(object).width, 10);
		var imgHeight = parseInt(window.getComputedStyle(object).height, 10);

		if (imgWidth > imgHeight) {
			imgOrientation = 'landscape';
		}
		else if (imgWidth < imgHeight) {
			imgOrientation = 'portrait';
		}
		else if (imgWidth = imgHeight) {
			imgOrientation = 'square';
		}

		return imgOrientation;
	}

	// Contains the real polyfill
	objectFit.polyfill = function(object, type) {

		// Define ultimate fallback for type
		if (type === undefined) {
			var type = 'cover';
		}

		var objectSelector = document.querySelectorAll(object);
		var selectorByType;

		if (document.getElementsByClassName('object-fit-cover').length > 0) {
			type = 'cover';
			selectorByType = document.getElementsByClassName('object-fit-cover');
		}
		else if (document.getElementsByClassName('object-fit-contain').length > 0) {
			type = 'contain';
			selectorByType = document.getElementsByClassName('object-fit-contain');
		}
		else {
			type = 'cover';
			selectorByType = objectSelector;
		}

		// Wrap elements, then apply effect through CSS classes
		if (type==='cover') {
			// Wrap img elements with surrounding div
			for (var i=0; i < selectorByType.length; i++) {
				var img = selectorByType[i];
				var parent = img.parentNode;

				var imgOrientation = objectFit.orientation(img);

				var wrapper = document.createElement('div');

				var wrapperCSSClasses = 'object-fit object-fit-cover';
				var imgCSSClasses = imgOrientation;

				wrapper.setAttribute('class', wrapperCSSClasses);
				img.className += imgCSSClasses;

				parent.insertBefore(wrapper, img);
				wrapper.appendChild(img);

				return;
			}
		}
		else if (type==='contain') {
			console.log('Class found: object-fit-contain');

			// Wrap img elements with surrounding div
			for (var i = 0; i < selectorByType.length; i++) {
				var img = selectorByType[i];
				var parent = img.parentNode;

				var wrapper = document.createElement('div');
				wrapper.setAttribute('class','object-fit object-fit-contain');

				parent.insertBefore(wrapper, img);
				wrapper.appendChild(img);

				return;
			}
		}
	};

	// Export into global space
	global.objectFit = objectFit;

}(window));
