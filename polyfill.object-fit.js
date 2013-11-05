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

	// Polyfill addEventListener event
	objectFit._addEventListener = function (element, event, callback) {
		if (element.addEventListener) {
			element.addEventListener(event, callback, false);
		} else {
			element.attachEvent('on' + event, callback);
		}
	};

	// Test native support
	var testObjectFitSupport = function() {

		var testElem1 = document.createElement('modernizr');
		testElem1.id = 'testObjectFitSupportContain';
		testElem1.style.cssText = 'object-fit: contain; display: none !important;';

		var testElem2 = document.createElement('modernizr');
		testElem2.id = 'testObjectFitSupportCover';
		testElem2.style.cssText = 'object-fit: cover; display: none !important;';

		document.getElementsByTagName("body")[0].appendChild(testElem1);
		document.getElementsByTagName("body")[0].appendChild(testElem2);

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

	// Contains the real polyfill
	var objectFitFill = function(element, parameters) {

		// @TODO: Refactor this poor code
		var type = typeof(parameters) === 'string' ? parameters : parameters.type,
			hideOverflow = parameters.hideOverflow === undefined ? true : parameters.hideOverflow;

		// Get parent computed Style
		var parent = document.querySelector(element).parentNode,
			parentStyle = window.getComputedStyle(parent);

		// Find the parent element and its aspect-ratio to fill in the image
		var displayType = parentStyle.getPropertyValue('display');

		if (displayType == 'block' || displayType == 'inline-block' || displayType == '-webkit-box' && parentStyle.getPropertyValue('width') > 0) {

			var	parentObj = parentStyle,
				parentWidth = parentStyle.getPropertyValue('width'),
				parentHeight = parentStyle.getPropertyValue('height'),
				parentRatio = parseInt(parentWidth, 10) / parseInt(parentHeight, 10);
		}

		// Define the vars for the image element
		var _this = document.querySelector(element),
			picRealWidth = 0,
			picRealHeight = 0,
			image = document.querySelector('img');

		// Set the ratio of the image (assumption: never changes)
		if (ratio === undefined) {
			picRealWidth = window.getComputedStyle(_this).getPropertyValue('width');
			picRealHeight = window.getComputedStyle(_this).getPropertyValue('height');

			var ratio = parseInt(picRealWidth, 10) / parseInt(picRealHeight, 10);
		}

		// Set the width/height
		if (type === 'contain') {
			if (parentRatio > ratio) {
				_this.style.width = (parent.height * ratio);
			} else {
				_this.style.height = (parent.width / ratio);
				_this.style.width = '100%';
			}
		}
		else if (type === 'cover') {

			// At least one dimension is smaller, so cover needs to size the image
			var parentWidthValue = parseInt(parentStyle.getPropertyValue('width'), 10);
			var parentHeightValue = parseInt(parentStyle.getPropertyValue('height'), 10);
			var picRealWidthValue = parseInt(picRealWidth, 10);
			var picRealHeightValue = parseInt(picRealHeight, 10);

			// Disable max-width: 100%; to preserve aspect-ratio of the image
			_this.style.maxWidth = 'none';

			// Compare aspect ratios of parent and img element
			if (parentWidthValue > picRealWidthValue || parentHeightValue > picRealHeightValue) {

				if (parentRatio > ratio) {
					// Set img width = parent width and calc height based on ratio
					var newImgWidth = parentStyle.getPropertyValue('width'),
						newImgHeightVal = (parentWidthValue / ratio),
						newImgHeight = newImgHeightVal + 'px';

					_this.style.width = newImgWidth;
					_this.style.height = newImgHeight;
					_this.style.position = 'static';
					_this.style.left = '0';
				}
				else {
					console.log('true: ' + parentRatio + ' (parent) | (img) ' + ratio);
					// Set img height = parent height and calc width based on ratio
					var newImgWidthVal = (parentHeightValue * ratio),
						newImgWidth = newImgWidthVal + 'px',
						newImgHeight = parentStyle.getPropertyValue('height');

					_this.style.height = newImgHeight;
					_this.style.width = newImgWidth;

					console.log('parent ratio: ' + parentRatio + ' || img ratio: ' + ratio + ' || ratio diff: ' + (parentRatio / ratio) );

					// If image is large enough, try to re-center it

					if ((parentRatio / ratio) < 0.7) {
						_this.style.position = 'relative';
						_this.style.left = '-' + newImgWidthVal / 4 + 'px';
					}
				}
			}

			if (hideOverflow) {
				document.querySelector(element).parentNode.style.overflow = 'hidden';
			}
		}

		//image.setAttribute('src',_this.src); // Has to be done outside of assignment for IE
	};

	objectFit._addEventListener(window, 'load', function() {
		var objectFitSupport = testObjectFitSupport();

		if (!objectFitSupport) {
			// Test config
			var a = '#one'
			var b = 'cover';
			objectFitFill(a, b);

			objectFit._addEventListener(window, 'resize', function() {
				objectFitFill(a, b);
			});
		}
	});

	// Export into global space
	global.testObjectFitSupport = testObjectFitSupport;
	global.objectFit = objectFitFill;

}(window));
