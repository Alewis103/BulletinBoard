var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/board';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine', 'ejs');
app.set('views', './views');

//get all of messages records
app.get('/messages', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('select * from messages', function(err, result) {
            res.render('add', {
                data: result.rows
            });
            done();
            pg.end();
        })
    })
});

//create a record in messages table
app.post('/messages', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(`insert into messages (title,body)  values('${req.body.title}','${req.body.body}' )`, function(err, result) {
            res.redirect("/messages");
            console.log("****INSERT*****");
            done();
            pg.end();
        })
    })
});

//display record by id from table messages
app.get('/posts/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var msg_id = parseInt(req.params.id);
        client.query(`select * from messages where id ='${msg_id}'`, function(err, result) {
            res.render('posts', {
                title: result.rows[0].title,
                body: result.rows[0].body,
                msg_id: msg_id
            });
            done();
            pg.end();
        })
    })
});

//delete record by id from table messages
app.get('/rosts/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var msg_id = parseInt(req.params.id);
        client.query(`delete from messages where id ='${msg_id}'`, function(err, result) {
            res.redirect("/messages");
            console.log("****DELETE*****");
            done();
            pg.end();
        })
    })
});

app.get("*", function(req,res){
  res.redirect("/messages")
});

app.listen(3000, function() {
    console.log("Listening on port 3000")
});
