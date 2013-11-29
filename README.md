# Polyfill for CSS `object-fit` property

This is a headless polyfill for the CSS object-fit property which defines the sizing mode for content images (similar to background-size for CSS background sources).

## The Webstandard

The Specification for `object-fit` is to be found at [W3C CSS3 Images](http://www.w3.org/TR/css3-images/#the-object-fit).
Basically it works like this:

	img {
		width: 100%;
		height: 35em;

		object-fit: cover;
		overflow: hidden;
	}

Normally, the image would be stretched but due to the usage of the CSS property `object-fit: cover;` the image now is resized proportionally to the full width of the parent element but limited in the height.

## How the polyfill works

## Feature Detection

The polyfill uses a feature detection method to see if object-fit is supported. The function is to be found in [polyfill.object-fit.min.js](https://github.com/anselmh/object-fit/blob/master/dist/polyfill.object-fit.min.js):

	objectFit.polyfill = function(args) {
		if('objectFit' in document.documentElement.style === false) {
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
	};

This tests if the CSS property `object-fit` is defined in the Browser and conditonally loads the polyfill if it isn't.

## Browser Support

This polyfill works in all major browsers as well as in IE8+.

|  Google Chrome  |  yes  |  (from v31 natively via experimental flag)  |
|  Opera  |  14+  |  (from v18 natively via experimental flag)  |
|  Firefox  |  4+  |  (vote for [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=624647))  |
|  Internet Explorer  |  8+  |  (not implemented yet)  |

## Setup / Usage

This polyfill is available as Bower component. Use it right away from bower:

	$ bower install object-fit

Or set up manually by grabbing the [download from GitHub](https://github.com/anselmh/object-fit/releases).
Then include the CSS file [`polyfill.object-fit.css`](https://github.com/anselmh/object-fit/blob/master/dist/polyfill.object-fit.css) in your HTML `<head>`, the JavaScript file [`polyfill.object-fit.min.js`](https://github.com/anselmh/object-fit/blob/master/dist/polyfill.object-fit.min.js) at the bottom of your HTML `<body>`. Right behind the JavaScript file reference you now need to call the polyfill:

	<script>
		objectFit.polyfill({
			selector: 'img', // this can be any CSS selector
			fittype: 'cover' // either contain, cover, fill or none
		});
	</script>

You can find sample implementations in our [test directory](https://github.com/anselmh/object-fit/tree/master/tests).

## Known errors and bugs

- **iOS7** has a bug that the resize event is not fired when the toolbar changes (height) in Safari. This could (depending on your usage of object-fit) lead to a not updated recalculation in those edge-cases. There is currently no way to work around this but anyhow it is really an edge-case.

- If you use [art-directed images](http://usecases.responsiveimages.org/#art-direction) on your page, please don't run them through the polyfill as it assumes the aspect-ratio never changes for an img source and it doesn't detect src-changes through a script.

----


## Author

This polyfill is written by [Anselm Hannemann](http://helloanselm.com/) and [Christian "Schepp" Schaefer](https://twitter.com/derSchepp). Follow them on Twitter via [@helloanselm](https://twitter.com/helloanselm) and [@derSchepp](https://twitter.com/derSchepp) or check their GitHub profiles via [anselmh](http://github.com/anselmh/) and [Schepp](http://github.com/Schepp/) for more information.

## License

This project is under the MIT Open Source License. [See the LICENSE file](LICENSE.md) for more information.
