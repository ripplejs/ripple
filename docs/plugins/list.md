# Plugins

A big part of ripple's philosophy is that it provides only a minimal
foundation for reactive views and you can extend it however you wish.

## events

Easily add event listeners to the DOM and call methods on the view, like
`on-click`, `on-scroll` etc.

[View on Github](https://github.com/ripplejs/events)

## each

Basic iteration using the `each` directive.

[View on Github](https://github.com/ripplejs/each)

## bind-methods

Bind all methods on the prototype to the view. This means you don't need to
do `var self = this` or worry about the context of event handlers.

[View on Github](https://github.com/ripplejs/bind-methods)

## markdown

Adds a directive to render markdown using Marked.

[View on Github](https://github.com/ripplejs/markdown)

## extend

Makes add methods to the view prototype a little cleaner and more comfortable
for people used to working with libraries like React or Backbone.

[View on Github](https://github.com/ripplejs/extend)

## intervals

Easily use `setInverval` that will be automatically created and removed when the
view is added to or removed from the DOM.

[View on Github](https://github.com/ripplejs/intervals)

## computed

Add computed properties. Useful for setting a property that needs to automatically
update when other properties update.

[View on Github](https://github.com/ripplejs/computed)

## refs

Easily reference elements within the template like in React.

[View on Github](https://github.com/ripplejs/refs)

## dispatch

Dispatch custom DOM events from a view so that parent views can listen
for them. This makes it easier for a child to disconnect itself from parent views.

[View on Github](https://github.com/ripplejs/dispatch)