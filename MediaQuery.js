(function (window, screen, documentElement) {
	/* ======================================================================
	   Setup
	   ====================================================================== */

	var hasEventListener = ('addEventListener' in window);
	var hasGetComputedStyle = ('getComputedStyle' in window);
	var hasOrientation = ('orientation' in window);

	var regexpTrim = /^\s+|\s+$/g;
	var regexpValue = /(\d+)(\D+)/;
	var gap = ' ';
	var landscape = 'landscape';
	var portrait = 'portrait';

	function parseDocumentElementFontSize(m, m1, m2) {
		m2 = m2.toLowerCase();

		return (m2 == 'em') ? m1 * 16 : (m2 == 'in') ? m1 * 96 : (m2 == 'pt') ? m1 * 96 / 72 : (m2 == '%') ? m1 / 100 * 16 : m1;
	}

	function documentElementFontSize() {
		return (hasGetComputedStyle ? getComputedStyle(documentElement, null) : documentElement.currentStyle).fontSize.toLowerCase().replace(regexpValue, parseDocumentElementFontSize) * 1;
	}

	function toCamelCase(string) {
		return string.toLowerCase().replace(/-[a-z]/g, function (match) {
			return match.substr(1).toUpperCase();
		});
	}

	function parseCSSValue(m, m1, m2) {
		m2 = m2.toLowerCase();

		return (m2 == 'em') ? m1 * MediaQuery.data.fontSize : (m2 == 'in') ? m1 * 96 : (m2 == 'pt') ? m1 * 96 / 72 : (m2 == '%') ? m1 / 100 * MediaQuery.data.width : m1;
	}

	function parseCSSDeclaration(m, m1, m2, m3) {
		return 'd.' + toCamelCase(m1) + m2 + m3.replace(regexpValue, parseCSSValue)
	}

	function windowAddEvent(type, callback) {
		window[hasEventListener ? 'addEventListener' : 'attachEvent']((hasEventListener ? '' : 'on') + type, callback);
	}

	function documentElementHasClass(className) {
		return (gap + documentElement.className + gap).indexOf(gap + className + gap) > -1;
	}

	function documentElementAddClass(className) {
		if (!documentElementHasClass(className)) {
			documentElement.className = (documentElement.className + gap + className).replace(regexpTrim, '');
		}
	}

	function documentElementCutClass(className) {
		if (documentElementHasClass(className)) {
			documentElement.className = (gap + documentElement.className + gap).replace(gap + className + gap, gap).replace(regexpTrim, '');
		}
	}

	function debounce(callback) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;

			function delayed () {
				callback.apply(obj, args);
				timeout = null;
			}

			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(delayed, MediaQuery.debounceRate); 
		};
	}

	/* ======================================================================
	   getMediaQueryData
	   ====================================================================== */

	function getMediaQueryData() {
		var
		width = window.innerWidth || documentElement.clientWidth,
		height = window.innerHeight || documentElement.clientHeight,
		orientation = width > height ? landscape : portrait,
		deviceWidth = screen.width,
		deviceHeight = screen.height,
		deviceOrientation = hasOrientation ? window.orientation % 180 ? landscape : portrait : deviceWidth > deviceHeight ? landscape : portrait;

		MediaQuery.data = {
			all: true,
			screen: true,
			print: false,
			width: width,
			height: height,
			aspectRatio: width / height,
			orientation: orientation,
			fontSize: documentElementFontSize(),
			deviceWidth: deviceWidth,
			deviceHeight: deviceHeight,
			deviceAspectRatio: deviceWidth / deviceHeight,
			deviceOrientation: deviceOrientation
		};

		var instanceIndex, instance;

		for (instanceIndex in MediaQuery.instance) {
			MediaQuery.instance[instanceIndex].query();
		}
	}

	/* ======================================================================
	   evaluateMediaQuery
	   ====================================================================== */

	function evaluateMediaQuery(mediaQuery) {
		return Function('d', 'return(' + mediaQuery
			.replace(/\(|\)/g, '')
			.replace(/\s*,\s*/g, ') || (')
			.replace(/\s+and\s+/gi, ' && ')
			.replace(/min-(.*?):/gi, '$1>=')
			.replace(/max-(.*?):/gi, '$1<=')
			.replace(/min-|max-/gi, '')
			.replace(/(all|screen|print)/, 'd.$1')
			.replace(/:/g, '==')
			.replace(/([\w-]+)\s*([<>=]+)\s*(\w+)/g, parseCSSDeclaration)
			.replace(/([<>=]+)([A-z][\w-]*)/g, '$1"$2"')
		+ ')')(MediaQuery.data);
	}

	/* ======================================================================
	   MediaQuery
	   ====================================================================== */

	function MediaQuery(mediaQuery) {
		if (mediaQuery != null) {
			return new MediaQuery().query(mediaQuery);
		}

		var instance = this;

		instance._ = { classList: {}, eventList: {}, query: '' };

		instance.matches = true;

		MediaQuery.instance.push(instance);

		return instance;
	}

	MediaQuery.prototype.query = function (mediaQuery) {
		var
		instance = this,
		_ = instance._,
		mediaQueryIsString = typeof mediaQuery == 'string',
		index;

		_.query = mediaQueryIsString ? mediaQuery : _.query;

		if (evaluateMediaQuery(_.query) != instance.matches) {
			instance.matches = !instance.matches;

			for (index in _.eventList) {
				_.eventList[index].call(instance, instance.matches, MediaQuery.data);
			}

			for (index in _.classList) {
				if (instance.matches) {
					documentElementAddClass(index);
				} else {
					documentElementCutClass(index);
				}
			}
		}

		return mediaQueryIsString ? instance : _.query;
	};

	MediaQuery.prototype.addEvent = function (callback) {
		if (typeof callback != 'function') {
			return false;
		}

		var instance = this;

		instance._.eventList[callback] = callback;

		callback.call(instance, instance.matches, MediaQuery.data);

		return instance;
	};

	MediaQuery.prototype.addClass = function (className) {
		var instance = this;

		instance._.classList[className] = className;

		if (instance.matches) {
			documentElementAddClass(className);
		} else {
			documentElementCutClass(className);
		}

		return instance;
	};

	MediaQuery.debounceRate = 50;

	MediaQuery.instance = [];

	/* ======================================================================
	   Main
	   ====================================================================== */

	getMediaQueryData();

	windowAddEvent('orientationchange', getMediaQueryData);
	windowAddEvent('resize', debounce(getMediaQueryData));
	windowAddEvent('blur', getMediaQueryData);

	window.MediaQuery = MediaQuery;
})(window, screen, document.documentElement);