/*!
 * A polyfill for requestAnimationFrame, based on
 * http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 *
 * @author: Anselm Hannemann (removed moz prefix as not needed anymore)
 * @author: Erik Möller
 * @author: Paul Irish
 *
 */

'use strict';

(function () {
	var lastTime = 0;

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = window['webkitRequestAnimationFrame'];
		window.cancelAnimationFrame = window['webkitCancelAnimationFrame'] || window['webkitCancelRequestAnimationFrame'];

		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);

			lastTime = currTime + timeToCall;

			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}
}());
