var ripple = require('ripple');
var events = require('events');
var template = require('./template.html');

var LikeButton = ripple(template)
  .use(events);

LikeButton.parse(function(){
  return {
    liked: false
  };
});

LikeButton.prototype.toggle = function(){
  this.set('liked', !this.data.liked);
};

module.exports = LikeButton;