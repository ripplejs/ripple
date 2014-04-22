var ripple = require('ripple');
var each = require('each');
var intervals = require('intervals');
var bind = require('bind-methods');
var template = require('./template.html');
var suffixed = require('date-suffix');
var month = require('date-month');
var day = require('date-day');

var Clock = ripple(template)
  .use(each)
  .use(bind)
  .use(intervals);

// Hook for when the view is created. This fires
// before the view is rendered
Clock.created(function(){
  this.setInterval(this.tick, 1000);
});

// Add interpolation filters
Clock.filter({
  pad: function(num){
    return String( num < 10 ? '0' + num : num );
  },
  suffixedDate: function(val){
    return suffixed(val);
  },
  month: function(val){
    return month(val).full();
  },
  day: function(val){
    return day(val).full();
  }
});

// Every second this will get called and
// update the current time
Clock.prototype.tick = function(){
  this.set('time', new Date());
};

module.exports = Clock;
