# Ripple

A DOM binding component based on component/reactive and tower/template.

## Features

Possible features we could include

* Iteration
* Bind more than one object
* Filters between object and DOM via streams
* Two-way binding
* Use streams as a base for data flow
* Have a `scope` for bindings like Angular

## API

```
var Ripple = require('ripple');
```

Ripple is a constructor that takes an element or a template string or an element:

```
var ripple = new Ripple();
var template = ripple.compile("<div on-click="save">{{name}}</div>");
var el = template({
  name: 'Tom',
  save: function(event){

  }
});

```

Functionality is added via the `use` method.

```
view
  .use(interpolation)
  .use(formatters)
  .use(textBindings)
  .use(events)
  .use(iterator);
```

Create wrappers around objects that work as adapters.

```
view.bind(model, {
  read: function(data){
  	return this.get(data);
  },
  write: function(data){
  	this.set(data.attr, data.value);
  },
  on: function(type, fn) {
  	this.on(type, fn);
  }
  off: function(type, fn) {
  	this.off(type, fn);
  }
});
```

# notes

https://github.com/schematic/scope

It could render the template in a fragment, do a diff on the actual
element and render the changes
https://github.com/jwerle/dom-observer
