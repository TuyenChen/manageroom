'use strict';

var acl = require('acl'),
  mongoose = require('mongoose'),
  RoomModel = mongoose.model('RoomModel');



acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/rooms',
      permissions: '*'
    }, {
      resources: '/api/rooms/:roomId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/rooms',
      permissions: ['get']
    }, {
      resources: '/api/rooms/:roomId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/rooms',
      permissions: ['get']
    }, {
      resources: '/api/rooms/:roomId',
      permissions: ''
    }]
  }]);
};


exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an room is being processed and the current user created it then allow any manipulation
  

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

