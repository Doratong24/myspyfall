var cardgen = require('./cardgen.js');

// Make QRCode
function makeCode(urlText) {
    var sizeQR = 200;
    var qrcode = new qrcode(document.getElementById("qrcode-img"), {
        width: sizeQR,
        height: sizeQR
    });

    if (!urlText) {
        console.log("cannot generate qr code, url is null.");
        return;
    }
    qrcode.makeCode(urlText);
}

var appid, appkey, appsecret;

appid = "Bingo2018";
appkey = "OSk0AwJ4DBt7XeI"
appsecret = "7wvXRvEfBD3LZfRfGhDZ8Xo5y";

// Shows QR code
makeCode("https://rawgit.com/Doratong24/myspyfall/master/src/index.html#" + 
            appid + ":" + appkey + ":" + appsecret);

// Setup microgear
const APPID = appid;
const APPKEY = appkey;
const APPSECRET = appsecret;
var microgear = Microgear.create({
    gearkey: APPKEY,
    gearsecret: APPSECRET,
    alias: "server_spyfall"
});

var serverStartCountdown;
var serverStartSpyfall;
var gameTime;
var playerMax = 8;
var playerMin = 3;
var timespeed = 5000;
var time = 15;
var start = 0;
var myName = "";
var client = [];
var spyfallRole;

// Before game start
function serverStartFunction() {
    // TIme count to get player
    if (time > 0) { 
        if (client.length > playerMin) {
            document.getElementById("countdown").innerHTML = "Wait " + time + " sec.";
            microgear.publish("/spyfall/server", "time|" + time);
            time--;
        }
    } else { // A number of player is satisfied
        start = 1;
        serverStartSpyfall = setInterval(function() {
            startFunction();
        }, timespeed);

        clearInterval(serverStartCountdown);
        document.getElementById("qrcode").style.display = "none";
        document.getElementById("countdown").innerHTML = "";

        microgear.publish("/spyfall/server", "start");

        console.log("Game Start");
    }
}

function stopFunction() {
    clearInterval(serverStartSpyfall);
}

function startFunction() {
    if (start == 1 && time == 0) {
        // Generate character
        spyfallRole = cardgen.card_prepared(client.length);
    }
}

// Microgear get message
microgear.on('message', function (topic, data) {
    var msg = data.split('|');
});

// Microgear connect
microgear.on('connected', function () {
    microgear.subscribe("/spyfall/client");
    console.log("Server start..");
    document.getElementById("status_connect").innerHTML = '<font style="color:#00ff00">Online</font>';
    if (start == 0) document.getElementById("qrcode").style.display = "block";
});

// Microgear disconnect
microgear.on('disconnected', function () {
    document.getElementById("status_connect").innerHTML = '<font style="color:#c0c0c0">Offline</font>';
});

microgear.on('present', function (event) {
    //
});

microgear.on('absent', function (event) {
    //
});

microgear.resettoken(function (err) {
    microgear.connnect(APPID);
});
