MediaQuery
==========

MediaQuery is a javascript-powered cross-browser media query and media query events handler.  It supports queries on the viewport and device as well as more advanced min/max greater-than/less-than queries. It is tested in all browsers on both PC and Mac systems, including the acient IE6+.

What does it support, exactly?
-----------

* width / height / aspect-ratio / orientation / font-size
* device-width / device-height / device-aspect-ratio / device-orientation
* values written with em, in, pt, px, %, and empty suffixes.
* min-property, max-property, property &lt;, property &gt;

How to use it
-----------

First, add the MediaQuery script to your site or page.

```html
<script src="MediaQuery.js"></script>
```

Evaluate a query on the fly.

```js
var result = MediaQuery('min-width: 640px').matches; // returns a boolean: true or false if whether the media query was matching
```

Save a media query object to be evaluated anytime later.

```js
var mq = MediaQuery('min-width: 640px');

// many moments later

mq.matches;
```

Read or replace a media query with the `query` method.

```js
MediaQuery('min-width: 640px').query('width > 640px').query; // returns a string: "width > 640px"
```

Add an event with `addEvent`, which will run each time the media query changes to or from matching.

```js
MediaQuery('min-width: 640px').addEvent(function (matches, data) {
	matches; // whether the media query was matching or not
	data; // the media query as a javascript object
});
```

Add a classname to &lt;html&gt; with `addClass`, which will only be added when the media query is matching.

```js
MediaQuery('width < 768').addClass('handheld');
```

Browser support
-----------

* Google Chrome
* Mozilla Firefox 3+
* Apple Safari 4+
* Opera 10+
* Internet Explorer 6+

License
-----------

MIT

Acknowledgements
------------

MediaQuery is a project by [Jonathan Neal](http://github.com/jonathantneal).