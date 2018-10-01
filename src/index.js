var restify = require('restify');
var cardgen = require('./cardgen.js');



let db = [];
let count_player = 0;

function respond(req, res, next) {
    res.send('Hello ' + req.params.text);
    next();
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



server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});
