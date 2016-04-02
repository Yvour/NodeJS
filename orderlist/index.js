var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({type:"application/json"});
var mongoose = require('mongoose');

var str = `001, SuperTrader, Steindamm 80, Macbook
002, Cheapskates, Reeperbahn 153, Macbook
003, MegaCorp, Steindamm 80, Book "Guide to Hamburg"
004, SuperTrader, Sternstrasse 125, Book "Cooking 101"
005, SuperTrader, Ottenser Hauptstrasse 24, Inline Skates
006, MegaCorp, Reeperbahn 153, Playstation
007, Cheapskates, Lagerstrasse 11, Flux compensator
008, SuperTrader, Reeperbahn 153, Inline Skates`;

console.log( 'str is '+ str + ' of')
var init_array = str.split('\n').map(function(el){
	el = el.split(/,\s{0,1}/i)
	var order = {};

	order.orderId = el[0];
	order.companyName = el[1];
	order.customerAddress = el[2];
	order.orderedItem = el[3];	
	return order;
});




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



mongoose.connect('mongodb://localhost:27017/orderlist');

var db = mongoose.connection;
console.log(JSON.stringify(db.collections));
var Order = mongoose.model('Order', {
     orderId: String,
     companyName: String,
     customerAddress: String,
     orderedItem: String
}
)


Order.count({}, function(err, c) {
	console.log("the count is " + c);
	if (0==c)// Ничего нет
		{
		init_array.forEach(
				function(a){
					var the_order = new Order({
						orderId : a.orderId,
						companyName : a.companyName,
						customerAddress : a.customerAddress,
						orderedItem : a.orderedItem,

					});
					the_order.save();
					
				}
				)
		}

  });


Order.remove({});
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
