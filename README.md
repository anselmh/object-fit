# Polyfill for CSS `object-fit` property

This is a headless polyfill for the CSS object-fit property which defines the sizing mode for content images (similar to background-size for CSS background sources).

## The Webstandard

The Specification for `object-fit` is to be found at [W3C CSS3 Images](http://www.w3.org/TR/css3-images/#the-object-fit).

## How the polyfill works

## Feature Detection

The polyfill uses a feature detection method to see if object-fit is supported.

## Browser Support

This polyfill works in all major browsers as well as in IE8+.

## Setup / Usage

This polyfill is available as Bower component. Use it right away from bower:

	$ bower install object-fit

Or set up manually by grabbing the download from GitHub.
Then put the CSS file at the top, the JavaScript file at the bottom of your HTML. Right behind the JavaScript put the following JavaScript:

	<script>
		objectFit.polyfill({
			selector: 'img', // this can be any CSS selector
			fittype: 'contain' // either contain, cover, fill or none
		});
	</script>


## Known errors and bugs

- **iOS7** has a bug that the resize event is not fired when the toolbar changes (height) in Safari. This could (depending on your usage of object-fit) lead to a not updated recalculation in those edge-cases. There is currently no way to work around this but anyhow it is really an edge-case.

- If you use [art-directed images](http://usecases.responsiveimages.org/#art-direction) on your page, please don't run them through the polyfill as it assumes the aspect-ratio never changes for an img source and it doesn't detect src-changes through a script.

----


## Author

This polyfill is written by [Anselm Hannemann](http://helloanselm.com/) and [Christian "Schepp" Schaefer](https://twitter.com/derSchepp). Follow them on Twitter via [@helloanselm](https://twitter.com/helloanselm) and [@derSchepp](https://twitter.com/derSchepp) or check their GitHub profiles via [anselmh](http://github.com/anselmh/) and [Schepp](http://github.com/Schepp/) for more information.

## License

This project is under the MIT Open Source License. [See the LICENSE file](LICENSE.md) for more information.
