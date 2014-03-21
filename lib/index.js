var view = require('./view');
var interpolate = require('./view/interpolate');
var mount = require('./view/compiler');

module.exports = function(template) {
  return view()
    .use(interpolate)
    .use(mount(template));
};
