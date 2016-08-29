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
		var requestData = settings.data;
		var requestUrl = settings.url;
		var cacheData = clientSideAjaxCache.getCache(requestUrl, requestData);

		jqxhr["settings"] = settings;
		if (cacheData !== null) {
			jqxhr.abort();
			//jqxhr["responseText"] = JSON.stringify(cacheData);
			//jqxhr["responseJSON"] = cacheData;
			//jqxhr["readyState"] = 4;
			//jqxhr["status"] = 200;
			//$.event.trigger("ajaxSuccess");
		}
	}
});

$(document).ajaxSuccess(function (event, status, cacheInfo, cacheData) {
	if (typeof cacheInfo.clientSideCache !== "undefined") {
		console.log(cacheInfo);
		if (typeof cacheInfo.clientSideCache !== "undefined" && cacheInfo.clientSideCache === true) {
			var requestData = cacheInfo.data;
			var requestUrl = cacheInfo.url;
			var cacheInfo = clientSideAjaxCache.getCache(requestUrl, requestData);
			if (cacheInfo === null) {
				clientSideAjaxCache.setCache(requestUrl, requestData, cacheData);
			}
		}
	}

});