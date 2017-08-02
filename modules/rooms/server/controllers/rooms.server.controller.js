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
	if (req.user.roles != 'admin'){
		RoomModel.find({}, '-participants').sort('-created').exec(function (err, rooms) {
			if (err) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				console.log(' role khac admin!');
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
  for (var i = participants.length - 1; i >= 0; i--) {
    if (participants[i].user.username == user.username) {
      return true;
    }
  }
  return false;
}

exports.edit = function (req, res) {
	var room = req.room;
	if (!!req.body.changerole) {
		for (var i = room.participants.length - 1; i >= 0; i--) {
			if (room.participants[i].user.username == req.body.changerole) {
				if (room.participants[i].roles[0] == 'student') {
					room.participants[i].roles[0] = 'teacher';
					room.save();
				} else {
					room.participants[i].roles[0] = 'student';
					room.save();
				}
				break;
			}
		}
	} else if (!!req.body.newUser) {
		UserModel.findOne({username: req.body.newUser}, function(err, newUser) {
			var _participant = {
				user: newUser,
				role: ["student"]
			};
			room.participants.push(_participant);
			console.log(room.participants);
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
		// console.log(req.body);
	} else if (!!req.body.deleteUser) {
		UserModel.findOne({username: req.body.deleteUser}, function(err, user) {
			for (var i = room.participants.length - 1; i >= 0; i--) {
				if (room.participants[i].user.username == user.username) {
					room.participants.splice(i,1);
				}
			}
			console.log(room.participants);
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
	} else {
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