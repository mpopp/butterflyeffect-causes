var Beam = require('beam-client-node');
var BeamSocket = require('beam-client-node/lib/ws');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/*
 * Creates a websocket connection to the specified channel and forwards the beam chat events to 
 * so that the class is usable as a butterfly source.
 * cofing.username = the username to log into the chat with
 * config.password = password of the user to log into the chat with
 * config.channel = the name of the channel to join
 */
var BeamChatSource = function (config) {
    var beam = new Beam();
    var self = this;
    beam.use('password', {
        username: config.user
        , password: config.password
    }).attempt().then(function (res) {
        userID = res.body.id;
        return beam.request('get', '/channels/' + config.channel);
    }).then(function (res) {
        channelID = res.body.id;
        return beam.chat.join(res.body.id);
    }).then(function (res) {
        var data = res.body;
        socket = new BeamSocket(data.endpoints).boot();
        return socket.call('auth', [channelID, userID, data.authkey]);
    }).then(function () {
        console.log('You are now authenticated!');

        socket.on('ChatMessage', function (data) {

            data = self._preprocessData(data);
            self.emit('ChatMessage', data);
        });
        socket.on('PollStart', function (poll) {
            self.emit('PollStart', poll);
        });
        socket.on('PollEnd', function (poll) {
            self.emit('PollEnd', poll);
        });
        socket.on('UserJoin', function (user) {
            self.emit('UserJoin', user);
        });
        socket.on('UserLeave', function (user) {
            self.emit('UserLeave', user);
        });
    }).catch(function (err) {
        //If this is a failed request, don't log the entire request. Just log the body
        if (err.message !== undefined && err.message.body !== undefined) {
            err = err.message.body;
        }
        console.log('error joining chat:', err);
    });

    self._preprocessData = function (data) {
        var concatMessage = "";
        for (var i = 0; i < data.message.message.length; i++) {
            var m = data.message.message;
            concatMessage += m[i].type === 'emoticon' || m[i].type === 'link' ? m[i].text : m[i].data;
        }
        console.log(data.user_name + " wrote: " + //for testing reasons
            concatMessage);
        data.fullMessage = concatMessage;
        return data;
    }
};
util.inherits(BeamChatSource, EventEmitter);

module.exports = BeamChatSource;