/*!
 * Polyfill CSS object-fit
 * http://helloanselm.com/object-fit
 *
 * @author: Anselm Hannemann <hello@anselm-hannemann.com>
 * @author: Christian "Schepp" Schaefer <schaepp@gmx.de>
 * @version: 0.3.4
 *
 */

(function (global) {

	'use strict';

	// Storage variable
	var objectFit = {};

	objectFit._debug = false;

	objectFit.observer = null;

	objectFit.disableCrossDomain = 'false';

	objectFit.getComputedStyle = function(element, context) {
		context = context || window;

		if (context.getComputedStyle) {
			return context.getComputedStyle(element, null);
		}
		else {
			return element.currentStyle;
		}
	};

	objectFit.getDefaultComputedStyle = function(element){
		var newelement = element.cloneNode(true);
		var styles = {};
		var iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write('<body></body>');
		iframe.contentWindow.document.body.appendChild(newelement);
		iframe.contentWindow.document.close();

		var defaultElement = iframe.contentWindow.document.querySelectorAll(element.nodeName.toLowerCase())[0];
		var defaultComputedStyle = this.getComputedStyle(defaultElement, iframe.contentWindow);
		var value;
		var property;

		for (property in defaultComputedStyle) {
			if (defaultComputedStyle.getPropertyValue === true) {
				value = defaultComputedStyle.getPropertyValue(property);
			} else {
				value = defaultComputedStyle[property];
			}

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
	};

	objectFit.getMatchedStyle = function(element, property){
		// element property has highest priority
		var val = null;
		var inlineval = null;

		if (element.style.getPropertyValue) {
			inlineval = element.style.getPropertyValue(property);
		} else if (element.currentStyle) {
			inlineval = element.currentStyle[property];
		}

		// get matched rules
		var rules = window.getMatchedCSSRules(element);
		var i = rules.length;
		var r;
		var important;

		if (i) {
			// iterate the rules backwards
			// rules are ordered by priority, highest last
			for (; i --> 0;) {
				r = rules[i];
				important = r.style.getPropertyPriority(property);

				// if set, only reset if important
				if (val === null || important) {
					val = r.style.getPropertyValue(property);

					// done if important
					if (important) {
						break;
					}
				}
			}
		}

		// if it's important, we are done
		if (!val && inlineval !== null) {
			val = inlineval;
		}

		return val;
	};

	// Detects orientation
	objectFit.orientation = function(replacedElement) {
		if (replacedElement.parentNode && replacedElement.parentNode.nodeName.toLowerCase() === 'x-object-fit') {
			var width = replacedElement.naturalWidth || replacedElement.clientWidth;
			var height = replacedElement.naturalHeight || replacedElement.clientHeight;
			var parentWidth = replacedElement.parentNode.clientWidth;
			var parentHeight = replacedElement.parentNode.clientHeight;

			if (!height || width / height > parentWidth / parentHeight) {
				if (replacedElement.getAttribute('data-x-object-relation') !== 'wider') {
					replacedElement.setAttribute('data-x-object-relation','wider');
					replacedElement.className = 'x-object-fit-wider';

					if (this._debug && window.console) {
						console.log('x-object-fit-wider');
					}
				}
			} else {
				if (replacedElement.getAttribute('data-x-object-relation') !== 'taller') {
					replacedElement.setAttribute('data-x-object-relation','taller');
					replacedElement.className = 'x-object-fit-taller';

					if (this._debug && window.console) {
						console.log('x-object-fit-taller');
					}
				}
			}
		}
	};

	objectFit.process = function(args) {
		if (!args.selector || !args.replacedElements) {
			return;
		}

		// Set option objectFit.disableCrossDomain
		objectFit.disableCrossDomain = args.disableCrossDomain || 'false';

		// Set option fit-type
		args.fittype = args.fittype || 'none';

		switch (args.fittype) {
			default:
				return;

			case 'none':
			case 'fill':
			case 'contain':
			case 'cover':
			break;
		}

		// Set option replacedElements
		var replacedElements = args.replacedElements;

		if(!replacedElements.length) {
			return;
		}

		for (var i = 0, replacedElementsLength = replacedElements.length; i < replacedElementsLength; i++) {
			this.processElement(replacedElements[i], args);
		}
	};

	objectFit.processElement = function(replacedElement, args) {
		var property;
		var value;
		var replacedElementStyles = objectFit.getComputedStyle(replacedElement);
		var replacedElementDefaultStyles = objectFit.getDefaultComputedStyle(replacedElement);
		var wrapperElement = document.createElement('x-object-fit');

		if (objectFit._debug && window.console) {
			console.log('Applying to WRAPPER-------------------------------------------------------');
		}

		for (property in replacedElementStyles) {
			switch (property) {
				default:
					value = objectFit.getMatchedStyle(replacedElement, property);

					if (value !== null && value !== '') {
						if (objectFit._debug && window.console) {
							console.log(property + ': ' + value);
						}

						wrapperElement.style[property] = value;
					}
				break;

				case 'length':
				case 'parentRule':
				break;
			}
		}

		if (objectFit._debug && window.console) {
			console.log('Applying to REPLACED ELEMENT-------------------------------------------------------');
		}
		for (property in replacedElementDefaultStyles) {
			switch (property) {
				default:
					value = replacedElementDefaultStyles[property];

					if (objectFit._debug && window.console && value !== '') {
						console.log(property + ': ' + value);

						if (replacedElement.style[property] === undefined) {
							console.log('Indexed style properties (`' + property + '`) not supported in: ' + window.navigator.userAgent);
						}
					}

					if (replacedElement.style[property]) {
						replacedElement.style[property] = value; // should work in Firefox 35+ and all other browsers
					} else {
						replacedElement.style.property = value;
					}
				break;

				case 'length':
				case 'parentRule':
				break;
			}
		}

		wrapperElement.setAttribute('class','x-object-fit-' + args.fittype);
		replacedElement.parentNode.insertBefore(wrapperElement, replacedElement);
		wrapperElement.appendChild(replacedElement);

		objectFit.orientation(replacedElement);

		var resizeTimer = null;
		var resizeAction = function () {
			if (resizeTimer !== null) {
				window.cancelAnimationFrame(resizeTimer);
			}
			resizeTimer = window.requestAnimationFrame(function(){
				objectFit.orientation(replacedElement);
			});
		};

		switch (args.fittype) {
			default:
			break;

			case 'contain':
			case 'cover':
				if (window.addEventListener) {
					replacedElement.addEventListener('load', resizeAction, false);
					window.addEventListener('resize', resizeAction, false);
					window.addEventListener('orientationchange', resizeAction, false);
				} else {
					replacedElement.attachEvent('onload', resizeAction);
					window.attachEvent('onresize', resizeAction);
				}
			break;
		}
	};

	objectFit.listen = function (args) {
		var domInsertedAction = function (element){
			var i = 0;
			var argsLength = args.length;

			for (; i < argsLength; i++) {
				if ((element.mozMatchesSelector && element.mozMatchesSelector(args[i].selector)) ||
					(element.msMatchesSelector && element.msMatchesSelector(args[i].selector)) ||
					(element.oMatchesSelector && element.oMatchesSelector(args[i].selector)) ||
					(element.webkitMatchesSelector && element.webkitMatchesSelector(args[i].selector))
				) {
					args[i].replacedElements = [element];
					objectFit.process(args[i]);

					if (objectFit._debug && window.console) {
						console.log('Matching node inserted: ' + element.nodeName);
					}
				}
			}
		};

		var domInsertedObserverFunction = function (element) {
			objectFit.observer.disconnect();
			domInsertedAction(element);
			objectFit.observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		};

		var domInsertedEventFunction = function (event) {
			window.removeEventListener('DOMNodeInserted', domInsertedEventFunction, false);
			domInsertedAction(event.target);
			window.addEventListener('DOMNodeInserted', domInsertedEventFunction, false);
		};

		var domRemovedAction = function (element) {
			if (element.nodeName.toLowerCase() === 'x-object-fit') {
				element.parentNode.removeChild(element);

				if (objectFit._debug && window.console) {
					console.log('Matching node removed: ' + element.nodeName);
				}
			}
		};

		var domRemovedObserverFunction = function (element) {
			objectFit.observer.disconnect();
			domRemovedAction(element);
			objectFit.observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		};

		var domRemovedEventFunction = function (event) {
			window.removeEventListener('DOMNodeRemoved', domRemovedEventFunction, false);
			domRemovedAction(event.target.parentNode);
			window.addEventListener('DOMNodeRemoved', domRemovedEventFunction, false);
		};

		if (window.MutationObserver) {
			if (objectFit._debug && window.console) {
				console.log('DOM MutationObserver');
			}

			this.observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.addedNodes && mutation.addedNodes.length) {
						var nodes = mutation.addedNodes;
						for (var i = 0, nodesLength = nodes.length; i < nodesLength; i++) {
							domInsertedObserverFunction(nodes[i]);
						}
					}
					if (mutation.removedNodes && mutation.removedNodes.length) {
						domRemovedObserverFunction(mutation.target);
					}
				});
			});

			this.observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		} else if (window.addEventListener) {
			if (objectFit._debug && window.console) {
				console.log('DOM Mutation Events');
			}

			window.addEventListener('DOMNodeInserted', domInsertedEventFunction, false);
			window.addEventListener('DOMNodeRemoved', domRemovedEventFunction, false);
		}
	};

	objectFit.init = function (args) {
		if (!args) {
			return;
		}

		if (!(args instanceof Array)) {
			args = [args];
		}

		var i = 0;
		var argsLength = args.length;

		for (; i < argsLength; i++) {
			args[i].replacedElements = document.querySelectorAll(args[i].selector);
			this.process(args[i]);
		}

		this.listen(args);
	};

	objectFit.polyfill = function (args) {
		if('objectFit' in document.documentElement.style === false) {
			if (objectFit._debug && window.console) {
				console.log('object-fit not natively supported');
			}

			// If the library is loaded after document onload event
			if (document.readyState === 'complete') {
				objectFit.init(args);
			} else {
				// Otherwise attach event listeners
				if (window.addEventListener) {
					window.addEventListener('load', function(){
						objectFit.init(args);
					}, false);
				} else {
					window.attachEvent('onload', function(){
						objectFit.init(args);
					});
				}
			}
		} else {
			if (objectFit._debug && window.console) {
				console.log('object-fit natively supported');
			}
		}
	};

	/*
	 * AMD, module loader, global registration
	 */

	// Expose modal for loaders that implement the Node module pattern.
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = objectFit;

	// Register as an AMD module
	} else if (typeof define === 'function' && define.amd) {
		define([], function () { return objectFit; });

	// Export into global space
	} else if (typeof global === 'object' && typeof global.document === 'object') {
		global.objectFit = objectFit;
	}

}(window));
