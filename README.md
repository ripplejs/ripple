# ripple.js

[![Build Status](https://travis-ci.org/ripplejs/ripple.svg?branch=master)](https://travis-ci.org/ripplejs/ripple)

A tiny foundation for building reactive views with plugins. It aims to have a similar API to [Reactive](https://github.com/component/reactive), but allow composition of views, like [React](http://facebook.github.io/react/).
The major difference for other view libraries is that there are no globals used at all. Each view has its own set of bindings and plugins. This
makes composition of views really easy.

```js
var Person = ripple('<div>{{name}}</div>')
  .attr('name', { required: true, type: 'string' });

var person = new Person({
  name: 'Tom'
});

person.appendTo(document.body);
person.name = "Barry"; // DOM updates automatically
```

## Install

```js
component install ripplejs/ripple
```

## Browser Support

Supports real browsers and IE9+.

## Documentation

[Documentation is on the wiki](https://github.com/ripplejs/ripple/wiki).

## Examples

* [Clock](http://jsfiddle.net/chrisbuttery/QnHPj/3/)
* [Counter](http://jsfiddle.net/anthonyshort/ybq9Q/light/)
* [Like Button](http://jsfiddle.net/anthonyshort/ZA2gQ/6/light/)
* [Markdown Editor](http://jsfiddle.net/anthonyshort/QGK3r/light/)
* [Iteration](http://jsfiddle.net/chrisbuttery/4j5ZD/1/light/)

See more examples at [ripplejs/examples](https://github.com/ripplejs/examples)

## Plugins

* [shortcuts](https://github.com/ripplejs/shortcuts) - add custom key binding combos
* [events](https://github.com/ripplejs/events) - add event listeners to the DOM and call methods on the view
* [each](https://github.com/ripplejs/each) - Basic iteration using the `each` directive.
* [bind-methods](https://github.com/ripplejs/bind-methods) - Bind all methods on the prototype to the view
* [markdown](https://github.com/ripplejs/markdown) - Adds a directive to render markdown using Marked.
* [extend](https://github.com/ripplejs/extend) - Makes adding methods to the view prototype a little cleaner
* [intervals](https://github.com/ripplejs/intervals) - Easily add and remove intervals
* [computed](https://github.com/ripplejs/computed) - Add computed properties.
* [refs](https://github.com/ripplejs/refs) - Easily reference elements within the template
* [dispatch](https://github.com/ripplejs/dispatch) - Dispatch custom DOM events up the tree

[View and add them on the wiki](https://github.com/ripplejs/ripple/wiki/Plugins)


## License

MIT
