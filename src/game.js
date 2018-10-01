var parameters_string = location.hash.substring(1).split(':');

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

var appid, appkey, appsecret;
if (parameters_string.length == 3) {
    // appid = parameters_string[0];
    // appkey = parameters_string[1];
    // appsecret = parameters_string[2];
    appid = "Bingo2018";
    appkey = "OSk0AwJ4DBt7XeI"
    appsecret = "7wvXRvEfBD3LZfRfGhDZ8Xo5y";
    makeCode("http://rawgit.com/anunpanya/piebingo/master/client.html#" + appid + ":" + appkey + ":" + appsecret);
} else {
    document.getElementById("nplayer").innerHTML = 'appid or auth invalid<br>http://' + window.location.host + window.location.pathname + '#APPID:KEY:SECRET';
}

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
var playerMax = 20;
var rage = 50;
var timespeed = 5000;
var time = 15;
var start = 0;
var myName = "";
var client = [];
var bingoClient = [];
var bingoClients = [];
var bingoNumbers = [];
function checkClient(id, msgStr) {
    var index_client = client.indexOf(id);
    if (index_client != -1) {
        var msgs = msgStr.split(',');
        var arrCheck = bingoClients[index_client];

        var countCheck = 0;
        for (var i = 0; i < 5; i++) {
            countCheck = 0;
            for (var j = 0; j < 5; j++) {
                if (i == 2 && j == 2) countCheck++;
                else {
                    for (var bingo_check = 0; bingo_check < msgs.length; bingo_check++) {
                        if (parseInt(msgs[bingo_check]) == parseInt(arrCheck[i][j])) {
                            countCheck++;
                        }
                    }
                    if (countCheck == 5) {
                        return true;
                    }
                }
            }
        }

        countCheck = 0;
        for (var i = 0; i < 5; i++) {
            countCheck = 0;
            for (var j = 0; j < 5; j++) {
                if (i == 2 && j == 2) countCheck++;
                else {
                    for (var bingo_check = 0; bingo_check < msgs.length; bingo_check++) {
                        if (parseInt(msgs[bingo_check]) == parseInt(arrCheck[j][i])) {
                            countCheck++;
                        }
                        if (countCheck == 5) {
                            return true;
                        }
                    }
                }
            }
        }

        countCheck = 0;
        for (var i = 0; i < 5; i++) {
            if (i == 2) countCheck++;
            else {
                for (var bingo_check = 0; bingo_check < msgs.length; bingo_check++) {
                    if (parseInt(msgs[bingo_check]) == parseInt(arrCheck[i][i])) {
                        countCheck++;
                    }
                    if (countCheck == 5) {
                        return true;
                    }
                }
            }
        }
        countCheck = 0;
        for (var i = 0; i < 5; i++) {
            if (i == 2) countCheck++;
            else {
                for (var bingo_check = 0; bingo_check < msgs.length; bingo_check++) {
                    if (parseInt(msgs[bingo_check]) == parseInt(arrCheck[i][4 - i])) {
                        countCheck++;
                    }
                    if (countCheck == 5) {
                        return true;
                    }
                }
            }
        }
    }
}
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
function stopFunction() {
    clearInterval(serverStartBingo);
}
function startFunction() {
    if (start == 1 && time == 0 && bingoNumbers.length < rage) {
        var numrandom;
        while (true) {
            numrandom = Math.floor((Math.random() * rage) + 1);
            if (bingoNumbers.indexOf(numrandom) == -1) {
                responsiveVoice.speak(numrandom + "", "Thai Female");
                bingoNumbers.push(parseInt(numrandom));
                break;
            }
        }
        microgear.publish("/bingo/server", "pop|" + bingoNumbers);
        var numberRandom = '';
        for (var i = 0; i < bingoNumbers.length; i++) {
            if ((i + 1) % 10 === 0) {
                if (i == (bingoNumbers.length - 1)) {
                    document.getElementById("nlast").innerHTML = bingoNumbers[i];
                }
                numberRandom += bingoNumbers[i] + "   <br>";
            } else {
                if (i == (bingoNumbers.length - 1)) {
                    document.getElementById("nlast").innerHTML = bingoNumbers[i];
                }
                numberRandom += bingoNumbers[i] + '   ';
            }
        }
        document.getElementById("checkNumber").innerHTML = numberRandom;
    }
    if (bingoNumbers.length == rage) {
        stopFunction();
    }
}
microgear.on('message', function (topic, data) {
    var msg = data.split('|');
    if (msg[0] == "client" && typeof (msg[1]) == "string" && start == 0) {
        if (client.indexOf(msg[1]) == -1) {
            clearInterval(serverStartCountdown);
            time = 15;
            client.push(msg[1]);
            document.getElementById("displays").style.display = "block";
            document.getElementById("nplayer").innerHTML = client.length + " Player";
            var arr_client = msg[2].split(',');
            var arr = [];
            bingoClient = [];
            for (var i = 0; i < arr_client.length; i++) {
                if ((i + 1) % 5 == 0) {
                    bingoClient.push(arr);
                }
                if (i % 5 == 0) {
                    arr = [];
                    arr.push(arr_client[i]);
                } else {
                    arr.push(arr_client[i]);
                }
            }
            bingoClients.push(bingoClient);
            if (playerMax != 0 && client.length == playerMax) time = 0;
            serverStartCountdown = setInterval(function () {
                serverStartFunction();
            }, 1000);
        }
    } else if (msg[0] == "check" && typeof (msg[1]) == "string" && start == 1) {
        var result = checkClient(msg[1], msg[2]);
        if (result) {
            responsiveVoice.speak("บิงโก", "Thai Female");
            microgear.publish("/bingo/server", "BINGO|" + msg[1]);
            document.getElementById('nlast').innerHTML = msg[1];
            stopFunction();
        }
    }
});
microgear.on('connected', function () {
    microgear.subscribe("/bingo/client");
    console.log("Server start...");
    document.getElementById("status_connect").innerHTML = '<font style="color:#00ff00">Online</font>';
    if (start == 0) document.getElementById("qrcode").style.display = "block";
});
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
    microgear.connect(APPID);
});