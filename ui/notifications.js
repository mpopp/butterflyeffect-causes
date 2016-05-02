/**
 * Created with IntelliJ IDEA.
 * User: Bernhard
 * Date: 02.05.16
 * Time: 09:53
 * To change this template use File | Settings | File Templates.
 */



//notification
/*
 {
 media : {
 icon: xy.jpeg
 sound: uv.mp3
 },
 text: "this is your awesome custom notification",
 fade: 123 //in seconds,
 cause: "follow"
 } */


function buttonClick() {
    var options = {
        media: {
            icon: 'https://beam.pro/api/v1/users/77554/avatar',
            sound: 'toBeDone'
        },
        text: "this is your very long and awesome custom notification",
        fade: 2,//in seconds,
        cause: "follow"
    };
    showNotification(options);
}


function showNotification(options) {

    setImageUrl(options.media.icon);
    setNotificationText(options.text);
    fadeNotification(options.fade);

}

function fadeNotification(fade){
    $("#notification").fadeIn("slow");
    setTimeout(function(){
        $("#notification").fadeOut("slow");
    }, fade * 1000);

}

function setNotificationText(text) {
    var notificationLabel = $("#notification-header")[0];
    notificationLabel.textContent = text;
}

function setImageUrl(url) {
    var notificationImage = $('#notification-icon')[0];
    if (url === undefined || url.length === 0) {
        notificationImage.attributes.src.value = 'https://beam.pro/api/v1/users/77608/avatar?w=216&h=216&v=0?0';
    } else {
        notificationImage.attributes.src.value = url + '?w=216&h=216&v=0?0';
    }

}

$(document).ready(function () {
    $("#btn1").click(buttonClick);
});
