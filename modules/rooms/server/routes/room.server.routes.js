'use strict';

var roomsPolicy = require('../policies/rooms.server.policy'),
	rooms = require('../controllers/rooms.server.controller');

module.exports = function (app) {
	app.route('/api/rooms').all(roomsPolicy.isAllowed)
	.get(rooms.list)    // Get list of rooms
	.post(rooms.create) // Create a new room


	app.route('/api/rooms/:roomId').all(roomsPolicy.isAllowed)
	.get(rooms.enter)   // Enter the room
	.put(rooms.edit)	// Edit the room
	.delete(rooms.remove); // Remove the room

	app.param('roomId', rooms.roomsByID);  //Handle params
}