
var Human  = require('../human').Human;

function Sir(data){
  Human.apply(this, arguments);
  this._data.isSir = true;
  this._data.isGentleman = true;
}

Object.defineProperty(Sir.prototype, 'manor',{
configurable:true,
enumerable:true,
set: function(value){this._data._manor = value.split('/\s+/').join(' ');},
get: function(value){return this._data._manor}
});

exports.Sir = Sir;
