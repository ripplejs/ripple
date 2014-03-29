var ripple = require('ripple');
var each = require('each');
var suffix = require('date-suffix');
var day = require('date-day');
var month = require('date-month');
var intervals = require('intervals');

var pageEl = document.body.firstElementChild;

// Create a view using the pages HTML as a template
var Clock = ripple(pageEl);

// Plugins

Clock.use(intervals);

// Filters

Clock.filter('pad', function (num){
  return String( num < 10 ? '0' + num : num );
});

Clock.filter('date', function(val){
  return suffix(val);
});

Clock.filter('month', function(val){
  return month(val).full();
});

Clock.filter('day', function(val){
  return day(val).full();
});

// When the view is created and rendered
Clock.ready(function(){
  this.tick();
});

// When the view is placed in the DOM
Clock.mounted(function(){
  this.setInterval(this.tick.bind(this), 1000);
});

// Define the default state
Clock.initialize(function(options){
  return {
    time: options.date || new Date(),
    minor: Array(12).map(function(val, index){
      return  360 * index / 12;
    }),
    major: Array(60).map(function(val, index){
      return  360 * index / 60;
    })
  };
});

// Every second this will get called and
// update the current time
Clock.prototype.tick = function(){
  this.set('time', new Date());
};

// Create a new page and replace
// the content with the new view
var clock = new Clock({
  date: new Date()
});

clock.replace(pageEl);