var connectionConfig = require('./config/connection.js');
var sprintf = require('sprintf');

/******** SOURCES ******/
var BeamChatSource = require('./beam-chat/beam-chat-source.js');
var BeamLiveLoadingSource = require('./beam-liveloading/beam-liveloading-source.js');

/******** TRIGGERS ******/
var TriggerConstants = require('./trigger-utils/trigger-constants.js');
var StringTrigger = require('./beam-chat/triggers/string-trigger.js');
var EmoteTrigger = require('./beam-chat/triggers/emote-trigger.js');
var ChatterTrigger = require('./beam-chat/triggers/chatter-trigger.js');
var BotCommandTrigger = require('./beam-chat/triggers/bot-command-trigger.js');
var ChatlineCounterTrigger = require('./beam-chat/triggers/chatline-counter-trigger.js');
var StringCounterTrigger = require('./beam-chat/triggers/string-counter-trigger.js');


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


//var gdLiveLoading = new BeamLiveLoadingSource(connectionConfig);





var gdChat = new BeamChatSource(connectionConfig);


var bananaTrigger = new StringTrigger("banana", {
    media: {
        icon: "",
        sound: ""
    },
    text: "OMG SOMEONE SAID BANANA!",
    fade: 3, //in seconds,
    cause: "banana"
});

var resetTrigger = new BotCommandTrigger("!reset", {
    media: {
        icon: "",
        sound: ""
    },
    text: "reset trigger",
    fade: 0, //in seconds,
    cause: "reset"
});

var kittyEmotesTrigger = new EmoteTrigger([':KittyLove', ':KittyMB', ':KittyLips', ':KittyBT', ':KittyMartini', ':KittyConfused', ':KittyRage'], {
    media: {
        icon: "",
        sound: ""
    },
    text: "BEST EMOTES ON BEAM CONFIRMED!",
    fade: 3, //in seconds,
    cause: "kitty emote"
});

var chatterTrigger = new ChatterTrigger(['GronamOx', 'alfw', 'Kitty_haz_Claws', 'annabannana06'], false, {
    media: {
        icon: "",
        sound: ""
    },
    text: "%s is talking to us. YAY!",
    fade: 3, //in seconds,
    cause: "chatter"
});

var daddyTrigger = new ChatterTrigger(['GamingDaddyBob', 'GamingDaddyKendo', 'GamingDaddies'], true, {
    media: {
        icon: "",
        sound: ""
    },
    text: "%s entered the Stage! Welcome sir!",
    fade: 3, //in seconds,
    cause: "chatter"
});

var mooseAttentionTrigger = new ChatlineCounterTrigger('!moose', 3, {
    media: {
        icon: "",
        sound: ""
    },
    text: "THE GREAT MOOSE WANTS ATTENTION!",
    fade: 3, //in seconds,
    cause: "chatline counter"
});

var mooseCounters = new StringCounterTrigger('!moose', 2, {
    media: {
        icon: "",
        sound: ""
    },
    text: "ALL THE MOOSE LOVE!",
    fade: 3, //in seconds,
    cause: "string counter"
})

gdChat.on('ChatMessage', function (data) {
    bananaTrigger.execute(data);
    kittyEmotesTrigger.execute(data);
    chatterTrigger.execute(data);
    daddyTrigger.execute(data);
    resetTrigger.execute(data);
    mooseAttentionTrigger.execute(data);
    mooseCounters.execute(data);
});

/*
gdLiveLoading.on('update', function (data) {
    console.log("hey we got another update!");
    console.log(data);
});

gdLiveloading.on('live', function(data){
    //what if your stream dies for .. let's say a minute?
    triggers.forEach(trigger.reset());
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


    bananaTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });

    kittyEmotesTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });

    chatterTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        event.notification.text = sprintf(event.notification.text, event.chatter);
        client.emit('notification', event.notification);
    });

    daddyTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        event.notification.text = sprintf(event.notification.text, event.chatter);
        client.emit('notification', event.notification);
    });

    resetTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        daddyTrigger.reset();
        //what you would actually do ..
        //triggers.forEach(if(_.isFunction(trigger.reset){trigger.reset()});
    });

    mooseAttentionTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });
    mooseCounters.on(TriggerConstants.triggerFiredEvent, function (event) {
        client.emit('notification', event.notification);
    });
})




server.listen(3000);