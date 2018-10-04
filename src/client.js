// var parameters_string = location.hash.substring(1).split(':');

const APPID = 'Bingo2018';
const APPKEY = 'OSk0AwJ4DBt7XeI';
const APPSECRET = '7wvXRvEfBD3LZfRfGhDZ8Xo5y';
const APPALIAS = 'client';

var playername = prompt("Please enter your name", "");

// Open client via this link:
// https://rawgit.com/Doratong24/myspyfall/master/src/client.html#Bingo2018:OSk0AwJ4DBt7XeI:7wvXRvEfBD3LZfRfGhDZ8Xo5y

// const APPID;
// const APPKEY;
// const APPSECRET;
// const APPALIAS = 'client';

// if (parameters_string.length == 3) {
//     APPID = parameters_string[0];
//     APPKEY = parameters_string[1];
//     APPSECRET = parameters_string[2];

//     var playername = prompt("Please enter your name", "");
// } else {
//     document.getElementById("checkNumber").innerHTML = 'appid or auth invalid<br>http://'
//         + window.location.host + window.location.pathname
//         + '#APPID:KEY:SECRET';
// }

var microgear = Microgear.create({
    gearkey: APPKEY,
    gearsecret: APPSECRET,
    alias: APPALIAS
});

var role, place;
var start = false;


var player = "client|" + playername;
microgear.chat('spyfall_alias', player);

microgear.on('message', function (topic, data) {
    var msg = data.split('|');
    if (msg[0] == "time" && !start) {
        document.getElementById("checkNumber").innerHTML = "Wait " + msg[1] + " sec.";
    } else if (msg[0] == "role") {
        start = true;

        role = msg[1];
        place = msg[2];

        document.getElementById("role").style.display = "block";
        document.getElementById("place").style.display = "block";
        
        document.getElementById("role").innerHTML = "Your role is <b>" + role + "</b>";
        document.getElementById("place").innerHTML = "You are at <b>" + place + "</b>";
        document.getElementById("checkNumber").innerHTML = "";
    }
});

microgear.on('connected', function () {
    microgear.subscribe('/spyfall/server');
    document.getElementById("status_connect").innerHTML = '<font style="color:#00ff00">Online</font>';
    document.getElementById("player_name").innerHTMl = playername;

    console.log('connected');
});

microgear.on('disconnected', function () {
    document.getElementById("status_connect").innerHTML = '<font style="color:#c0c0c0">Offline</font>';
});

if (playername.trim() != null && playername.trim().length != 0) {
    console.log('trim!');
    microgear.resettoken(function (err) {
        console.log('reset token');
        microgear.connect(APPID);
    });
} else {
    document.getElementById("checkNumber").innerHTML = 'Input name Invalid, <a href="javascript:location.reload()">Try again</a>.';
}