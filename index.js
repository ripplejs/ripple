var view = require('view');
var interpolate = require('view-interpolate');
var compiler = require('view-compiler');

module.exports = function(template) {
  return view()
    .use(interpolate)
    .use(compiler(template));
};

