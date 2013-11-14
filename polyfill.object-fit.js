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

	// Contains the real polyfill
	objectFit.polyfill = function(element, parameters) {

		var type;
		var hideOverflow;

		if(typeof(parameters) === 'string') {
			type = parameters;
		}
		else {
			type = parameters.type;
		}

		if(parameters.hideOverflow === undefined) {
			hideOverflow = true;
		}
		else {
			hideOverflow = parameters.hideOverflow;
		}

		// Get parent computed Style
		var parent = document.querySelector(element).parentNode;
		var parentStyle = window.getComputedStyle(parent);

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
				// Set img height = parent height and calc width based on ratio
				var newImgWidthVal = (parentHeightValue * ratio),
					newImgWidth = newImgWidthVal + 'px',
					newImgHeight = parentStyle.getPropertyValue('height');

				_this.style.height = newImgHeight;
				_this.style.width = newImgWidth;

				// If image is large enough, try to re-center it
				if ((parentRatio / ratio) < 0.7) {
					_this.style.position = 'relative';
					_this.style.left = '-' + newImgWidthVal / 4 + 'px';
				}
			}

			if (hideOverflow) {
				document.querySelector(element).parentNode.style.overflow = 'hidden';
			}
		}
	};

	// Export into global space
	global.objectFit = objectFit;

}(window));
