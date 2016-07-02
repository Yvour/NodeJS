var http = require('http');
var util = require('util');
var url  = require('url');

var server = new http.Server();

server.listen(80, '127.0.0.1');

var request_count = 0.0;

server.on('request', function(req, res){
  var urlParsed = url.parse(req.url, true);
  console.log('the url is ' + util.inspect(urlParsed));
  console.log('The request is ' + util.inspect(req));
  res.end('The answer of request number ' + ++request_count + ' is \n\n' + util.inspect(req));
});