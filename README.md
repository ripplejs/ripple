# Ripple

A DOM binding component based on component/reactive.

```
var Ripple = require('ripple');
```

Ripple is a constructor that takes an element or a template string:

```
var view = new Ripple(el);
```

Bind to observable objects. It will trace down the stack when evaluating the values.
Wrappers are created around each object to unbind everything later

```
view
  .bind(model)
  .bind(view);
```

Functionality is added via the `use` method. They are stacked like middleware in Express.

```
view
  .use(interpolation)
  .use(formatters)
  .use(textBindings)
  .use(events)
  .use(iterator);
  
stream.pipe(view(el));
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

Create custom attribute bindings:

```
view.use(function(next){
  this.attr('hidden', function(el){});
  this.el;
  this.scope;
  next();
});
```

Unbind from individual objects:

```
view.unbind(model);
view.unpipe(stream);
```

Or unbind from all objects:

```
view.unpipe();
```

## Text Bindings

```
	<div data-text="foo.bar.baz"></div>
```

```
view.use(function(next){
	this.attr('data-text', function(el, value){
		
	});
	next();
});
```

## Controller

```
	<div controller="page"></div>
```

```
view.use(function(next){
	this.attr('controller', function(el, attr){
		var child = this.child(this.value(attr));
		el.appendChild(child);
	});
	next();
});
```

## Iteration

```
view.use(function(next){
	this.attr('each', function(el, attr){
		el.parentNode.removeChild(el);
		this.each(attr, function(child){
			this.child(child, el.outerHTML, el.parentNode);
		});		
	});
	next();
});
```