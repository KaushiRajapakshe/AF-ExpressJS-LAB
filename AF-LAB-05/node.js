const express = require('express');
const app = express();
const bodyParser = require('body-parser');
mongoose = require('mongoose');

mongoose.Promise = global.Promise;

app.use(express.json());
app.use(express.static(__dirname ));
app.use(bodyParser());

mongoose.connect('mongodb://localhost:27017/expressjsSample', err => {
   if(err){
       console.log(err);
       process.exit(1);
   }
});

const UserModel = require('./model/userModel');

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});

const users = [];

app.get('/users', (req, res) => {
    UserModel.find().exec().then(users => {
        res.json(users);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.get('/users/:id', (req, res) => {
    UserModel.findById(req.params.id).exec().then(user => {
       res.json(user || {});
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.post('/users', (req, res) => {
    //res.end(JSON.stringify(req.body));
    const user = new UserModel(req.body);
    user.save().then(user => {
        res.json(user);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.put('/users/:id', (req, res) => {
    const condition = { _id: req.params.id};
    const user = new UserModel(req.body);
    user.update(condition,user).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.delete('/users/:id', (req, res) => {
   UserModel.findByIdAndRemove(req.params.id).then(() => {
       res.sendStatus(200);
   }).catch(err => {
       console.error(err);
       res.sendStatus(500);
   });
});

app.listen(3007, err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('app listening on port 3007');
});

