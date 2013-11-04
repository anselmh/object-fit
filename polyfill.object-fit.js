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
	
	// A function to get computed style values of an element
	var getStyleValue = function(element, property) {
		window.getComputedStyle(element).getPropertyValue(property);
	}
	
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
			
			return false;
		}
		else if (objFitValue1 && !objFitValue2) {
			// Support for contain but not cover
			var htmlElem = document.querySelector('html');
			htmlElem.className = htmlElem.className + ' objectfit-contain';
			
			return true;
		}
		else if (!objFitValue1 && objFitValue2) {
			// Support for cover but not contain
			var htmlElem = document.querySelector('html');
			htmlElem.className = htmlElem.className + ' objectfit-cover';
			
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
		
		element = document.querySelector(element);
		
		// Get parent computed Style
		var parent = element.parentNode,
			parentStyle = window.getComputedStyle(parent);
		
		// Find the parent element and its aspect-ratio to fill in the image
		function findParentRatio(element) {
			var displayType = parentStyle.getPropertyValue('display');
			
			if (displayType == 'block' || displayType == 'inline-block' || displayType == '-webkit-box' && parentStyle.getPropertyValue('width') > 0) {
				
				var parentWidth = parentStyle.getPropertyValue('width'),
					parentHeight = parentStyle.getPropertyValue('height'),
					parentRatio = parseInt(parentWidth, 10) / parseInt(parentHeight, 10);
				console.log(parentWidth + ' | ' + parentHeight + ' | ' + parentRatio);
				
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

		var _this = element;
		// var ratio = _this.data('ratio'),
		var	parent = findParentRatio(_this), // The parent element may not have any width or height, so find one that does
			picRealWidth,
			picRealHeight;
		
		var image = document.querySelector('img');

		// Set the ratio of the image (assumption: never changes)
		if (ratio === undefined) {
			picRealWidth = getStyleValue(_this,'width');
			picRealHeight = getStyleValue(_this,'height');
			
			var ratio = picRealWidth / picRealHeight;
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
		
		image.attr("src", _this.attr("src")); // Has to be done outside of assignment for IE
	};
	
	// Export into global space
	global.objectFit = objectFitFill;
	
	objectFit._addEventListener(window, 'load', function() {
		var objectFitSupport = testObjectFitSupport();
		
		if (!objectFitSupport) {	
			objectFit._addEventListener(window, 'resize', function() {
				// Test config
				var a = '#one'
				var b = 'cover';
				objectFitFill(a, b);
			});
		}
		
	});
	
}(window));