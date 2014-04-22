# Composing Views

One of the best things about Views created with Ripple is that you can compose them within each other to create custom elements.

This allows you to export Views for standalone use, like a `List`, but then also dynamically render this list within other views.

Composing views allows you to create custom elements to reference these views. You use the elements attributes to set data on the child view. Here is the example from [React](http://facebook.github.io/react/docs/multiple-components.html) using ripple instead.

```js
  var Avatar = ripple('<img src="http://graph.facebook.com/{{username}}/profile" />');
  var Link = ripple('<a href="http://www.facebook.com/{{username}}">{{username}}</a>');
```

```js
  var Profile = ripple(template)
    .compose('profile-avatar', Avatar)
    .compose('profile-link', Link);
```

This creates custom elements named `avatar` and `link` that we can use within the template. These views are just any other view created with `ripple()`.

```html
  <div class="Profile">
    <profile-avatar username="{{username}}"></profile-avatar>
    <profile-link username="{{username}}"></profile-link>
  </div>
```

This dynamically creates a view and replaces the custom element. Now we can create a `Profile` view and render it:

```js
  var profile = new Profile({
    data: {
      username: 'anthonyshort'
    }
  });
  profile.appendTo(document.body);
```

Which will render:

```html
  <div class="Profile">
    <img src="http://graph.facebook.com/anthonyshort/profile" />
    <a href="http://www.facebook.com/anthonyshort">anthonyshort</a>
  </div>
```

We can then update the values by setting data on the parent view:

```js
  profile.set('username', 'ianstormtaylor');
```

Since we used interpolation in the custom elements `username` attribute, the views will automatically have this value updated whenever the parent changes. This allows you to pass values down the chain of views and have everything in sync and updated automatically.

You can also use static values if you don't need the value to change:

```html
  <profile-avatar username="anthonyshort"></profile-avatar>
```

You might then decide to reuse the `Profile` again within another component:

```js
var ProfileList = ripple('#list');
ProfileList.compose('profile', Profile);
```

```html
<div class="Profile-list">
  <profile username="anthonyshort"></profile>
  <profile username="ivolo"></profile>
  <profile username="ianstormtaylor"></profile>
</div>
```

You can see as you go further and further out you're creating a tree of views and you can update all the children by just changing the state of the parent view. This could be built out to be an entire profile page built with many small components. You could then switch the current user by just changing the `username` property on the parent.
