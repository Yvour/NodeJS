
function Finger(data) {
	"use strict"
	this._data = Object.create(null);
	this._data.name = data.name;
	this._data.phalanx_count = (data.phalanx_count) ? (data.phalanx_count)
			: (3)

}

function Limb(data) {
	"use strict";
	this._data = Object.create(null);
	var _data = this._data;
	_data.fingers = Object.create(null);
	_data.fingers.thumb = new Finger({
		name : 'thumb',
		phalanx_count : 2
	});
	_data.fingers.index = new Finger({
		name : 'index'
	});
	_data.fingers.middle = new Finger({
		name : 'middle'
	});
	_data.fingers.ring = new Finger({
		name : 'ring'
	});
	_data.fingers.pinky = new Finger({
		name : 'pinky'
	})

}

function Hand(data) {
	Limb.apply(this, arguments);
}

Hand.prototype = Object.create(Limb.prototype);

var h = new Hand();

var Foot = Hand;

function Human(data) {
	var _data = Object.create(null);
	_data.birthDate = data.birthDate;
	_data.height = data.height;
	_data.weight = data.weight;
	// limbs
	_data.leftHand = new Hand(data.leftHand);
	_data.rightHand = new Hand(data.rightHand);
	_data.leftFoot = new Foot(data.leftFoot);
	_data.rightFoort = new Foot(data.rightFoot);

	this._data = _data;
	this._names = [];

}

Object.defineProperty(Human.prototype, 'name', {
	configurable : true,
	set : function(value) {
		try {
			this._names = value.split(/\s+/);
		} catch (e) {
			this._names = [];
		}
	},
	get : function() {
		return this._names.join(' ');
	}
});

 exports.Human = Human;
