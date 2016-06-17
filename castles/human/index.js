function Human(data)
{
var _data = Object.create(null);

_data.birthDate  = data.birthDate;
this._data = _data;
this._names = [];


}


Object.defineProperty(Human.prototype, 'name',
{
configurable:true,
set: function(value){
try{
this._names = value.split(/\s+/);
}
catch(e){
this._names = [];
}
},
get: function(){return this._names.join(' ');}
}
);



exports.Human = Human;