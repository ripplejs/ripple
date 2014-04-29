var ripple = require('ripple');
var intervals = require('intervals');
var bind = require('bind-methods');

var Timer = ripple('<span>Seconds Elapsed: {{secondsElapsed}}</span>')
  .use(bind)
  .use(intervals);

// Hook for when the view is created. This fires
// before the view is rendered
Timer.created(function(){
  this.set('secondsElapsed', 0);
  this.setInterval(this.tick, 1000);
});

// Every second this will get called and
// update the current time
Timer.prototype.tick = function() {
  this.set('secondsElapsed', this.data.secondsElapsed + 1);
};

module.exports = Timer;