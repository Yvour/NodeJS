 
 var domain = require('domain');
 var serverDomain = domain.create();
 var server;
 
 
 serverDomain.on('error', function(err){
	 console.log(err);
 });
 
 serverDomain.run(function(){
	 var http = require('http');
	 var handler = require('./handler');
	 server = http.createServer(function(req, res){
		 var reqDomain = domain.create();
		 reqDomain.add(req);
		 reqDomain.add(res);
		 reqDomain.on('error', function(err){
			 res.statusCode = 500;
			 res.end("Sir, " + err);
			 console.log("Error " , req);
			 serverDomain.emit('error', err);
		 });
		 reqDomain.run(function(){
			 handler(req, res);
		 });
	 });
	server.listen(3000); 
 });