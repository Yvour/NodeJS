var Human = require('./human').Human;
var Sir = require('./sir').Sir;


var walter = new Human({birthDate: new Date(1771,7,17)});
walter.name = 'Walter Scott';


var sir_walter = new Sir({birthDate: new Date(1771,7,17)});
sir_walter.manor = 'Abbotsford';

console.log(walter);


console.log(sir_walter);
var fs = require('fs');
var stream = new fs.ReadStream('SirWalterScott.txt');
stream.on('readable', function (){
	var data = stream.read();
	console.log(data);})
stream.on('end', function(){
	console.log('The End');
});