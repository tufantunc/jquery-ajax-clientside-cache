var clientSideAjaxCache = {};
(function (context) {
	function _createCacheKey(url, postData) {
		if (!!url) {
			var result = url.toString();
			if (!!postData) {
				$.each(Object.keys(postData), function (index, item) {
					result += "_" + item + "-" + postData[item];
				});
			}

			return result.replace(" ", "");
		} else {
			return null;
		}
	};

	context.setCache = function (url, postData, responseData) {
		if (!!url) {
			var cacheKey = _createCacheKey(url, postData);
			sessionStorage.setItem(cacheKey, JSON.stringify(responseData));
			return true;
		} else {
			return false;
		}
	};

	context.getCache = function (url, postData) {
		if (!!url) {
			var cacheKey = _createCacheKey(url, postData);
			var cacheData = JSON.parse(sessionStorage.getItem(cacheKey));
			return cacheData;
		} else {
			return false;
		}
	}

	context.cleanCache = function (url, postData) {
		if (!!url) {
			var cacheKey = _createCacheKey(url, postData);
			sessionStorage.removeItem(cacheKey);
		}
	}

})(clientSideAjaxCache);

$(document).ajaxSend(function (event, jqxhr, settings) {
	if (typeof settings.clientSideCache !== "undefined" && settings.clientSideCache === true) {
		var cacheData = clientSideAjaxCache.getCache(settings.url, settings.data);
		jqxhr["settings"] = settings;
		if(!!cacheData) {
			jqxhr["responseJSON"] = cacheData;
			jqxhr["responseText"] = JSON.stringify(cacheData);
			jqxhr.abort();
		}
	}
});

$(document).ajaxSuccess(function (event, jqxhr) {
	if(typeof jqxhr.settings.clientSideCache !== "undefined" && jqxhr.settings.clientSideCache === true) {
		var requestData = jqxhr.settings.data;
		var requestUrl = jqxhr.settings.url;
		var cacheData = jqxhr.responseJSON;
			var cacheInfo = clientSideAjaxCache.getCache(requestUrl, requestData);
			if (cacheInfo === null) {
				var cacheData = jqxhr.responseJSON;
				clientSideAjaxCache.setCache(requestUrl, requestData, cacheData);
			}
		}

});
