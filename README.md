# Polyfill for CSS `object-fit` property

This is a headless polyfill for the CSS `object-fit` property which defines the sizing mode for content images (similar to background-size for CSS background sources).

## The Webstandard

The specification for `object-fit` is to be found at [W3C CSS3 Images](http://www.w3.org/TR/css3-images/#the-object-fit). The property scales the image to fit in a certain way into a defined area, e.g:

	img {
		width: 100%; // dimensions are mandatory
		height: 35em; // dimensions are mandatory

		object-fit: cover;
		overflow: hidden; // Cuts off the parts of the image poking out
	}

Normally, the image would be stretched to the specified dimensions but due to the usage of the CSS property `object-fit: cover;` the image now is scaled proportionally, until every pixel of the defined area is covered by parts of it. In the case of cover this means that parts of the image will overlap the given area.

The following are the possible values and their implications:

- `fill` streches the image exactly to the defined dimensions which results in a distorted image. Comparable to `background-size: 100% 100%`. That's the default value.
- `none` leaves the image at its natural size and centers it inside within the defined area. If the image's natural dimensions are larger than the defined area parts of the image will poke out of it unless you also set `overflow: hidden` on it. Comparable to `background-size: auto auto; background-position: center center`.
- `contain` scales the image up or down until all of it fits into the defined area. This mode respects the image's natural aspect-ratio. It's also called "letterbox view". Comparable to `background-size: contain`.
- `cover` scales the image up or down until every pixel of the defined area is covered with parts of the image. Sort of "pan and scan view". This means that parts of the image will poke out of the defined area unless you also set `overflow: hidden` on it. This mode respects the image's natural aspect-ratio. Comparable to `background-size: cover`.

![How object-fit works](http://www.w3.org/TR/css3-images/img_scale.png)

## Feature Detection

The polyfill uses a feature detection method to see if object-fit is supported. If it's not it will active itself.

## Browser Support

This polyfill works in all major browsers as well as in IE9+. Find out [which browsers support `object-fit` natively](http://caniuse.com/object-fit).

| Browser  |  polyfill?  |  natively? |
|----------|-------------|------------|
| Google Chrome | yes | v31+ |
| Opera | yes | v24+ |
| Firefox | 4+ (#13) | v36+ |
| Internet Explorer | 9+ | ["under consideration"](https://status.modern.ie/objectfitandobjectposition) |

## Setup / Usage

This polyfill is available as Bower component or via npm. Use it right away from bower:

	$ bower install --save object-fit

or set up via npm

	$ npm install --save object-fit

The `--save` flag is used to store the package dependency in the package.json so it can be automatically fetched next time using `npm install`. Use `--save-dev` to use it only as development dependency (but only do if you are sure you know what you do).

Or set up manually by grabbing the [download from GitHub](https://github.com/anselmh/object-fit/releases).
Then include the CSS file [`polyfill.object-fit.css`](https://github.com/anselmh/object-fit/blob/master/dist/polyfill.object-fit.css) in your HTML `<head>`, the JavaScript file [`polyfill.object-fit.min.js`](https://github.com/anselmh/object-fit/blob/master/dist/polyfill.object-fit.min.js) at the bottom of your HTML `<body>`. Right behind the JavaScript file reference you now need to call the polyfill:

	<script>
		objectFit.polyfill({
			selector: 'img', // this can be any CSS selector
			fittype: 'cover', // either contain, cover, fill or none
			disableCrossDomain: 'true' // either 'true' or 'false' to not parse external CSS files.
		});
	</script>

You can find sample implementations in our [test directory](https://github.com/anselmh/object-fit/tree/master/tests).


## Testing

Due to CSP restrictions and our CSS parser there’s no way to test this polyfill from a filesystem. You need to set up a local server that serves from root directory. Calling `http://localhost:8000/tests/index-cover.html` should work then. `php -S localhost:8000` for example would start a local PHP server on your current directory.

## DOM watching capabilities

In browsers greater IE8 the polyfill uses DOM Mutation Events or Mutation Observers (depending on what's available) to detect the injection of further images matching the defined selector. This means that it will also apply itself to any images that you append to the DOM at any later point. And it will detach itself from images that you remove from the DOM. Since this feature is sort of complicated to craft in a rock solid way, you might look out for unexpected behaviors.

## Security / Mixed Content Issues and 3rd Party CSS

If you use any third party CSS or mixed content on your website (Webfonts from a service, a CDN, or similar), the polyfill might not work as expected.
You can still use the polyfill but then need to set some options regarding [CSP](http://content-security-policy.com/):

For example you need to set the header to:

	'Access-Control-Allow-Origin: *'

This should fix [the issue](https://github.com/anselmh/object-fit/issues/7). If you also need to support credentials, [you can’t use `*`](#25) but need the server reply with two headers (server needs also to reply with `Access-Control-Allow-Credentials: true`), one of which includes the origin in question.

It is recommended to add the attribute `crossorigin=""` to your CSS `link` element that is called from the external resource to indicate what type of CORS the server should reply with.

In case you can’t alter the CSP / CORS settings of the server in question, you can disable parsing external CSS files in the config of the call:

	<script>
		objectFit.polyfill({
			selector: 'img',
			fittype: 'cover',
			disableCrossDomain: 'true'
		});
	</script>

----


## Author

This polyfill is written by [Anselm Hannemann](http://helloanselm.com/) and [Christian "Schepp" Schaefer](https://twitter.com/derSchepp). Follow them on Twitter via [@helloanselm](https://twitter.com/helloanselm) and [@derSchepp](https://twitter.com/derSchepp) or check their GitHub profiles via [anselmh](http://github.com/anselmh/) and [Schepp](http://github.com/Schepp/) for more information.

## License

This project is under the MIT Open Source License. [See the LICENSE file](LICENSE.md) for more information.
