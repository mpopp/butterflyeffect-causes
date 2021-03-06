var util = require('util');
var EventEmitter = require('events').EventEmitter;
var TriggerConstants = require('../../trigger-utils/trigger-constants.js');

/*
This trigger is able to listen and react to data containing the field data.fullMessage.
The field has to contain a string.
*/
var StringTrigger = function (triggerString, notification) {
    var self = this;

    self.wordToWatch = triggerString;
    self.notification = notification;

    self.execute = function (data) {
        if (data.fullMessage.toLowerCase().indexOf(this.wordToWatch.toLowerCase()) > -1) {
            self.emit(TriggerConstants.triggerFiredEvent, {
                trigger: 'StringTrigger',
                string: self.wordToWatch,
                notification: self.notification
            });
        }
    }
}
util.inherits(StringTrigger, EventEmitter);
module.exports = StringTrigger;