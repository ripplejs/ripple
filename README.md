# ripple

[![Build Status](https://travis-ci.org/ripplejs/ripple.png?branch=master)](https://travis-ci.org/ripplejs/ripple)

A tiny reactive templating library built for Component that is
completely pluggable. It is a foundation for building views that have
one-way data-binding.

So how is this different to React/Ractive/Rivets etc.?

It is tiny, doesn't rely on globals and is completely based on plugins.

```js
var View = ripple(template)
  .use(events)
  .use(each)
  .use(dispatch);
```

Most importantly, every View has it's own ripple compiler. Unlike other
libraries where you a adding plugins and features to a global object,
Ripple creates a custom renderer each time, so you can safely use
just the plugins you need for that view.

Ripple also has a very simple API. There are no long list of options,
no "utils" included on the global scope.

## Features

* Automatic DOM binding
* Composable views
* Interpolation with filters
* Extendable via plugins
* No globals
* Custom attribute bindings
* Custom elements
* No old IE support

Most importantly, Ripple is simple. Unlike the other large libraries,
you can read through Ripple's code and understand what's happening. If
you ever get stuck, just read the source.

## Install

```js
component install ripplejs/ripple
```

## Browser Support

Supports real browsers and IE9+.

## Example

You can view some advanced, and functioning, demos at [ripplejs/examples](https://github.com/ripplejs/examples).

Given a template:

```html
<div class="User">
  Hey {{fullname | uppercase}}!
</div>
```

We can create a View that will render it and bind it to a model:

```js
var ripple = require('ripple');
var template = require('./template.html');

var View = ripple(template);

View.computed('fullname', ['name', 'surname'] function(first, last){
  return first + ' ' + last;
});

View.filter('uppercase', function(val){
  return val.toUpperCase();
});

module.exports = View;
```

Then other parts of your app can now require this view and render it:

```js
var Person = require('./person');

var person = new Person({
  name: 'Fred',
  surname: 'Flintsone'
});

app.mount(document.body);
```

## View

## State

## Computed Properties

## Interpolation & Filters

## Event Binding

## Iteration

## Directives

## Composing Views

## Working with models

## Plugins