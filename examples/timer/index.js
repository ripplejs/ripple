var ripple = require('ripple');

var Timer = ripple('<span>Seconds Elapsed: {{secondsElapsed}}</span>')
  .use(bind)
  .use(intervals);

Timer.parse = function(options) {
  return {
    secondsElapsed 0;
  };
};

Timer.on('mounted', function(view){
  this.setInterval(view.tick, 1000);
});

Timer.prototype.tick = function() {
  this.set('secondsElapsed', this.data.secondsElapsed + 1);
};

module.exports = Timer;