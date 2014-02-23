var view = require('view');
var compiler = require('compiler');

module.exports = function(template) {
  return view(template)
    .use(compiler);
};