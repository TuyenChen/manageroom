'use strict';

var path = require('path'),
	mongoose = require('mongoose'),
	RoomModel = mongoose.model('RoomModel'),
	UserModel = mongoose.model('User'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function (req, res) {
	var room = new RoomModel(req.body);

	room.save(function (err) {
		if(err) {
			return res.status(422).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(room);
		}
	});
};

exports.list = function (req, res) {
	var roles = (req.user) ? req.user.roles : ['guest'];
	if (roles != 'admin'){
		RoomModel.find({}, '-participants').sort('-created').exec(function (err, rooms) {
			if (err) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(rooms);
			}
		});	
	} else {
		RoomModel.find().sort('-created').exec(function (err, rooms) {
			if (err) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(rooms);
			}
		});
	}
};
exports.myrooms = function (req, res){
	if(req.user == null){
		res.json({"rooms": []});
	}else{
		
		RoomModel.find()
		.populate('participants.user')
		.exec(function (err, rooms) {
			if (err) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				var my_rooms = [];
				for (var i = 0; i < rooms.length; i++) {

					for (var j = 0; j < rooms[i].participants.length; j++) {
						
						if(rooms[i].participants[j].user.username == req.user.username){
							my_rooms.push(rooms[i]);
							break;
						}else{
							console.log('Khong bang');
						}
					}
				}
				console.log(my_rooms);
				res.json(my_rooms);
			}

		});
	}

	
}
exports.first = function (req, res) {
	RoomModel.findOne({}, {}, {}, function (err, room) {
		if (err) {
			return res.status(422).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(room);
		}
	});
}

exports.enter = function (req, res) {
	var room = req.room ? req.room.toJSON() : {};
	//Check permission here
	if (room && req.user && checkIn(room.participants, req.user)) {
	  res.json(room);
	} else {
	  return res.status(403).json({
	    message: 'Ban khong duoc vao phong nay'
	  });
	}
}

function checkIn(participants, user) {

	if (user.roles[0] == 'admin') return true;
  for (var i = participants.length - 1; i >= 0; i--) {
    if (participants[i].user.username == user.username) {
      return true;
    }
  }
  return false;
}

function addUser(req, res, room) {
	UserModel.findOne({username: req.body.sendUser}, function(err, newUser) {
			var _participant = {
				user: newUser,
				role: ["student"]
			};
			room.participants.push(_participant);
			room.save(function (err) {
				if (err) {
					return res.status(422).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(room);
				}
			});
		});
}

function removeUser(req, res, room) {
	UserModel.findOne({username: req.body.sendUser}, function(err, user) {
			for (var i = room.participants.length - 1; i >= 0; i--) {
				if (room.participants[i].user.username == user.username) {
					room.participants.splice(i,1);
				}
			}
			room.save(function (err) {
				if (err) {
					return res.status(422).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(room);
				}
			});
		});
}
function changeRole(req, res, room) {
	for (var i = room.participants.length - 1; i >= 0; i--) {
		if(room.participants[i]._id == req.body.sendUser) {
			var _role = (room.participants[i].roles[0] == 'student')? 'teacher' : 'student'; 
		}
	}
	RoomModel.update({'_id': room._id, 'participants._id': req.body.sendUser, }, {'$set': {
		'participants.$.roles': _role }}, function (err,raw){
		console.log(raw);
	});
}
exports.edit = function (req, res) {
	var room = req.room;
	if (req.body.action == 'changeRole') {
		changeRole(req, res, room);
	} else if (req.body.action == 'addUser') {
		addUser(req, res, room);
	} else if (req.body.action == 'removeUser') {
		removeUser(req, res, room);
	} else {
		console.log(req.body);
		room.name = req.body.name;
		room.description = req.body.description;
		room.maxJoin = req.body.maxJoin;

		room.save(function (err) {
			if (err) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(room);
			}
		});
	}
};

exports.remove = function (req, res) {
	var room = req.room;
	room.remove(function (err) {
		if (err) {
			return res.status(422).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(room);
		}
	});
};

exports.roomsByID = function (req, res, next, id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Room is in valid'
		});
	}

	RoomModel.findById(id).populate('participants.user').exec(function (err, room) {
		if (err) {
			return next(err);
		} else if (!room) {
			return res.status(404).send({
        		message: 'No room with that identifier has been found'
      		});
		}
		req.room = room;
		next();
	});
};