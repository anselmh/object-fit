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
	
	objectFit._debug = true;

	objectFit.getComputedStyle = function(element, context) {
		var context = context || window;

		if (context.getComputedStyle) {
			return context.getComputedStyle(element, null);
		}
		else {
			return element.currentStyle;
		}
	}

	objectFit.getDefaultComputedStyle = function(element){
		var newelement = element.cloneNode(true);
		var styles = {}
		var iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write('<body></body>');
		iframe.contentWindow.document.body.appendChild(newelement);
		iframe.contentWindow.document.close();
		
		var defaultElement = iframe.contentWindow.document.querySelectorAll(element.nodeName.toLowerCase())[0];
		var defaultComputedStyle = this.getComputedStyle(defaultElement, iframe.contentWindow);
		
		for (var property in defaultComputedStyle) {
			var value = defaultComputedStyle.getPropertyValue ? defaultComputedStyle.getPropertyValue(property) : defaultComputedStyle[property];
			if (value !== null) {
				switch (property) {
					default:
						styles[property] = value;
					break;
					
					case 'width':
					case 'height':
					case 'minWidth':
					case 'minHeight':
					case 'maxWidth':
					case 'maxHeight':
					break;
				}
			}
		}
		
		document.body.removeChild(iframe);

		return styles;
	}
	
	objectFit.getMatchedStyle = function(element, property){
		// element property has highest priority
		var val = element.style.getPropertyValue ? element.style.getPropertyValue(property) : element.currentStyle[property];
	
		// if it's important, we are done
		if (val !== null) return val;
	
		// get matched rules
		var rules = getMatchedCSSRules(element);
	
		// iterate the rules backwards
		// rules are ordered by priority, highest last
		for (var i = rules.length; i --> 0;){
			var r = rules[i];
	
			var important = r.style.getPropertyPriority(property);
	
			// if set, only reset if important
			if (val === null || important) {
				val = r.style.getPropertyValue(property);
	
				// done if important
				if (important) break;
			}
		}
	
		return val;
	}
	
	// Detects orientation
	objectFit.orientation = function(replacedElement) {
		if (replacedElement.parentNode.nodeName.toLowerCase() === 'x-object-fit') {
			var width = replacedElement.naturalWidth || replacedElement.clientWidth;
			var height = replacedElement.naturalHeight || replacedElement.clientHeight;
			var parentWidth = replacedElement.parentNode.clientWidth;
			var parentHeight = replacedElement.parentNode.clientHeight;
	
			if (!height || width / height > parentWidth / parentHeight) {
				replacedElement.className = ' x-object-fit-wider';
				if (this._debug && window.console) console.log('x-object-fit-wider');
			} else {
				replacedElement.className = 'x-object-fit-taller';
				if (this._debug && window.console) console.log('x-object-fit-taller');
			}
		}
	}

	// Contains the real polyfill
	objectFit.process = function(args) {
		if(!args.selector) return;
		args.fittype = args.fittype || 'none';
		switch (args.fittype) {
			default:
				return;
			break;
			
			case 'none':
			case 'fill':
			case 'contain':
			case 'cover':
			break;
		}
		
		var replacedElements = document.querySelectorAll(args.selector);
		if(!replacedElements.length) return;
		
		for (var i = 0, replacedElements_length = replacedElements.length; i < replacedElements_length; i++) {
			(function(){
				var replacedElement = replacedElements[i];
				
				var replacedElementStyles = objectFit.getComputedStyle(replacedElement);
				var replacedElementDefaultStyles = objectFit.getDefaultComputedStyle(replacedElement);
				
				var wrapperElement = document.createElement('x-object-fit');
				
				if (objectFit._debug && window.console) console.log('Applying to WRAPPER-------------------------------------------------------');
				for (var property in replacedElementStyles) {
					var value = objectFit.getMatchedStyle(replacedElement,property); //replacedElementStyles.getPropertyValue(property);
					if (value !== null) {
						if (objectFit._debug && window.console) console.log(property + ': ' + value);
						wrapperElement.style[property] = value;
					}
				}
	
				if (objectFit._debug && window.console) console.log('Applying to REPLACED ELEMENT-------------------------------------------------------');
				for (var property in replacedElementDefaultStyles) {
					var value = replacedElementDefaultStyles[property];
					if (objectFit._debug && window.console) console.log(property + ': ' + value);
					replacedElement.style[property] = value;
				}
	
				wrapperElement.setAttribute('class','x-object-fit-' + args.fittype);
				replacedElement.parentNode.insertBefore(wrapperElement, replacedElement);
				wrapperElement.appendChild(replacedElement);
				
				objectFit.orientation(replacedElement);
	
				var resizeTimer = null;
				var resizeAction = (function(){
					if(resizeTimer !== null) window.clearTimeout(resizeTimer);
					resizeTimer = window.setTimeout(function(){
						objectFit.orientation(replacedElement);
					},50);
				});
				
				switch (args.fittype) {
					default:
					break;
					
					case 'contain':
					case 'cover':
						if (window.addEventListener) {
							window.addEventListener('resize', resizeAction, false);
							window.addEventListener('orientationchange', resizeAction, false);
						} else {
							window.attachEvent('onresize', resizeAction);
						}
					break;
				}
			})();
		}
	};
	
	objectFit.init = function(args) {
		if(!args) return;

		if (typeof args === 'Array') {
			for (var i = 0, args_length = args.length; i < args_length; i++) {
				this.process(args[i]);
			}
		}
		else {
			this.process(args);
		}
	}
	
	objectFit.polyfill = function(args) {
		if('objectFit' in document.documentElement.style === false) {
			if (window.addEventListener) {
				window.addEventListener('load', function(){objectFit.init(args)}, false);
			} else {
				window.attachEvent('onload', function(){objectFit.init(args)});
			}
		}
	}

	// Export into global space
	global.objectFit = objectFit;

}(window));
