let express = require('express');
let app = express();
let mongoose = require('mongoose');                     // mongoose for mongodb
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

mongoose.connect('mongodb://gerardo:gerardo@jello.modulusmongo.net:27017/za4Nasag');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


  //Port listen to app, change if you want
    app.listen(3000);
    console.log("App listening on port 3000");


    //model in the database
    let Todo = mongoose.model('Todo', {
        text : String
    });

app.get('/api/todos', function(req,res) {
  //use mongoose to get all todos in the database

  Todo.find(function(err,todos) {
    if (err) {
      res.send(err);
    }
    res.json(todos); //return all todos in json
  });
});

//Create todo and send back all todos after creation
app.post('/api/todos',function(req,res) {
  //create a todo, information comes from ajax request

    Todo.create({
      text: req.body.text,
      done : false
    },function(err,todo) {
        if(err){
          res.send(err);
        }
        //get and return todos after create
        Todo.find(function(err, todos) {
          if(err){
            res.send(err);
          }
          res.json(todos);
        });
    });
});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});
