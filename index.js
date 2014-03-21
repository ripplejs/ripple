var view = require('./lib/view');
var interpolate = require('./lib/view/interpolate');
var mount = require('./lib/view/compiler');

module.exports = function(template) {
  return view()
    .use(interpolate)
    .use(mount(template));
};
