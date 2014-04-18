var ripple = require('ripple');
var template = require('template');
var events = require('events');
var markdown = require('markdown');
var refs = require('refs');

var MarkdownEditor = ripple(template)
  .use(events)
  .use(markdown)
  .use(refs);

// This is fired whenever the inputs "input" event is fired
MarkdownEditor.prototype.change = function() {
  this.set('text', this.refs.text.value);
};

module.exports = MarkdownEditor;