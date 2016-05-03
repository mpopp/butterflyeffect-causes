var util = require('util');
var EventEmitter = require('events').EventEmitter;
var TriggerConstants = require('../../trigger-utils/trigger-constants.js');
var _ = require('lodash');

/*
This trigger is able to listen and react to data containing the field data.fullMessage.
The field has to contain a string.
*/
var ChatterTrigger = function (chatters, once, notification) {
    var self = this;

    self.chattersToWatch = _.map(chatters, _.toLower);
    self.notification = notification;
    self.triggered = false;
    self.once = once;

    self.execute = function (data) {
        if (self.once && self.triggered) return; //return guard 
        self.triggered = true;
        var chatterIndex = _.indexOf(self.chattersToWatch, data.user_name.toLowerCase());
        if (chatterIndex >= 0) {
            self.emit(TriggerConstants.triggerFiredEvent, {
                trigger: 'ChatterTrigger',
                chatter: self.chattersToWatch[chatterIndex],
                notification: _.cloneDeep(self.notification)
            });
        }
    }
    self.reset = function () {
        self.triggered = false;
    }
}
util.inherits(ChatterTrigger, EventEmitter);

module.exports = ChatterTrigger;