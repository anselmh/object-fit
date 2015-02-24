/*!
 * A polyfill for Webkit's window.getMatchedCSSRules, based on
 * https://gist.github.com/ydaniv/3033012
 *
 * @author: Yehonatan Daniv
 * @author: ssafejava
 * @author: Christian "Schepp" Schaefer <schaepp@gmx.de>
 *
 */

'use strict';

(function () {
	// polyfill window.getMatchedCSSRules() in FireFox 6+
	if (typeof window.getMatchedCSSRules === 'function') {
		return;
	}

	var ELEMENT_RE = /[\w-]+/g,
		ID_RE = /#[\w-]+/g,
		CLASS_RE = /\.[\w-]+/g,
		ATTR_RE = /\[[^\]]+\]/g,
		// :not() pseudo-class does not add to specificity, but its content does as if it was outside it
		PSEUDO_CLASSES_RE = /\:(?!not)[\w-]+(\(.*\))?/g,
		PSEUDO_ELEMENTS_RE = /\:\:?(after|before|first-letter|first-line|selection)/g;

	// convert an array-like object to array
	var toArray = function (list) {
		var items = [];
		var i = 0;
		var listLength = list.length;

		for (; i < listLength; i++) {
			items.push(list[i]);
		}

		return items;
	};

	// get host of stylesheet
	var getCSSHost = function (href) {
		var fakeLinkOfSheet = document.createElement('a');

		fakeLinkOfSheet.href = href;

		return fakeLinkOfSheet.host;
	};

	// handles extraction of `cssRules` as an `Array` from a stylesheet or something that behaves the same
	var getSheetRules = function (stylesheet) {
		var sheetMedia = stylesheet.media && stylesheet.media.mediaText;
		var sheetHost;

		// if this sheet is cross-origin and option is set skip it
		if (objectFit.disableCrossDomain == 'true') {
			sheetHost = getCSSHost(stylesheet.href);

			if ((sheetHost !== window.location.host)) {
				return [];
			}
		}


		// if this sheet is disabled skip it
		if (stylesheet.disabled) {
			return [];
		}

		if (!window.matchMedia) {
			if (sheetMedia && sheetMedia.length) {
				return [];
			}
		}
		// if this sheet's media is specified and doesn't match the viewport then skip it
		else if (sheetMedia && sheetMedia.length && ! window.matchMedia(sheetMedia).matches) {
			return [];
		}

		// get the style rules of this sheet
		return toArray(stylesheet.cssRules);
	};

	var _find = function (string, re) {
		var matches = string.match(re);

		return re ? re.length : 0;
	};

	// calculates the specificity of a given `selector`
	var calculateScore = function (selector) {
		var score = [0, 0, 0];
		var parts = selector.split(' ');
		var part;
		var match;

		//TODO: clean the ':not' part since the last ELEMENT_RE will pick it up
		while (part = parts.shift(), typeof part === 'string') {
			// find all pseudo-elements
			match = _find(part, PSEUDO_ELEMENTS_RE);
			score[2] = match;
			// and remove them
			match && (part = part.replace(PSEUDO_ELEMENTS_RE, ''));
			// find all pseudo-classes
			match = _find(part, PSEUDO_CLASSES_RE);
			score[1] = match;
			// and remove them
			match && (part = part.replace(PSEUDO_CLASSES_RE, ''));
			// find all attributes
			match = _find(part, ATTR_RE);
			score[1] += match;
			// and remove them
			match && (part = part.replace(ATTR_RE, ''));
			// find all IDs
			match = _find(part, ID_RE);
			score[0] = match;
			// and remove them
			match && (part = part.replace(ID_RE, ''));
			// find all classes
			match = _find(part, CLASS_RE);
			score[1] += match;
			// and remove them
			match && (part = part.replace(CLASS_RE, ''));
			// find all elements
			score[2] += _find(part, ELEMENT_RE);
		}

		return parseInt(score.join(''), 10);
	};

	// returns the heights possible specificity score an element can get from a give rule's selectorText
	var getSpecificityScore = function (element, selectorText) {
		var selectors = selectorText.split(','),
			selector, score, result = 0;

		while (selector = selectors.shift()) {
			if (_matchesSelector(element, selector)) {
				score = calculateScore(selector);
				result = score > result ? score : result;
			}
		}

		return result;
	};

	var sortBySpecificity = function (element, rules) {
		// comparing function that sorts CSSStyleRules according to specificity of their `selectorText`
		var compareSpecificity = function (a, b) {
			return getSpecificityScore(element, b.selectorText) - getSpecificityScore(element, a.selectorText);
		};

		return rules.sort(compareSpecificity);
	};

	var customMatchesSelector = function (element, selector) {
		var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
		var i = 0;

		while (matches[i] && matches[i] !== element) {
			i++;
		}

		return matches[i] ? true : false;
	};

	// Find correct matchesSelector implementation
	var _matchesSelector = function (element, selector) {
		var matcher = function (selector) {
			if (element.matches) {
				return element.matches(selector);
			} else if (element.matchesSelector) {
				return element.matchesSelector(selector);
			} else if (element.mozMatchesSelector) {
				return element.mozMatchesSelector(selector);
			} else if (element.webkitMatchesSelector) {
				return element.webkitMatchesSelector(selector);
			} else if (element.msMatchesSelector) {
				return element.msMatchesSelector(selector);
			} else {
				return customMatchesSelector(element, selector);
			}
		};

		return matcher(selector);
	};

	//TODO: not supporting 2nd argument for selecting pseudo elements
	//TODO: not supporting 3rd argument for checking author style sheets only
	window.getMatchedCSSRules = function (element) {  /*, pseudo, author_only*/
		var styleSheets;
		var result = [];
		var sheet;
		var rules;
		var rule;

		// get stylesheets and convert to a regular Array
		styleSheets = toArray(window.document.styleSheets);

		// assuming the browser hands us stylesheets in order of appearance
		// we iterate them from the beginning to follow proper cascade order
		while (sheet = styleSheets.shift()) {
			// get the style rules of this sheet
			rules = getSheetRules(sheet);

			// loop the rules in order of appearance
			while (rule = rules.shift()) {
				// if this is an @import rule
				if (rule.styleSheet) {
					// insert the imported stylesheet's rules at the beginning of this stylesheet's rules
					rules = getSheetRules(rule.styleSheet).concat(rules);
					// and skip this rule
					continue;
				}
				// if there's no stylesheet attribute BUT there IS a media attribute it's a media rule
				else if (rule.media) {
					// insert the contained rules of this media rule to the beginning of this stylesheet's rules
					rules = getSheetRules(rule).concat(rules);
					// and skip it
					continue;
				}

				// check if this element matches this rule's selector
				if (_matchesSelector(element, rule.selectorText)) {
					// push the rule to the results set
					result.push(rule);
				}
			}
		}
		// sort according to specificity
		return sortBySpecificity(element, result);
	};
}());
