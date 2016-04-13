var Beam = require('beam-client-node');
var BeamSocket = require('beam-client-node/lib/ws');

var channel = "channel";
var beam = new Beam();
var socket;

var userID = 0;
var channelID = 0;

//TODO build up a listener list here

beam.use('password', {
    username: 'user'
    , password: 'password'
}).attempt().then(function (res) {
    userID = res.body.id;
    return beam.request('get', '/channels/' + channel);
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
        //console.log(data);
        //console.log(data.message.message);
        //TODO iterate through the listener list and execute them!
        // hand in data at least... mby even add data AND message separately
    });
}).catch(function (err) {
    //If this is a failed request, don't log the entire request. Just log the body
    if (err.message !== undefined && err.message.body !== undefined) {
        err = err.message.body;
    }
    console.log('error joining chat:', err);
});