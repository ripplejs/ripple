# ripple

[![Build Status](https://travis-ci.org/ripplejs/ripple.png?branch=master)](https://travis-ci.org/ripplejs/ripple)

A tiny foundation for building reactive views with plugins. It aims to have a similar API to Reactive, but allow composition of views, like React.
The major difference for other view libraries is that there are no globals used at all. Each view has it's own set of bindings and plugins. This
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
npm install ripplejs/ripple
```

or download the [standlone version](https://raw.githubusercontent.com/ripplejs/ripple/master/dist/ripple.min.js) and include it on your page.

## Browser Support

Supports real browsers and IE9+.

## Examples

You can view some more thorough demos at [ripplejs/examples](https://github.com/ripplejs/examples).

## Basic Usage

You use the `ripple` function to create views from template strings.

```
var View = ripple(template);
```

This template can be:

* A string
* An element (the innerHTML will be used)

This template can include expressions within the text and attributes of the HTML

```html
<div>Favourite Book: {{title}}</div>
```

This will pull the title property from the view. Each view is given a model made from
a plain object.

```js
var view = new View({
  data: {
    title: 'The Final Empire'
  }
});
```

This sets the `title` property on the view when it is created. We can update this on the view:

```js
view.set('title', 'The Well of Ascension');
```

The HTML will automatically update to reflect this change. You can perform complex expressions
within the curly braces.

```html
<div>Height: {{ height * 1000 }}cm, Width: {{ width * 1000 }}cm</div>
```

Again, these will automatically update. When you want to add the view to the page, you can
call a number of different methods:

* appendTo
* before
* after
* replace

These all take a node as the first parameter. You can also remove an element from the page:

* remove
* destroy

Destroying a view removes all bindings and cleans up all events. You'll do this when you no
longer need a view at all. Removing a view just detaches it from the DOM.

### Lifecycle

Each view has a lifecycle. In order:

* construct
* created
* ready
* mounted
* unmounted
* destroy

When a view is first created, and before anything has been done, it will fire the construct event.
After the view has been setup, but not rendered, it fires the created event. When it has finally
rendered the element from the template and applied all of the bindings, it fires the ready event.

The mounted event is trigger whenever the element is placed into the DOM using any of the 4 methods
outlined above.

Unmounted is fired when a view is removed or destroyed.

You can easily hook into each of these events using static methods on the View.

```js
View.created(function(options){
  this.winning = true;
});

var view = new View();
view.winning // true
```

There are methods for each of the lifecycle events above. The functions are called in the context
of any view that is created. You'll usually use these methods to update the state of the view.