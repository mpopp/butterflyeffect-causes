var connectionConfig = require('./config/connection.js');

/******** SOURCES ******/
var BeamChatSource = require('./beam-chat/beam-chat-source.js');
var BeamLiveLoadingSource = require('./beam-liveloading/beam-liveloading-source.js');

/******** TRIGGERS ******/
var TriggerConstants = require('./trigger-utils/trigger-constants.js');
var StringTrigger = require('./beam-chat/triggers/string-trigger.js');


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


var gdChat = new BeamChatSource(connectionConfig);
//var gdLiveLoading = new BeamLiveLoadingSource(connectionConfig);
var bananaTrigger = new StringTrigger("banana", {
    text: "OMG SOMEONE SAID BANANA!"
});

var gronamTrigger = new StringTrigger("Ken", {
    text: "ASDFASDFASDF!!"
});
gronamTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
    console.log(event.notification.text);
})


bananaTrigger.on(TriggerConstants.triggerFiredEvent, function (event) {
    console.log(event.notification.text);
});


/*
gdLiveLoading.on('update', function (data) {
    console.log("hey we got another update!");
    console.log(data);
});
*/

gdChat.on('ChatMessage', function (data) {
    console.log('executing the chat triggers');
    bananaTrigger.execute(data);
    gronamTrigger.execute(data);
});


/******* NOTIFICATIONS SERVER ************/
var express = require('express');
var app = express();
app.use(express.static('ui'));
app.listen(3000);
var io = require('socket.io')
var server = require('http').createServer(app);

io.on('connection', function(client){
    console.log('Client connected....');
    client.emit('notification',  {
     media : {
         icon: "",
         sound: ""
         },
     text: "Notification client and server connected successfully!",
     fade: 3, //in seconds,
     cause: "client connect"
 });
    
})





