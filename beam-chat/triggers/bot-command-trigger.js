var util = require('util');
var EventEmitter = require('events').EventEmitter;
var TriggerConstants = require('../../trigger-utils/trigger-constants.js');
var _ = require('lodash');

/*
This trigger is able to listen and react to data containing the field data.fullMessage.
The field has to contain a string.
*/
var BotCommandTrigger = function (triggerCommand, notification) {
    var self = this;

    self.commandToWatch = _.toLower(_.startsWith(triggerCommand, '!') ? triggerCommand : '!' + triggerCommand);
    self.notification = notification;

    self.execute = function (data) {
        if (_.startsWith(data.fullMessage.toLowerCase(), self.commandToWatch)) {
            self.emit(TriggerConstants.triggerFiredEvent, {
                trigger: 'BotCommandTrigger',
                string: self.commandToWatch,
                notification: self.notification
            });
        }
    }
}
util.inherits(BotCommandTrigger, EventEmitter);

module.exports = BotCommandTrigger;