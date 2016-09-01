(function($) {
	var originalAjaxFunction = $.ajax;

	var defaults = {
		type: "sessionStorage", //or localStorage
		expires: null, //optional, must be datetime object, not neccessery if type is sessionStorage
		key: null //optional, must be string
	};

	var _type, _expires, _key;

	var _prefix = "csc_";

	function _createCacheKey(url, postData) {
		if (typeof url === "string") {
			var result = _prefix + url;
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

	function _setCache(responseData) {
		sessionStorage.setItem(_key, JSON.stringify(responseData));
		return true;
	};

	function _getCache() {
		var cacheData = JSON.parse(sessionStorage.getItem(_key));
		return cacheData;
	}

	function _removeCachefunction (url, postData) {
		if (!!url) {
			var cacheKey = _createCacheKey(url, postData);
			sessionStorage.removeItem(cacheKey);
		}
	}

	$.ajax = function(settings) {
		console.log(settings);
		console.log("ajax called");
		//if clientSideCache defined, do the things
		if(typeof settings.clientSideCache === "object") {
			console.log("cache func start");
			//set type *must be string
			if(typeof settings.clientSideCache.type === "string") {
				_type = settings.clientSideCache.type === "localStorage" ? "localStorage" : "sessionStorage";

				//if type is localStorage, control the expire date
				if(settings.clientSideCache.type === "localStorage") {
					//set expires *must be date object
					if(typeof settings.clientSideCache.expires === "object") {
						_expires = settings.clientSideCache.expires;
					} else {
						_expires = defaults.expires; //set default
					}
					//end of set expires
				}
				//end of if type is localStorage, control the expire date
			} else {
				_type = "sessionStorage";
			};
			//end of set type

			//set key
			if(typeof settings.clientSideCache.key === "string") {
				_key = _prefix + settings.clientSideCache.key; //add prefix to user defined key
			} else {
				_key = _createCacheKey(settings.url, settings.data);
			}
			//end of set key

			//if ajax has clientSideCache data, override beforeSend and error functions, else make ajax request and set reponse to cache data
			var cacheData = _getCache();
			console.log("cacheData:");
			console.log(cacheData);
			if(!!cacheData) {
				//control ajax error
				//not needed
				// var _originalError;
				// if(typeof settings.error === "function") {
				// 	_originalError = settings.error;
				// }
				// settings.error = function (jqXHR, textStatus, errorThrown) {
				// 	console.log("its error");
				// 	if(textStatus === "abort") {
				// 		console.log("aborted because cache");
				// 		jqXHR.statusText = "OK";
				// 		jqXHR.status = 200;
				// 		jqXHR.readyState = 4;
				// 		jqXHR.settings.success(cacheData, "OK", jqXHR);
				// 		return;
				// 	}
				//
				// 	_originalError(jqXHR, textStatus, errorThrown);
				// }
				//end of control ajax error

				//control ajax cache on beforeSend
				var _originalBeforeSend;
				if(typeof settings.beforeSend === "function") {
					_originalBeforeSend = settings.beforeSend;
				}

				settings.beforeSend = function(jqXHR, settings) {
					_originalBeforeSend(jqXHR, settings);
					jqXHR["settings"] = settings;
					jqXHR["responseJSON"] = cacheData;
					jqXHR["responseText"] = JSON.stringify(cacheData);
					settings.success(cacheData, "OK", jqXHR);
					console.log("jqXHR aborted");
					jqXHR.abort();
				}
				//end of control ajax cache on beforeSend

			} else {
				var _originalSuccess;
				if(typeof settings.success === "function") {
					_originalSuccess = settings.success;
				}
				settings.success = function (data, testStatus, jqxhr) {
					_setCache(data);
					_originalSuccess(data, testStatus, jqxhr);
				}
			}

		}
		//end of if clientSideCache defined, do the things

		//do jquery ajax things
		var result = originalAjaxFunction(settings);
		//end of do jquery ajax things
	}

	//this function is clean all sessionStorage or localStorage decided with options parameter
	$.cleanAjaxClientSideCache = function(options) {
		console.log("clean cache taken");
		return true;
	};

	//this function can get cache from sessionStorage or localStorage with options parameter
	$.getAjaxClientSideCache = function(options) {
		console.log("get cache taken");
		return true;
	};

}(jQuery));
