var util = require('util');
var EventEmitter = require('events').EventEmitter;
var TriggerConstants = require('../../trigger-utils/trigger-constants.js');
var _ = require('lodash');

/*
This trigger is able to listen and react to data containing the field data.fullMessage.
The field has to contain a string.
*/
var EmoteTrigger = function (triggerEmotes, notification) {
    var self = this;

    self.emotesToWatch = triggerEmotes;
    self.notification = notification;

    self.execute = function (data) {
        var m = data.message.message;
        for (var i = 0; i < data.message.message.length; i++) {
            var emoteIndex = _.indexOf(self.emotesToWatch, m[i].text);
            if (m[i].type === 'emoticon' && emoteIndex >= 0) {
                console.log(m[i]); // FOR DEBUGGING ONLY
                self.emit(TriggerConstants.triggerFiredEvent, {
                    trigger: 'EmoteTrigger',
                    string: self.emotesToWatch[emoteIndex],
                    notification: self.notification
                });
            }
        }
    }
}
util.inherits(EmoteTrigger, EventEmitter);



module.exports = EmoteTrigger;