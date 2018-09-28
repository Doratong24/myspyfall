const fs = require('fs');

exports.card_prepared = function(np) {
    let num_players = np;

    let rawdata = fs.readFileSync('./src/places.json');
    let places = JSON.parse(rawdata).place;

    let num_place = places.length
    let rand_index = Math.floor((Math.random() * num_place));

    let final_val = getJSON(places[rand_index], num_players);

    return final_val;
}


let getJSON = function (place, np) {
    let place_file = "./src/places/" + place + ".json";
    var filerec = fs.readFileSync(place_file);
    let people = JSON.parse(filerec).people;

    var spy = {"Name": "???", "Occupation": "Spy"};

    people.slice(np - 1);
    people.push(spy);

    people = shuffle(people);

    return people;
}

let shuffle = function (dat) {
    var len = dat.length;
    for(var i = 0; i < len; i++) {
        var randi = Math.floor((Math.random() * len));
        var tmp = dat[i];
        dat[i] = dat[randi];
        dat[randi] = tmp;
        console.log(randi);
    }
    return dat;
}

