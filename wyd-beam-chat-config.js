var BeamChatSource = require('./beam-chat/beam-chat-source.js');
var TriggerConstants = require('./trigger-utils/trigger-constants.js');
var StringTrigger = require('./beam-chat/triggers/string-trigger.js');
var EmoteTrigger = require('./beam-chat/triggers/emote-trigger.js');
var ChatterTrigger = require('./beam-chat/triggers/chatter-trigger.js');
var BotCommandTrigger = require('./beam-chat/triggers/bot-command-trigger.js');
var ChatlineCounterTrigger = require('./beam-chat/triggers/chatline-counter-trigger.js');
var StringCounterTrigger = require('./beam-chat/triggers/string-counter-trigger.js');


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

var mooseCounter = new StringCounterTrigger('!moose', 2, {
    media: {
        icon: "",
        sound: ""
    },
    text: "ALL THE MOOSE LOVE!",
    fade: 3, //in seconds,
    cause: "string counter"
})



var WYDBeamChatConfig = function (connectionConfig) {
    var self = this;
    var gdChat = new BeamChatSource(connectionConfig);

    self.bananaTrigger = bananaTrigger;
    self.resetTrigger = resetTrigger;
    self.kittyEmotesTrigger = kittyEmotesTrigger;
    self.chatterTrigger = chatterTrigger;
    self.daddyTrigger = daddyTrigger;
    self.mooseAttentionTrigger = mooseAttentionTrigger;
    self.mooseCounter = mooseCounter;

    gdChat.on('ChatMessage', function (data) {
        self.bananaTrigger.execute(data);
        self.kittyEmotesTrigger.execute(data);
        self.chatterTrigger.execute(data);
        self.daddyTrigger.execute(data);
        self.resetTrigger.execute(data);
        self.mooseAttentionTrigger.execute(data);
        self.mooseCounter.execute(data);
    });
}

module.exports = WYDBeamChatConfig;