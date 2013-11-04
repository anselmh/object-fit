# Polyfill for CSS `object-fit` property

This is a headless polyfill for the CSS object-fit property which defines the sizing mode for content images (similar to background-size for CSS background sources).

## The Webstandard

The Sepcification for `object-fit` is to be found at [W3C CSS3 Images](http://www.w3.org/TR/css3-images/#the-object-fit).

## How the polyfill works

## Feature Detection

The polyfill uses a feature detection method to see if object-fit is supported.

## Browser Support

Currently no information.

## Setup / Usage

This polyfill is available as Bower component. Use it right away from bower:

	$ bower install object-fit

Or set up manually by grabbing the download from GitHub.
Then use as following:

	// Instructions here

## Known errors and bugs

- **iOS7** has a bug that the resize event is not fired when the toolbar changes (height) in Safari. This could (depending on your usage of object-fit) lead to a not updated recalculation in those edge-cases. There is currently no way to work around this but anyhow it is really an edge-case.


----


## Author

This polyfill is written by [Anselm Hannemann](http://helloanselm.com/). [Follow him on twitter](https://twitter.com/helloanselm) or check out [his GitHub profile](http://github.com/anselmh/) for more information.

## License

This project is under the MIT Open Source License. [See the LICENSE file](LICENSE.md) for more information.
