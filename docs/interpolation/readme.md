# Interpolation

<p class="Copy-lead">Interpolation gives you the ability to write expressions within your HTML to display data. It can be used with attribute values or in text nodes.</p>

Let's say you have some HTML that looks like this:

```html
<div class="user" hidden="{{inactive}}">
  <img src="{{avatar}}" />
  <span class="user-name">{{name}}</span>
</div>
```

You can create a view to render this as `template`:

```js
var template = require('./template.html');
var Person = ripple(template);

var person = new Person({
  name: 'Tom',
  inactive: false,
  avatar: 'http://placecage.com/100/100'
});
```

Now `person.el` will render as this when mounted:

```html
<div class="user">
  <img src="http://placecage.com/100/100" />
  <span class="user-name">Tom</span>
</div>
```

## Complex Expressions

You can perform complex expressions within the bindings. Within the expression you have access to every property on the view.

```html
{{ 30 * now.getHours() + now.getMinutes() / 2 }}
```

Whatever is returned from the expression will be what replaced the interpolation string. You can imagine this being:

```js
return 30 * now.getHours() + now.getMinutes() / 2;
```

## Automatic Updates

Whenever a property used in an expression changes, the expression will be re-evaluated and rendered.

```js
person.set('name', 'Fred');
```

```html
<div class="user">
  <img src="http://placecage.com/100/100" />
  <span class="user-name"><mark>Fred</mark></span>
</div>
```

## Attribute Bindings

You can use interpolation within attribute values as well.

```html
<img src="{{avatar}}" />
```

These will also be automatically updated. You can also use full strings with expressions in them:

```html
<img title="Avatar for {{user}}" />
```

## Boolean Attributes

Boolean attributes are special HTML in that their value is true of false depending on whether the attribute exists. For example, these two examples will both consider `hidden` to be true.

```html
<img hidden />
<img hidden="false" />
```

The interpolator will know if the attribute is a boolean attribute and add or remove it as needed. For example, using this template:

```js
<img hidden="{{inactive}}" />
```