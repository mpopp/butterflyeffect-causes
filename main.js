var Beam = require('beam-client-node');
var BeamSocket = require('beam-client-node/lib/ws');
var conConf = require('./config/connection.js');

var beam = new Beam();
var socket;

var userID = 0;
var channelID = 0;


var chatListeners = [
    //count mooses and trigger at 5!!!
    {
        mooseCount: 0
        , alreadyTriggered: false
        , execute: function (data) {
            if (data.fullMessage.indexOf('!moose') > -1) {
                this.mooseCount++;
            }
            if (this.mooseCount === 2 && !this.alreadyTriggered) {
                //later on there will be awesome stuff when this happens!!!
                console.log("THE GREAT MOOSE IS PLEASED!!!!");
                this.alreadyTriggered = true;
                //think about either resetting the counter here, or disabling the listener completely
            }
        }
    }






    
    , {
        wordToWatch: 'banana'
        , execute: function (data) {
            if (data.fullMessage.toLowerCase().indexOf(this.wordToWatch) > -1) {
                console.log("DID SOMEONE SAY " + this.wordToWatch.toUpperCase() + "?");
                //call something that triggers a notification!
            }
        }
    }





    
    , {
        emoticonToWatch: ':cactus'
        , execute: function (data) {
            for (var i = 0; i < data.message.message.length; i++) {
                var m = data.message.message;
                if (m[i].type === 'emoticon' && m[i].text === this.emoticonToWatch) {
                    console.log("OMG BEWARE OF THE " + this.emoticonToWatch + " (" + this.emoticonToWatch.substring(1) + ")");
                }
            }
        }
    }
    , {
        urlToWatch: 'beam.pro/gamingdaddies'
        , execute: function (data) {
            for (var i = 0; i < data.message.message.length; i++) {
                var m = data.message.message;
                if (m[i].type === 'link' && m[i].text === this.urlToWatch) {
                    console.log("WOAH .. that url: " + this.urlToWatch);
                }
            }
        }
    }

]
var chatPreprocessors = [
    {
        //prettify
        execute: function (data) { //prettify all the stuffz!!!!
            //console.log(data);
            //console.log(data.message.message);
            var concatMessage = "";
            for (var i = 0; i < data.message.message.length; i++) {
                var m = data.message.message;
                concatMessage += m[i].type === 'emoticon' || m[i].type === 'link' ? m[i].text : m[i].data;
            }
            console.log(data.user_name + " wrote: " + //for testing reasons
                concatMessage);
            data.fullMessage = concatMessage;
        }
    }
];



//THIS STUFF DOES THE LIVELOADING TRACKING

var WsabiClientBacon = require('wsabi-client-bacon');
var client = new WsabiClientBacon("wss://realtime.beam.pro/socket.io/");
var channelName = "GamingDaddies";

client.socket.on("open", function () {
    // Send requests to the server with get, put, post, delete, or request.
    client.get("/api/v1/channels/" + channelName).then(function (res) {
        // Subscribe to a live event
        client.live('channel:' + res.id + ':followed').then(function (res) {
            res.onValue(function (value) {
                console.log('Follow/Unfollow', value);
                //TODO: DO SOMETHING USEFUL HERE (call butterflyeffect-effects)
            })
        });
    });
});

//-----------------------------------------


//CHAT TRACKING

beam.use('password', {
    username: conConf.user
    , password: conConf.password
}).attempt().then(function (res) {
    userID = res.body.id;
    return beam.request('get', '/channels/' + conConf.channel);
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
        for (var i = 0; i < chatPreprocessors.length; i++) {
            var preprocessor = chatPreprocessors[i];
            preprocessor.execute(data)
        }

        for (var i = 0; i < chatListeners.length; i++) {
            var listener = chatListeners[i];
            listener.execute(data)
        }
    });
}).catch(function (err) {
    //If this is a failed request, don't log the entire request. Just log the body
    if (err.message !== undefined && err.message.body !== undefined) {
        err = err.message.body;
    }
    console.log('error joining chat:', err);
});