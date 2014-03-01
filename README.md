# ripple ![experimental](http://img.shields.io/badge/stability-experimental-orange.svg) #

A tiny foundation for building reactive views with plugins.

```js
var Person = ripple('<div>{{name}}</div>')
  .use(events)
  .use(each)
  .use(dispatch);

var person = new Person({
  name: 'Tom'
});

person.mount(document.body);
```

## Install

```js
component install ripplejs/ripple
```

## Browser Support

Supports real browsers and IE9+.

## Examples

You can view some more thorough demos at [ripplejs/examples](https://github.com/ripplejs/examples).