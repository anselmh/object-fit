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

		var testStyle = document.createElement('modernizr').style,
						prop = 'object-fit';
		
		// @TODO: Add html class .objectfit | .no-objectfit
		
		return false;

	};
	
	// Apply the CSS (native or polyfilled)
	var applyObjectFit = function() {

		// default: contain, available: contain|cover
		var objectFitType =  type || 'contain';
		var supportsObjectFit = testObjectFitSupport();
		
		// If not supported apply polyfill else CSS is taken w/ html class inheritation
		if (!supportsObjectFit) {
			objectFitFill(this, type);
		}

	};
	
	// Contains the real polyfill
	var objectFitFill = function(element, parameters) {
		
		console.log(element + ' | ' + parameters);
		
		// @TODO: Refactor this poor code
		var type = typeof(parameters) === 'string' ? parameters : parameters.type,
			hideOverflow = parameters.hideOverflow === undefined ? true : parameters.hideOverflow;
			
		// Get parent computed Style
		var parent = element.parentNode,
			parentStyle = window.getComputedStyle(parent);
			
		// A function to get computed style values of an element
		function getStyleValue(element, property) {
			window.getComputedStyle(element).getProperyValue(property);
		}
		
		// Find the parent element and its aspect-ratio to fill in the image
		function findParentRatio(element) {
			var displayType = parentStyle.getPropertyValue('display');
			
			if (displayType == 'block' || displayType == 'inline-block' || displayType == '-webkit-box' && parentStyle.getPropertyValue('width') > 0) {
				return { 
					obj: parentStyle, 
					width: parentStyle.getPropertyValue('width'), 
					height: parentStyle.getPropertyValue('height'), 
					ratio: parentStyle.getPropertyValue('width') / parentStyle.getPropertyValue('height')
				};
			} else {
				// @TODO: ensure this works and if not, add a parent element as wrapper to get it working
				return findParentRatio(parentStyle);
			}
		}

		var _this = document.querySelector(element);
		var ratio = _this.data('ratio'),
			parent = findParentRatio(_this), // The parent element may not have any width or height, so find one that does
			picRealWidth,
			picRealHeight;

		var image = document.querySelector('<img>') // Make in memory copy of image to avoid css issues
			.load(function() {
				picRealWidth = getStyleValue(_this,'width');   // Note: $(this).width() will not
				picRealHeight = getStyleValue(_this,'height');; // work for in memory images.

				// set the ratio of the object. we assume, that the ratio of the object never changes.
				if (ratio === undefined) {
					ratio = picRealWidth / picRealHeight;
					_this.data('ratio', ratio);
				}

				// Set the width/height
				if (type === 'contain') {
					if (parent.ratio > ratio) {
						_this.style.width = (parent.height * ratio);
					} else {
						_this.style.height = (parent.width / ratio);
						_this.style.width = '100%';
					}
				}
				else if (type === 'cover') {
					// At least one dimension is smaller, so cover needs to size the image
					if (getStyleValue(parent, 'width') > picRealWidth || getStyleValue(parent, 'height') > picRealHeight) {
						if (parent.ratio > ratio) {
							_this.style.width = getStyleValue(parent, 'width');
							_this.style.height = getStyleValue(parent, 'height') * ratio;
						} else {
							_this.style.height = getStyleValue(parent, 'height');
							_this.style.width = getStyleValue(parent, 'width') * ratio;
						}
					}
					if (hideOverflow) {
						// Apply overflow-hidden, or it looks ugly
						parent.obj.css('overflow', 'hidden');
					}
				}
			});
		
		image.attr("src", _this.attr("src")); // Has to be done outside of assignment for IE
	};
	
	// Export into global space	
	global.objectFit = objectFitFill;

	// // Add event listener to on resize event
	// objectFit._addEventListener(window, 'onload', function() {
	// 	// Test config
	// 	var a = document.getElementById('one');
	// 	var b = 'cover';
	// 	objectFitFill(a, b);
	// });
	
	objectFit._addEventListener(window, 'resize', function() {
		// Test config
		var a = '#one'
		var b = 'cover';
		objectFitFill(a, b);
	});
	
}(window));