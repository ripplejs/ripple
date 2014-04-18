# Filters

Filters are used in expressions to modify data. It's an easy to separate your display logic from your model data.

Using filters looks like this:

```html
<div>{{ title | uppercase }}</div>
```

In this case, the `title` property will be passed through the `uppercase` filter. Behind the scenes filter functions look like this:

```js
function(value) {
  return value.toUppercase();
}
```

## Creating filters

Creating new filters is very easy. The `View` object has a `filter` method that takes a name and a function.

```js
var View = ripple('<div>{{name | uppercase}}</div>');

View.filter('uppercase', function(value){
  return value.toUpperCase();
});
```

Filters can be re-used and shared as plugins easily. Here's what a plugin that adds this filter might look like:

```js
module.exports = function(View){
  View.filter('uppercase', function(value){
    return value.toUpperCase();
  });
};
```

Then you can require and use this plugin:

```js
var uppercasePlugin = require('uppercase');
Person.use(uppercasePlugin);
```

This makes it very easy to create plugins to do things like code highlighting, markdown conversion, and date and number formatting.

## Chaining Filters

You can chain filters to pipe the value through multiple.

```html
<div>{{ title | uppercase | lowercase }}</div>
```

In this case the value will go through the `uppercase` filter and then that value will be passed to the `lowercase` filter.

You can chain as many filters as you like.

## Arguments

You can also pass arguments to filters:

```html
<div>{{ posted | date:%B %d, %Y at %I:%M%P }}</div>
```

Arguments start after `:` and are separated by a `,`. In this case, the function will be passed `%B %d` and `%Y at %I:%M%P`.

The filter function might look something like this:

```js
function(value, date, time) {
  // date === %B %d
  // time === %Y at %I:%M%P
}
```

Lastly, you can also wrap arguments in quotes if it contains a comma and you don't want two arguments passed in.

```html
<div>{{ posted | date:"%B %d, %Y at %I:%M%P" }}</div>
```