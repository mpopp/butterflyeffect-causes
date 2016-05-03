var connectionConfig = require('./config/connection.js');
var sprintf = require('sprintf');

/******** SOURCES ******/
var BeamChatSource = require('./beam-chat/beam-chat-source.js');
var BeamLiveLoadingSource = require('./beam-liveloading/beam-liveloading-source.js');

/******** TRIGGERS ******/
var TriggerConstants = require('./trigger-utils/trigger-constants.js');
var FollowTrigger = require('./beam-liveloading/triggers/follow-trigger.js');


var WYDBeamChatConfig = require('./wyd-beam-chat-config.js');
var chatConfig = new WYDBeamChatConfig(connectionConfig);

//notification 
/*{
    media : {
        icon: xy.jpeg
        sound: uv.mp3
    },
    text: "this is your awesome custom notification",
    fade: 123 //in seconds,
    cause: "follow"
}
*/


var gdLiveLoading = new BeamLiveLoadingSource(connectionConfig);

var followTrigger = new FollowTrigger({
    media: {
        icon: "",
        sound: ""
    },
    text: "%s is an awesome persone because follow and stuff!",
    fade: 3, //in seconds,
    cause: "follow"
});


gdLiveLoading.on('followed', function (data) {
    followTrigger.execute(data);
});
/*
gdLiveLoading.on('unfollowed', function (data) {
    console.log(data)
});
*/

/*
gdLiveLoading.on('update', function (data) {
    console.log("hey we got another update!");
    console.log(data);
});
*/

/******* NOTIFICATIONS SERVER ************/
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('ui'));

io.on('connection', function (client) {
    console.log('Client connected....');
    client.emit('notification', {
        media: {
            icon: "",
            sound: ""
        },
        text: "Notification client and server connected successfully!",
        fade: 3, //in seconds,
        cause: "client connect"
    });


    chatConfig.bananaTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });

    chatConfig.kittyEmotesTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });

    chatConfig.chatterTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        event.notification.text = sprintf(event.notification.text, event.chatter);
        client.emit('notification', event.notification);
    });

    chatConfig.daddyTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        event.notification.text = sprintf(event.notification.text, event.chatter);
        client.emit('notification', event.notification);
    });

    chatConfig.resetTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        daddyTrigger.reset();
        //what you would actually do ..
        //triggers.forEach(if(_.isFunction(trigger.reset){trigger.reset()});
    });

    chatConfig.mooseAttentionTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });
    chatConfig.mooseCounter.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });

    followTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        event.notification.text = sprintf(event.notification.text, event.username);
        client.emit('notification', event.notification);
    });

})




server.listen(3000);