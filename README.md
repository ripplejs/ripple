# ripple.js

[![Build Status](https://travis-ci.org/ripplejs/ripple.png?branch=master)](https://travis-ci.org/ripplejs/ripple)

A tiny foundation for building reactive views with plugins. It aims to have a similar API to Reactive, but allow composition of views, like React.
The major difference for other view libraries is that there are no globals used at all. Each view has its own set of bindings and plugins. This
makes composition of views really easy.

```js
var Person = ripple('<div>{{name}}</div>')
  .use(events)
  .use(each)
  .use(dispatch);

var person = new Person({
  name: 'Tom'
});

person.appendTo(document.body);
```

## Install

```js
component install ripplejs/ripple
```

```js
npm install ripplejs
```

or download the [standlone version](https://github.com/ripplejs/ripple/releases) and include it on your page.

## Browser Support

Supports real browsers and IE9+.

## Examples

* [Counter](http://jsfiddle.net/anthonyshort/ybq9Q/light/)
* [Like Button](http://jsfiddle.net/anthonyshort/ZA2gQ/6/light/)
* [Markdown Editor](http://jsfiddle.net/anthonyshort/QGK3r/light/)
* [Iteration](http://jsfiddle.net/anthonyshort/kC45a/3/light/)

## Plugins

[View and add them on the wiki](https://github.com/ripplejs/ripple/wiki/Plugins) 
