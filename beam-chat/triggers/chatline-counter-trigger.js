var util = require('util');
var EventEmitter = require('events').EventEmitter;
var TriggerConstants = require('../../trigger-utils/trigger-constants.js');
var _ = require('lodash');

/*
    Count number of chat messages until you hit the stopword or exceed the 
    threshold.
    Exceeding the threshold will cause a notification to be emitted.
    The counter is reset after exceeding the threshold.
    Hitting the stopword will cause the counter to be reset.
*/
var ChatlineCounterTrigger = function (stopword, threshold, notification) {
    var self = this;

    self.stopword = stopword;
    self.threshold = threshold;
    self.cnt = 0;
    self.notification = notification;

    self.execute = function (data) {
        if (data.fullMessage.toLowerCase().indexOf(this.stopword) > -1) {
            self.cnt = 0;
        } else {
            self.cnt++;
            if (self.cnt > threshold) {
                self.emit(TriggerConstants.triggerFiredEvent, {
                    trigger: 'ChatlineCounterTrigger',
                    string: self.commandToWatch,
                    notification: self.notification
                });
                self.cnt = 0;
            }
        }


    }
}
util.inherits(ChatlineCounterTrigger, EventEmitter);

module.exports = ChatlineCounterTrigger;