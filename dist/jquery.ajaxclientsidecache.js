/*! Jquery Ajax ClientSide Cache - v0.1.0 - 2016-09-17
* https://github.com/tufantunc/jquery-ajax-clientside-cache#readme
* Copyright (c) 2016 Tufan Tunc, Furkan Cuneyt Bekar; Licensed MIT */
(function ($) {
	var originalAjaxFunction = $.ajax;

	$.ajaxClientSideCacheTypeEnum = {
		sS: 'sessionStorage',
		lS: 'localStorage'
	};

	var defaults = {
		type: $.ajaxClientSideCacheTypeEnum.sS, //or localStorage
		expires: null, //optional, must be datetime object, not necessary if type is sessionStorage
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
	}

	function _setCache(responseData) {
		if (_type === $.ajaxClientSideCacheTypeEnum.sS) {
			sessionStorage.setItem(_key, JSON.stringify(responseData));
		} else {
			localStorage.setItem(_key, JSON.stringify(responseData));
		}
		return true;
	}

	function _getCache() {
		return _type === $.ajaxClientSideCacheTypeEnum.sS	? JSON.parse(sessionStorage.getItem(_key)) : JSON.parse(localStorage.getItem(_key));
	}

	function _removeCache(url, postData) {
		var cacheKey;
		if (!!url) {
			cacheKey = _createCacheKey(url, postData);
			if(_type === $.ajaxClientSideCacheTypeEnum.sS) {
				sessionStorage.removeItem(cacheKey);
			} else {
				localStorage.removeItem(cacheKey);
			}
		}
	}

	$.ajax = function (settings) {
		//if clientSideCache defined, do the things
		if (typeof settings.clientSideCache === "object") {
			//set type *must be string
			if (typeof settings.clientSideCache.type === "string") {
				_type = settings.clientSideCache.type === "localStorage" ? "localStorage" : "sessionStorage";

				//if type is localStorage, control the expire date
				if (settings.clientSideCache.type === $.ajaxClientSideCacheTypeEnum.lS) {
					//set expires *must be date object
					if (typeof settings.clientSideCache.expires === "object") {
						_expires = settings.clientSideCache.expires;
					} else {
						_expires = defaults.expires; //set default
					}
					//end of set expires
				}
				//end of if type is localStorage, control the expire date
			} else {
				_type = $.ajaxClientSideCacheTypeEnum.sS;
			}
			//end of set type

			//set key
			if (typeof settings.clientSideCache.key === "string") {
				_key = _prefix + settings.clientSideCache.key; //add prefix to user defined key
			} else {
				_key = _createCacheKey(settings.url, settings.data);
			}
			//end of set key

			//if ajax has clientSideCache data, override beforeSend and error functions, else make ajax request and set reponse to cache data
			var cacheData = _getCache();
			if (!!cacheData) {
				//control ajax cache on beforeSend
				var _originalBeforeSend;
				if (typeof settings.beforeSend === "function") {
					_originalBeforeSend = settings.beforeSend;
				}

				settings.beforeSend = function (jqXHR, settings) {
					_originalBeforeSend(jqXHR, settings);
					jqXHR.settings = settings;
					jqXHR.responseJSON = cacheData; 
					jqXHR.responseText = JSON.stringify(cacheData);
					settings.success(cacheData, "OK", jqXHR);
					jqXHR.abort();
				};
				//end of control ajax cache on beforeSend

			} else {
				var _originalSuccess;
				if (typeof settings.success === "function") {
					_originalSuccess = settings.success;
				}
				settings.success = function (data, testStatus, jqxhr) {
					_setCache(data);
					_originalSuccess(data, testStatus, jqxhr);
				};
			}

		}
		//end of if clientSideCache defined, do the things

		//do jquery ajax things
		var result = originalAjaxFunction(settings);
		//end of do jquery ajax things
	};

	//this function is clean all sessionStorage or localStorage decided with options parameter
	$.cleanAjaxClientSideCache = function (options) {
		$.each(options.type === $.ajaxClientSideCacheTypeEnum.sS ? sessionStorage	: localStorage,	function (key) {
				if (key.substr(0, _prefix.length) === _prefix) {
					(options.type === $.ajaxClientSideCacheTypeEnum.sS ? sessionStorage	: localStorage).removeItem(key);
				}
			});
		return true;
	};

	//this function can get cache from sessionStorage or localStorage with options parameter
	$.getAjaxClientSideCache = function (options) {
		if (!options.key) {
			return null;
		}
		return JSON.parse((options.type === $.ajaxClientSideCacheTypeEnum.sS ? sessionStorage	: localStorage).getItem(options.key));
	};
}(jQuery));
