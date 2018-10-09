const APPID = 'Bingo2018';
const APPKEY = 'OSk0AwJ4DBt7XeI';
const APPSECRET = '7wvXRvEfBD3LZfRfGhDZ8Xo5y';
const APPALIAS = 'client';

// Open client via this link:
// https://rawgit.com/Doratong24/myspyfall/master/src/client.html#Bingo2018:OSk0AwJ4DBt7XeI:7wvXRvEfBD3LZfRfGhDZ8Xo5y

var playerName = prompt("Please enter your name", "");
var playername = encodeURI(playerName);

// var parameters_string = location.hash.substring(1).split(':');

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
    alias: playername
});

var index;
var role, place;
var start = false;
var voteButtonArray;

var player = "client|" + playername;

function sendVote() {
    var vote = document.getElementById("voteSelect").value;
    document.getElementById("voteSelect").style.display = "none";
    document.getElementById("submit").style.display = "none";
    document.getElementById("vote").innerHTML = "You vote for <b>" + vote + "</b>";
    console.log(vote);
    microgear.publish('/spyfall/client', "vote|" + vote);
}

function guessing(place_guess) {
    if (start && voteFinish && role == "Spy") {
        microgear.publish('/spyfall/client', "finally|" + place_guess);
    }
}

microgear.on('message', function (topic, data) {
    var msg = data.split('|');

    // Recieve client index from server
    if (msg[0] == "index" && !start) {
        index = +msg[1];
        // microgear.subscribe('/spyfall/server/client' + index);
        console.log("You are player number " + index);
    }
    // Time countdown and show list of current player in room
    else if (msg[0] == "time" && !start) {
        document.getElementById("checkNumber").innerHTML = 
            "Wait " + msg[1] + " sec.";
        document.getElementById("player_list").innerHTML =
            "Number of player in room: " + msg[2] + "<br>" + msg[3];
    } 
    // Role selection
    else if (msg[0] == "role") {
        start = true;

        place = msg[1];
        role = msg[2];

        document.getElementById("role").style.display = "block";
        document.getElementById("place").style.display = "block";

        document.getElementById("role").innerHTML = "You are at <b>" + place + "</b>";
        document.getElementById("place").innerHTML = "Your role is <b>" + role + "</b>";
        document.getElementById("checkNumber").innerHTML = "";
    
        var htmlText = '';
        for (var i = 0; i < place_list.length; i++) {
            if (i % 3 == 0) { htmlText += '<div class="cols">'; }
            htmlText += '<div class="rows">' +
                '<img src="./places/img/' + place_list[i].name +
                '.png" style="text-align:center;vertical-align:center;width:100%;" ' + 
                'onclick=guessing(' + place_list[i].name + ')></div>';

            if ((i + 1) % 3 == 0) { htmlText += '</div>'; }
            console.log(i + place_list[i].name);
        }
        console.log(htmlText);
        document.getElementById("summary").innerHTML = htmlText;
    } 
    // Game time
    else if (msg[0] == "gameTime") {
        document.getElementById("checkNumber").innerHTML = "<b>" + msg[1] + "</b>";
    }
    // Vote time
    else if (msg[0] == "vote") {
        console.log(msg);
        voteButtonArray = msg[1].split(',');
        document.getElementById("vote").innerHTML = 
            "Who do you think is a spy? " + voteButtonArray[index] + 
            '<input type="button" id="submit" value="Vote!" onclick="sendVote()">' +
            "<br><br>";
    }
    // Vote results
    else if (msg[0] == "voteRes") {
        document.getElementById("voteRes").innerHTML = msg[1];
    }
    // Vote ending & spy guess place
    else if (msg[0] == "voteEnd") {
        voteFinish = true;
        document.getElementById("voteRes").innerHTML = msg[1];
    }
    // The winner is..
    else if (msg[0] == "win") {
        document.getElementById("voteRes").innerHTML += 
            "<br><b>" + msg[1] + " win!</b>";
    }
});

microgear.on('connected', function () {
    microgear.subscribe('/spyfall/server'); // Topic: to recieve overall preview from server
    microgear.subscribe('/spyfall/server/' + playername); // Topic: to recieve role from server
    document.getElementById("status_connect").innerHTML = '<font style="color:#00ff00">Online</font>';
    document.getElementById("player_name").innerHTML = decodeURI(playername);

    microgear.publish('/spyfall/client', player);
});

microgear.on('disconnected', function () {
    microgear.publish('/spyfall/client', "disconnect|" + playername);
    document.getElementById("status_connect").innerHTML = '<font style="color:#c0c0c0">Offline</font>';
});

if (playername.trim() != null && playername.trim().length != 0) {
    console.log(playername.trim());
    microgear.resettoken(function (err) {
        microgear.connect(APPID);
    });
} else {
    document.getElementById("checkNumber").innerHTML = 'Input name Invalid, <a href="javascript:location.reload()">Try again</a>.';
}