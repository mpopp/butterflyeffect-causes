var util = require('util');
var EventEmitter = require('events').EventEmitter;
var TriggerConstants = require('../../trigger-utils/trigger-constants.js');
var _ = require('lodash');

/*

{"following":true,"user":{"username":"someuser" ... a usual user object}}
*/

/*
This trigger will fire for every follow.
*/
var FollowTrigger = function (notification) {
    var self = this;

    self.notification = notification;

    self.execute = function (data) {
        self.emit(TriggerConstants.triggerFiredEvent, {
            trigger: 'FollowTrigger',
            username: data.user.username,
            notification: _.cloneDeep(self.notification)
        });
    }
}
util.inherits(FollowTrigger, EventEmitter);
module.exports = FollowTrigger;