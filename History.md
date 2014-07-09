
0.5.3 / 2014-07-09
==================

* Optionally use `new` when creating views
* Fixed issue with expressions failing and not returning null

0.5.2 / 2014-06-16
==================

 * Added `initialize`. If this method exists, it will be called after the `created` event.

0.5.1 / 2014-06-15
==================

* Fixed issue with text bindings not rendering elements if there was whitespace around it

0.5.0 / 2014-06-14
==================

* removed the `scope` option. This cleaned up a lot of code, but it means the each plugin won't work in it's current state. Instead, we'll prefer to pass in views instead of just building sub-views from templates. It makes the library smaller and the code more maintainable.
* Removed the need to use `.parse`. 
* Views now have the signature `new View(attrs, options)` instead of using the `data` property.
* New `View.attr` method for defining attributes. This lets us create getters/setters and means plugins can do cool things with the attributes (like making them required, setting defaults or enforcing a type).
* Once attributes are defined using `attr` you can access them like `view.name = 'foo'` instead of doing `view.set('name', 'foo')`. Although the get and set methods still exist.
* Removed a bunch of the files and make it simpler. Specifically removed the `model`.
* Views now have a unique ID
* Consistent code formatting
* Owner can only be set once and can't be changed. If this restriction doesn't work in practice we can revisit.
* Text bindings will render objects that have a .el property. This means you can set other views as attributes on a view and it will render it.
* Removed `create` and the ability to create child views. This was only used for the each plugin. Instead, create views and add their plugins manually. Less magic.
* Interpolator can't be accessed now, meaning you can't change delimiters. This is an edge case and probably doesn't need to be used, it now means we don't need a different interpolator for every view created.
* Bumped component to v1.
* Directives now remove the attributes from the template before rendering

0.4.0 / 2014-04-29
==================

 * Allow watching for all changes with `view.watch(callback)`
 * Using an updated/simplified path observer - `0.2.0`
 * Added `view.create` method for creating child views with the same bindings
 * Moved `render` into the view so it can be modified by plugins. eg. virtual dom

0.3.5 / 2014-04-23
==================

 * Added make targets for releases

0.3.4 / 2014-04-23
==================

 * Fixed before/after helper methods
 * Updated examples README.md
 * Updated clock example

0.3.3 / 2014-04-19
==================

 * Merge pull request #11 from olivoil/master
 * Continue walking DOM nodes after child binding
 * Merge pull request #6 from Nami-Doc/patch-1
 * Fix small typo
 * Added docs on composing views
 * Updated docs

0.3.2 / 2014-04-16
==================

 * Using raf-queue which is a simpler version of fastdom
 * Made requirable by browserify
 * Added docs and examples

0.3.0 / 2014-04-13
==================

 * Allow custom templates per view

0.2.3 / 2014-04-13
==================

 * Passing el and view through to directives to reduce use of confusing `this`
