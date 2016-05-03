var util = require('util');
var EventEmitter = require('events').EventEmitter;
var TriggerConstants = require('../../trigger-utils/trigger-constants.js');

/*
Counts occurences of a string in chat messages. Emit a notification event if 
the count exceeds the given threshold. Resets the count after emit a notification 
event.
*/
var StringCounterTrigger = function (countString, threshold, notification) {
    var self = this;

    self.stringToCount = countString.toLowerCase();
    self.notification = notification;
    self.cnt = 0;
    self.execute = function (data) {
        if (data.fullMessage.toLowerCase().indexOf(this.stringToCount.toLowerCase()) > -1) {
            self.cnt++
                if (self.cnt > threshold) {
                    self.emit(TriggerConstants.triggerFiredEvent, {
                        trigger: 'StringCounterTrigger',
                        string: self.stringToCount,
                        notification: self.notification
                    });
                    self.cnt = 0;
                }
        }
    }
}

util.inherits(StringCounterTrigger, EventEmitter);

module.exports = StringCounterTrigger;