# MediaClass

MediaClass adds and removes responsive classnames to the document or individual elements.

## What can it do, exactly?
-----------

* width / height / aspect-ratio / orientation
* values written with em, in, pt, px, and %.
* device-*, this-*, min-*, max-*, below-*, above-*;

```js
MediaClass("mobile", "(max-width: 480px)");
```

Then, when the page is at or below 480px in width.

```html
&lt;html class="mobile"&gt;
```

Additionally, selectors and a _this_ syntax target elements and their measurements.</p>

```js
MediaClass("small", ".widget:media(this-max-width: 480px)");
```

Then, when the element is at or below 480px in width.

```html
&lt;div class="widget small"&gt;&lt;/div&gt;
```

## Further Usage

The _above_ or _below_ syntax expands targeting. _mobile-small_ triggers when the browser window is below 20em (320px) in width.

```js
MediaClass("mobile-small", "(max-width: 20em)");
```

Assign the query to a variable.

```js
var mq = MediaClass("mobile-small", "(max-width: 20em)");
```

Change it.

```
mq.media = "(below-width: 20em)");
```

Remove it.

```js
mq.remove();
```

## License

MIT

## Acknowledgements

MediaClass is a project by [Jonathan Neal](http://twitter.com/jon_neal).