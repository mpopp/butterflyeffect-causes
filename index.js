var connectionConfig = require('./config/connection.js');

/******** SOURCES ******/
var BeamChatSource = require('./sources/beam-chat-source.js');
var BeamLiveLoadingSource = require('./sources/beam-liveloading-source.js');

/******** TRIGGERS ******/
var TriggerConstants = require('./triggers/trigger-constants.js');
var StringTrigger = require('./triggers/string-trigger.js');


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