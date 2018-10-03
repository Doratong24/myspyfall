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

const APPID = 'Bingo2018';
const APPKEY = 'OSk0AwJ4DBt7XeI';
const APPSECRET = '7wvXRvEfBD3LZfRfGhDZ8Xo5y';
const APPALIAS = 'spyfall_alias';

makeCode("https://rawgit.com/Doratong24/myspyfall/tree/master/src/client.html#"
    + APPID + ":"
    + APPKEY + ":"
    + APPSECRET);

var startCountdown;
var startGame;
var gameTime = 1000;
var playerMin = 3;
var playerMax = 8;
var timespeed = 5000;
var time = 15;

var start = false;
var playerName = "";

var client = [];

// Create microgear variable
// return object that can be used further
var microgear = Microgear.create({
    key: APPKEY, // key from 'netpie.io'
    secret: APPSECRET,
    alias: APPALIAS // Microgear nickname
});

// Game Start
function startFunction() {
    if (start && time == 0) {

    }
}

function stopFunction() {
    clearInterval(startGame);
}

// Check if server is already start or not
function serverStartFunction() {
    if (time > 0) {
        if (client.length > 0) {
            document.getElementById("countdown").innerHTML = "Wait " + time + " sec.";
            microgear.publish("/spyfall/server", "time|" + time);
            time--;
            console.log(client);
        }
    } else {
        start = true;
        startGame = setInterval(function () {
            startFunction();
        }, timespeed);
        clearInterval(startCountdown);
        document.getElementById("qrcode").style.display = "none";
        document.getElementById("countdown").innerHTML = "";

        microgear.publish("/spyfall/server", "start");
        console.log("Start game..");

        var np = client.length;
        var roles = card_prepared(np);
        for (var i = 0; i < np; i++) {
            microgear.chat(client[i].alias, roles[i]);
        }
    }
}

// Connect microgear to NETPIE
microgear.connect(APPID);
