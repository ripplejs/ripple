# ripple ![experimental](http://img.shields.io/badge/stability-experimental-orange.svg) #

**WIP**: This is currently a work-in-progress. The API will probably change a lot. Feel free to suggest ideas for the API in the issues. You can see some working examples over at [ripplejs/examples](https://github.com/ripplejs/examples)

---

A tiny foundation for building reactive views with plugins. It aims to have a similar API to Reactive, but allow composition of views, like React.

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
