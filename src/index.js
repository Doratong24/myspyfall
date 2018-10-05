// Index.js acts like a servr side on local machine

function makeCode(urlText) {
    var sizeQR = 200;
    var qrcode = new QRCode(document.getElementById("qrcode-img"), {
        width: sizeQR,
        height: sizeQR
    });

    if (!urlText) {
        console.log("cannot generate qr code, url is null");
        return;
    }
    qrcode.makeCode(urlText);
}

//// -- Fix NETPIE ID -- ////

const APPID = 'Bingo2018';
const APPKEY = 'OSk0AwJ4DBt7XeI';
const APPSECRET = '7wvXRvEfBD3LZfRfGhDZ8Xo5y';
const APPALIAS = 'spyfall_alias';

makeCode("https://rawgit.com/Doratong24/myspyfall/master/src/client.html#"
        + APPID + ":"
        + APPKEY + ":"
        + APPSECRET);

//// -- Extract from url -- ////

// var parameters_string = location.hash.substring(1).split(':');

// const APPID;
// const APPKEY;
// const APPSECRET;
// const APPALIAS = 'spyfall_alias';

// if (parameters_string.length == 3) {
//     APPID = parameters_string[0];
//     APPKEY = parameters_string[1];
//     APPSECRET = parameters_string[2];
//     makeCode("http://rawgit.com/Doratong24/myspyfall/tree/master/src/client.html#"
//         + APPID + ":"
//         + APPKEY + ":"
//         + APPSECRET);
// } else {
//     document.getElementById("nplayer").innerHTML = 'appid or auth invalid<br>http://'
//         + window.location.host + window.location.pathname
//         + '#APPID:KEY:SECRET';
// }

var startCountdown;
var startGame;
var inGameTime;
var gameTime = 1000;
var playerMin = 3;
var playerMax = 8;
var timespeed = 1000;
var time = 15;

var start = false;
var playerName = "";
let player_list = '';

var client = [];

// Create microgear variable
// return object that can be used further
var microgear = Microgear.create({
    key: APPKEY, // key from 'netpie.io'
    secret: APPSECRET,
    alias: APPALIAS // Microgear nickname
});

function timeString(t) {
    var min, sec;
    min = Math.floor(t / 60000).toString();
    sec = Math.floor((t % 60000) / 1000).toString();

    sec = sec.length == 2 ? sec : "0" + sec;

    var time = min + ":" + sec;
    console.log('time: ' + time);

    return time;
}

// Game Start
function startFunction() {
    if (start && time == 0 && gameTime >= 0) {
        var t_str = timeString(gameTime);
        microgear.publish("/spyfall/server", "gameTime|" + t_str);
        gameTime -= 1000;
        document.getElementById("countdown").innerHTML = t_str;
    } 

    if (gameTime < 0) {
        stopFunction();
    }
}

function stopFunction() {
    clearInterval(startGame);
}

// Check if server is already start or not
function serverStartFunction() {
    if (time > 0) {

        // Let start counting when the number of players in the server
        // satisfies witn the required ,imimum number of player
        if (client.length >= playerMin) {
            document.getElementById("countdown").innerHTML = 
                "Wait " + time + " sec.";
            microgear.publish("/spyfall/server", 
                              "time|" + time +
                              "|" + client.length +
                              "|" + player_list);
            time--; // Count time down
        }
    } else {
        console.log(client);
        console.log(client.length);
        start = true;
        var np = client.length;
        var roles = card_prepared(np);

        // Send role and location to each player
        for (var i = 0; i < np; i++) {
            microgear.publish("/spyfall/server/" + client[i],
                "role|" + roles[i].place + 
                "|" + roles[i].occupation);
        }

        startGame = setInterval(function () {
            startFunction();
        }, timespeed);
        clearInterval(startCountdown);
        document.getElementById("qrcode").style.display = "none";
        document.getElementById("countdown").innerHTML = "";

        console.log("Start game..");

        gameTime *= (client.length + 1) * 60;
        console.log(roles);
    }
}

// Connect microgear to NETPIE
microgear.connect(APPID);

// Recieve message from client when register to web
microgear.on('message', function (topic, data) {
    var msg = data.split('|');
    console.log(msg);
    if (msg[0] == "client"){
        // msg[1] : name
        console.log(msg[1]);
        microgear.publish('/spyfall/server/' + msg[1],
                          "index|" + client.length);
        if (typeof(msg[1]) == "string" && !start){

            // Check if that name already exist in room or not
            if (client.indexOf(msg[1]) == -1) {
                clearInterval(startCountdown);
                time = 15;

                client.push(msg[1]);

                document.getElementById("displays").style.display = "block";

                player_list += "<br>" + msg[1];
                document.getElementById("nplayer").innerHTML = 
                    "<b>" + client.length + " player</b>" + player_list;
            }

            if (playerMax != 0 && client.length == playerMax) time = 0;
            startCountdown = setInterval(function () {
                serverStartFunction();
            }, 1000);
        }
    }
});

microgear.on('connected', function () {
    microgear.subscribe("/spyfall/client");
    console.log("Server start..");
    document.getElementById("status_connect").innerHTML = '<font style="color:#00ff00">Online</font>';
    if (start) document.getElementById("qrcode").style.display = "block";
})

microgear.on('disconnected', function () {
    document.getElementById("status_connect").innerHTML = '<font style="color:#c0c0c0">Offline</font>';
})

microgear.resettoken(function (err) {
    microgear.connect(APPID);
});