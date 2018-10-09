let card_prepared = function (np) {
    let num_players = np;

    let num_place = place_list.length
    let rand_index = Math.floor((Math.random() * num_place));

    let final_val = getRoles(place_list[rand_index], num_players);

    return final_val;
};

let getRoles = function (place, np) {
    var name_place = place.name;
    var all_people = place.people;
    var people = shuffle(all_people);
    people.slice(np - 1);

    var final_list = []
    for (var i = 0; i < np - 1; i++) {
        final_list.push({
            place: name_place,
            occupation: people[i]
        });
    }
    final_list.push({
        place: "???",
        occupation: "Spy"
    });
    final_list = shuffle(final_list);
    return final_list;
};

let shuffle = function (dat) {
    var len = dat.length;
    for (var i = 0; i < len; i++) {
        var randi = Math.floor((Math.random() * len));
        var tmp = dat[i];
        dat[i] = dat[randi];
        dat[randi] = tmp;
        // console.log(randi);
    }
    return dat;
};

