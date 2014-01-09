# Polyfill for CSS `object-fit` property

This is a headless polyfill for the CSS object-fit property which defines the sizing mode for content images (similar to background-size for CSS background sources).

## The Webstandard

The Specification for `object-fit` is to be found at [W3C CSS3 Images](http://www.w3.org/TR/css3-images/#the-object-fit). The property scales the image to fit in a certain way into a defined area, e.g.:

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

This polyfill works in all major browsers as well as in IE8+.

-  Google Chrome  |  yes  |  (from v31 natively via experimental flag)
-  Opera  |  14+  |  (from v18 natively via experimental flag)
-  Firefox  |  4+  |  (vote for [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=624647))
-  Internet Explorer  |  8+  |

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

## DOM watching capabilities

In browsers greater IE8 the polyfill uses DOM Mutation Events or Mutation Observers (depending on what's available) to detect the injection of further images matching the defined selector. This means that it will also apply itself to any images that you append to the DOM at any later point. And it will detach itself from images that you remove from the DOM. Since this feature is sort of complicated to craft in a rock solid way, you might look out for unexpected behaviors.
 

----


## Author

This polyfill is written by [Anselm Hannemann](http://helloanselm.com/) and [Christian "Schepp" Schaefer](https://twitter.com/derSchepp). Follow them on Twitter via [@helloanselm](https://twitter.com/helloanselm) and [@derSchepp](https://twitter.com/derSchepp) or check their GitHub profiles via [anselmh](http://github.com/anselmh/) and [Schepp](http://github.com/Schepp/) for more information.

## License

This project is under the MIT Open Source License. [See the LICENSE file](LICENSE.md) for more information.
