# jQuery Ajax ClientSide Cache Plugin

jQuery Ajax ClientSide Cache plugin provides caching for ajax request using browser's localstorage/sessionstorage.


## Demo & Example

<https://tufantunc.github.io/jquery-ajax-clientside-cache-demo/>

#Usage
Use the plugin as follows:

```js
$.ajax({
  url: "http://www.omdbapi.com/",
  clientSideCache: {
    type: "sessionStorage" //or localStorage
    key: 'my-test-cache' //optional
  }, //for activating plugin
  success: function(data, textStatus, jqXHR) {
    //success codes
  }
});
```

## Installation

You can install jQuery Ajax ClientSide Cache Plugin by using [Bower](http://bower.io/).

```bash
bower install jquery-ajax-clientside-cache
```

Contributors should install the »dev dependencies« after forking and cloning via [npm](https://www.npmjs.com/).

```bash
npm install
```

## License

This plugin is available under [the MIT license](http://mths.be/mit).
