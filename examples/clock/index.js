var ripple = require('ripple');
var each = require('each');
var bind = require('bind-methods');
var intervals = require('intervals');
var template = require('./template.html');

// Create a view using the pages HTML as a template
var Clock = ripple(template)
  .use(each)
  .use(intervals);

// Set the initial state of the view
// This is triggered before rendering
Clock.parse(function(options){
  return {
    time: new Date()
  };
});

// Hook for when the view is created. This fires
// before the view is rendered
Clock.on('created', function(clock){
  clock.setInterval(clock.tick, 1000);
});

// Add interpolation filters
Clock.filter({
  pad: function(num){
    return String( num < 10 ? '0' + num : num );
  },
  suffixedDate: function(val){
    return suffix(val);
  },
  fullMonth: function(val){
    return month(val).full();
  },
  fullDay: function(){
    return day(val).full();
  }
});

// Every second this will get called and
// update the current time
Clock.prototype.tick = function(){
  this.set('time', new Date());
};

module.exports = Clock;