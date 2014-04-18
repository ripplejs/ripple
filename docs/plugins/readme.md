# Creating plugins

Plugins are a core part of ripple. They allow you to add new filters, directives, and components. They can also be used to extend the functionality of the `View`.

A common plugin is the `events` plugin. This replicates some of the `on-event` things you might be used to in Angular or other libraries, and is similar to doing `onClick={this.method}` in React.

First we need to add the plugin. You can get it at [ripplejs/events](https://github.com/ripplejs/events). This will allow us to bind methods in the `View` to DOM elements declaratively:

```html
<button on-click="submit">Save</button>
```

Then we use the plugin and give it some methods:

```js
Person.use(events);

Person.prototype.submit = function(event) {
  // Button clicked  
};
```

## Creating Plugins

Plugins use the `use` pattern. Each `View` has a a `.use` method for applying plugins. This expects a function. That function will be passed the current `View`.

```js
function plugin(View) {
  // Do things
}

View.use(plugin);
```

This pattern allows us to chain `.use` calls:

```js
View
  .use(plugins)
  .use(plugin)
  .use(another)
```

And allow use to pass options in by making our plugin a function that returns a function:

```js
function plugin (options) {
  return function (View) {
    // Do things
  };
}

View.use(plugin({
  duration: 300
}));
```

Within plugins you'll usually be adding filters or directives.

```js
function plugin(View) {
  View.directive('test', function(value, el, view){
    console.log(value);
  });
}

View.use(plugin);
```

This allows you to easily share functionality between views.