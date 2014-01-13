var through = require('through');

function htmlStream(el) {
  return through(function(data){
    el.innerHTML = data;
    this.emit('data', data);
  });
}

function attributeStream(el, attr) {
  return through(function(data){
    if(data == null) el.removeAttribute(attr);
    el.setAttribute(attr, data);
    this.emit('data', data);
  });
}

module.exports = {
  html: createStream,
  attr: attributeStream
};