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

Or you could compose `Person` inside of another view so you can
re-use it everywhere!

```js
var Profile = ripple('<person name="{{person}}"></person>');

Profile.compose('person', Person);

var page = new Profile({
  person: 'Tom'
});

page.mount(document.body);
```

This will render the same thing, except that you're re-using a completely
independant view and passing data to it. This essentially creates a `Person`
view whenever it finds a `<person>` element.

It's kind of like React, Reactive, Ractive, Vue etc. except:

1. You don't work with a global renderer. So you can add plugins to a view without affecting other views.
2. Is almost entirely based on plugins. Sort of like how Express gives you the foundation and you use middleware.
3. It built around the assumption you're using a module system, so it doesn't need to provide a weird API. Require those templates and plugins.
4. It doesn't include 'util' functions. Seriously. Use a module system.

## Features

* Model->DOM bindings
* Composable and re-usable views
* Batched DOM rendering
* Interpolation with filters
* Extendable via plugins
* No globals
* Custom attribute bindings
* Custom elements
* No IE8 support (yeah, that's a feature)

Most importantly, Ripple is simple. Unlike the other large libraries,
you can read through Ripple's code and understand what's happening. If
you ever get stuck, just read the source of `ripplejs/view` or `ripplejs/compiler`.

Ripple was also built a series of [smaller modules](https://github.com/ripplejs). So
if you like the interpolator and want to use it in something else, go for it. Hell, if 
you don't like the ripple API, take the components and create a different API around it.

## Install

```js
component install ripplejs/ripple
```

## Browser Support

Supports real browsers and IE9+.

## How it works

Ripple is really simple that I can explain how it all works pretty quickly.

The `ripple` function takes a template and creates a `View` constructor. Whenever you create
a new instance it creates an element based on the template.

It adds the `Compiler` as a plugin to the view which hooks into the `Views` render lifecycle
event.

The view has a few lifecycle events: `created`, `render`, `ready`, `mounted`, `unmounted` and `destroy`. 
The view manages this lifecycle and the "state" of the view using a `Model` instance. The model allows
for watches an object for changes. So when you change data on the view, the model will update
all properties that changed.

When the view is all setup, it is "rendered" by the compiler. This just takes the template
you gave it, turns it into a DOM element and walks down the tree. When it finds interpolation,
custom attributes or custom elements, it calls the plugin function with the node and the view.

## Examples

You can view some more thorough demos at [ripplejs/examples](https://github.com/ripplejs/examples).

## Getting Started

`ripple` creates `View` objects just like others you might be used to. These are
similar to Backbone's view, React classes and so on. Unlike other frameworks,
you create a unique View for each template instead of relying on a global variable.

Here's a basic template:

```html
<div class="User">
  Hey {{name}}!
</div>
```

We can create a View that will render this template.

```js
var Person = ripple('<div class="User">Hey {{name}}!</div>');
```

This is a `View` "class" that represents this template. Creating
instances of this class will render a view.

```js
var person = new Person({
  name: "Tom"
});
```

This will render:

```html
<div class="User">Hey Tom!</div>
```

You can then place this view in the DOM using the `mount` method:

```js
person.mount(document.body);
```

This will append the view to the body. When mounting an element
this will trigger any bindings to fire. By default, ripple only
comes bundled with interpolation (like the `{{name}}` variable above).
To add more functionality, like directives, filters and components
you'll use plugins.

For example, a common plugin is the `events` plugin. This allows you
to bind methods in the `View` to DOM elements:

```html
<button on-click="submit">Save</button>
```

We add the `ripplejs/events` plugin:

```js
var events = require('events');
Person.use(events);
```

Now we can add methods on the `Person` prototype.

```js
Person.prototype.submit = function(e){
  model.save();
};
```

Plugins are a core part of ripple. Because we're embracing module
systems like Component and npm, adding plugins as dependencies
is trivial. Unlike other libraries we don't bundle everything in at once.

The `View` also has a number of static methods for adding filters,
computed properties, components and directives.


```
Person.computed('fullname', ['first', 'last'], function(){
  return this.get('first') + ' ' + this.get('last');
});

Person.filter('uppercase', function(val){
  return val.toUpperCase();
});
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

## Notes

- Event stream

```
this.event('save')
  .pipe(preventDefault)
  .pipe(stopBubble)
  .pipe(clicks)
  .end(this.save);
```
