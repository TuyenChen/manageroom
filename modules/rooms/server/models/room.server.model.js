'use strict';


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var RoomSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		require: 'Room name cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim:true
	},
	maxJoin: {
		type: Number,
		default: 20,
		trim: true,
	},
	participants: [{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		roles: {
		    type: [{
		    	type: String,
		    	enum: ['student', 'teacher']
		    }],
		    default: ['student'],
		    required: 'Please provide at least one role'
		}
	}]
});

mongoose.model('RoomModel', RoomSchema);