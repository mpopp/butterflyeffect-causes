var EventEmitter = require('events').EventEmitter;
var util = require('util');
var WsabiClientBacon = require('wsabi-client-bacon');

/*
 * Creates a websocket connection to the specified channel and forwards the beam chat events to 
 * so that the class is usable as a butterfly source.
 * cofing.username = the username to log into the chat with
 * config.password = password of the user to log into the chat with
 * config.channel = the name of the channel to join
 */
var BeamLiveloadingSource = function (config) {
    var self = this;
    var client = new WsabiClientBacon("wss://realtime.beam.pro/socket.io/");
    client.socket.on("open", function () {
        // Send requests to the server with get, put, post, delete, or request.
        client.get("/api/v1/channels/" + config.channel).then(function (res) {
            // Subscribe to live events
            client.live('channel:' + res.id + ':followed').then(function (res) {
                res.onValue(function (value) {
                    console.log('Follow/Unfollow', value);
                    if (value.following) {
                        self.emit('followed', value);
                    } else {
                        self.emit('unfollowed', value);
                    }
                })
            });
            client.live('channel:' + res.id + ':update').then(function (res) {

                console.log("requested endpoint for updates, got the following");
                //console.log(res);

                res.onValue(function (value) {
                    //console.log('update', value);
                    self.emit('update', value);
                })
            });
        });
    });
}
util.inherits(BeamLiveloadingSource, EventEmitter);

module.exports = BeamLiveloadingSource;