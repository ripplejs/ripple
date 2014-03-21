# ripple

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

```js
npm install ripplejs/ripple
```

or download the [standlone version](https://raw.githubusercontent.com/ripplejs/ripple/master/dist/ripple.min.js) and include it on your page.

## Browser Support

Supports real browsers and IE9+.

## Examples

You can view some more thorough demos at [ripplejs/examples](https://github.com/ripplejs/examples).
