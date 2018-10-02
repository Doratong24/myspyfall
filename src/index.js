var restify = require('restify');
var cardgen = require('./cardgen.js');

let db = [];
let count_player = 0;

var appid, appkey, appsecret;

appid = "Bingo2018";
appkey = "OSk0AwJ4DBt7XeI"
appsecret = "7wvXRvEfBD3LZfRfGhDZ8Xo5y";

const APPID = appid;
const APPKEY = appkey;
const APPSECRET = appsecret;
var microgear = Microgear.create({
    gearkey: APPKEY,
    gearsecret: APPSECRET,
    alias: "server_bingo"
});
var serverStartCountdown;
var serverStartBingo;
var playerMax = 8;
var rage = 50;
var timespeed = 5000;
var time = 15;
var start = 0;
var myName = "";
var client = [];
var bingoClient = [];
var bingoClients = [];
var bingoNumbers = [];

function respond(req, res, next) {
    res.send('Hello ' + req.params.text);
    next();
}

function makeCode(urlText) {
    var sizeQR = 200;
    var qrcode = new QRCode(document.getElementById("qrcode-img"), {
        width: sizeQR,
        height: sizeQR
    });

    if (!urlText) {
        console.log("cannot generate qr code, url is null.");
        return;
    }
    qrcode.makeCode(urlText);
}

var server = restify.createServer();
server.use(restify.plugins.queryParser({ mapParams: false }));
server.use(restify.plugins.bodyParser());

server.get('/', (req, res, next) => {
    res.send('Create Game');
});

server.post('/', (req, res, next) => {
    req.body.id = db.length;
    db.push(req.body);
    count_player++;
    if (count_player > 3) {
        var user = cardgen.card_prepared(count_player);
        res.send(user);
    }
    else res.send("Current players: " + db.length);
});

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});

function serverStartFunction() {
    if (time > 0) {
        if (client.length > 0) {
            document.getElementById("countdown").innerHTML = "Wait " + time + " sec.";
            microgear.publish("/bingo/server", "time|" + time);
            time--;
        }
    } else {
        start = 1;
        serverStartBingo = setInterval(function () {
            startFunction();
        }, timespeed);

        clearInterval(serverStartCountdown);
        document.getElementById("qrcode").style.display = "none";
        document.getElementById("countdown").innerHTML = "";

        microgear.publish("/bingo/server", "start");

        console.log("Start random number bingo...");
    }
}

// server.get('/', (req, res, next) => {

//     res.send(user);
//     next();
// });

// server.get('/users/:userID', (req, res, next) => {

//     res.send("Hello /");
//     next();
// });

// server.post('/users', (req, res, next) => {
//     req.body.id = db.length;
//     count_player++;
//     if (count_player > 3) {
//         var user = cardgen.card_prepared(4);
//     } 
//     db.push(req.body);
//     res.send(200, "register complete");
//     next();
// });

// server.get('/users', (req, res, next) => {
//     res.send(200, db);
//     next();
// });

// server.get('/hello', (req, res, next) => {
//     res.send("Hello /hello");
//     next();
// });


// server.get('/hello/:text', respond);  




