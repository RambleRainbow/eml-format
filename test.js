var fs = require('fs');
var emlformat = require('./lib/eml-format');

var data = fs.readFileSync('./test/fixtures/dz.eml', 'utf-8');
emlformat.read(data, {headersOnly: false}, (err, data) => {
  if (err) return console.log(err);
  console.log(data);
})