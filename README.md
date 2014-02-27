# ripple ![experimental](http://img.shields.io/badge/stability-experimental-orange.svg) #

A tiny foundation for building reactive views. It provides the base for parsing templates,
provides a simple way for adding plugins.

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

## Features

* Composable views
* Extendable via plugins
* Built for package managers
* Batched DOM rendering
* Interpolation and filters
* Computed properties
* Directives
* 8kb gzipped
* Built using [smaller modules](https://github.com/ripplejs)

## Install

Component:

```js
component install ripplejs/ripple
```

npm:

```js
npm install ripplejs
```

The standalone browser-build:

```html
<script src="ripple/dist/ripple.min.js"></script>
```

## Browser Support

Supports real browsers and IE9+.

## Examples

You can view some more thorough demos at [ripplejs/examples](https://github.com/ripplejs/examples).

## Introduction

Ripple is yet another library for data-binding.
You can use it as the view layer of your application or use it within your current
views and just use it to manipulate the DOM.

It was built because none of the other solutions are based for module systems like
Component and expect global objects. They provide complex APIs with huge options
objects, bloated and unnecessary utility functions, global objects, and don't use an event-based system.

Ripple is similar to Ractive, Rivets, Vue.js and many of the others. The problem
I had with those frameworks is that their code is often large and difficult to
contribute to. Modules should be simple and systems should be composed of many
smaller modules that do one thing really well. This is the reason Ripple exists.

It borrows many concepts from React for it's views. Each view has a lifecycle,
manages a single element and can have a single parent view. Instead of mixins
and overriding weird methods like `componentWillUpdate`, you just listen for
events on the view like so `view.on('update')` which is a much more "JavaScript"
way of doing things.

However, main difference between Ripple and every other library is that for every
view that is created using Ripple, it has
it's own unique compiler. By default, Ripple comes with no functionality other
than interpolation and instead relies on plugins. It's like having a brand-new version of `Ractive` or
`Vue` for each view you create, meaning they are entirely encapsulated. You
can extend it with plugins without affecting other views. This feature is also
vital for composing views and being able to share components. For example, you could
build a dialog component using Ripple and the person using it doesn't even need to be using Ripple at all.

Ripple has a simple, event-based API. It doesn't use sub-classing or extending
and instead prefers composition. Look at [some of the code](https://github.com/ripplejs/view/blob/master/index.js)
behind Ripple and you'll see that it is extremely easy to follow.

## Getting Started

Ripple has three major parts:

* **View**: This manages the lifecycle and state of an element.
* **Model**: Handles the data and emit events when changes are made.
* **Compiler**: Renders the template and binds the view to the DOM.

You will create `View` objects using the `ripple` function:

```js
var ripple = require('ripple');
var View = ripple('<div>{{name}}</div>');
```

This is creating a new constructor function, or class, for this template. We use the `{{ }}`
braces to denote a variable. When this view is created it will replace that string with the
value.

```js
var person = new View({
  name: 'Tom'
});
```

It will also automatically update it whenever that value changes:

```js
person.set('name', 'Barry');
```

Now `person.el` will look like this:

```html
<div>Hey Barry!</div>
```

You can then place this view in the DOM using the `mount` method:

```js
person.mount(document.body);
```

This will append the view to the body. When mounting an element
this will trigger any bindings to fire.

You can [view the full API for View](https://github.com/ripplejs/view) in it's repo.

By default, ripple only comes bundled with interpolation (like the `{{name}}` variable above).
To add more functionality, like directives, filters and components
you'll use plugins.


### Using Plugins

Plugins are a core part of ripple. Because we're embracing module
systems like Component and npm, adding plugins as dependencies
is trivial. Unlike Angular we don't bundle everything in at once. Sorry, guys.

A common plugin is the `events` plugin. This replicates some of the `on-event` things
you might be used to in Angular or other libraries, and is similar to doing `onClick={this.method}`
in React without needing JSX.

First we need to add the plugin. You can get it at [ripplejs/events](https://github.com/ripplejs/events).

---

If you're not familiar with Component, (or you aren't using it) then you should download
the plugin manually and add it to your page.

---

This will allow us to bind methods in the `View` to DOM elements declaratively:

```html
<button on-click="submit">Save</button>
```

Then we use the plugin and give it some methods:

```js
Person.use(events, {
  submit: function(e) {
    // The button was clicked
  }
});
```

## Interpolation & Filters

## State

## Computed Properties

## Directives

## Composing Views

## Working with models

## Plugins