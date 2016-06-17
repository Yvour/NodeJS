var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({type:"application/json"});




var app = express();
app.set('view engine', 'ejs');
app
		.use('/scripts', express.static(__dirname
				+ '/node_modules/bootstrap/dist/'));

app.use('/app', express.static(__dirname + '/app', app));



// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
	extended : false
})

app.use(bodyParser.urlencoded({
	extended : true
}));


app.get('/', function(req, res) {

	res.render('pages/index', {orders:[]});
});




app.post('/orders/performoperation', jsonParser, function(req, res) {
	var a = req.body;
	
	if (a.operation){
		switch(a.operation){
		case "show_by_company" :
			var param = (a.parameter && a.parameter!='')?{companyName: a.parameter}:{};
			Order.find(param,  {'_id': 0, '__v':0}).exec(function(err, result) {
				if (err != null) {
					res.sendStatus(400);
				} else {

					res.send({data:result, mode:'list'});
				}
				;
			});
			break;
		case "show_by_address" : 
			var param = (a.parameter && a.parameter!='')?{customerAddress: a.parameter}:{};
			Order.find(param,  {'_id': 0, '__v':0}).exec(function(err, result) {
				if (err != null) {
					res.sendStatus(400);
				} else {

					res.send({data:result, mode:'list'});
				}
				;
			});			
			break;
		case "delete_by_orderid" :
			var param = (a.parameter && a.parameter!='')?{orderId: a.parameter}:{};
			if (param){
				Order.remove(param, function(err, obj){
					console.log("the ob is " + JSON.stringify(obj));
					Order.find({},  {'_id': 0, '__v':0}).exec(function(err, result) {
						if (err != null) {
							res.sendStatus(400);
						} else {

							res.send({data:result, mode:'list'});
						}
						;
					});
				});
			}
			break;
		case "display_frequency" :
			
			Order.find({},  {'_id': 0, '__v':0}).exec(function(err, result) {
				if (err != null) {
					res.sendStatus(400);
				} else {

					var counts = result.reduce(
							function(prev, curr){
								console.log('curr is' + JSON.stringify(curr) + ' prev is ' + JSON.stringify(prev))
								if (curr.orderedItem){
								if (!prev[curr.orderedItem]){
									prev[curr.orderedItem] = 1;
								}
								else prev[curr.orderedItem]++;
							}
								return prev;
							}, {}
							);
					var result = [];

					for (var key in counts){
						result.push({orderedItem: key, count:counts[key]})
					}
					res.send({
						mode:'statistics', data: result.sort(function(a,b){
							if (a.count<b.count) return 1;
							if (a.count>b.count) return -1;
							 return 0;
						})});
				}
				;
			});			
			break;
		}
		
	}
		
});




app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

app.locals.renderScriptsTags = function() {

	return ''
			+ [
				//any script											
			].reduce(function(prev, item) {
				return prev + '<script src="' + item + '" defer></script>\n';
			}, '')
}
