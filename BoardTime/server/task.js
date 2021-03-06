var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Task = mongoose.model("Task");
var User = mongoose.model("User");


function chequeaJWT(req, res, next) {
    var tokenOk = false
    var cabecera = req.headers['authorization']
    var campos = cabecera.split(' ')
    if (campos.length > 1 && cabecera.startsWith('Bearer')) {
        var token = campos[1]
        User.findOne({ 'email': req.params.email }, (err, user) => {
            if (user != null) {
                if (token == user.password) tokenOk = true;
                if (tokenOk){
                    next()
                } 
                else {
                    res.status(403).json({ mensaje: "Don't have permisions" })
                }
            }
        })
    }
}

//Routes
//Get task of a user, whit it's email
router.get('/:email/tasks', chequeaJWT, (req, res) => {
    User.findOne({ 'email': req.params.email }, (err, user) => {
        if (err || (user === null)) {
            res.status(400).json({ message: 'Error bad request!.' })
        } else {
            res.status(200).json({ tasks: user.tasks })
        }
    })
});

//Post a new Task of a User
router.post('/:email/tasks', chequeaJWT, (req, res) => {
    User.findOne({ 'email': req.params.email }, (err, user) => {
        if (user != null) {
            user.tasks.push(new Task({ 'name': req.body.name, 'desc': req.body.desc }))
            User.findByIdAndUpdate(user._id, { 'tasks': user.tasks }, function (err, response) {
                if (err) res.status(400).json({ message: "Error in updating person with id " + user._id });
                res.status(200).json({message:'Tarea creada correctamente'})
            });
        }
    })
});

//Detele a Task. 
router.delete('/:email/tasks/:id', chequeaJWT, (req, res) => {
    User.findOne({ 'email': req.params.email }, (err, user) => {
        if (user != null) {
            var taskss = user.tasks.filter((t) => t._id != req.params.id)
            User.findByIdAndUpdate(user._id, { 'tasks': taskss }, function (err, response) {
                if (err) res.status(400).json({ message: "Error in updating person with id " + user._id });
                res.status(200).json({message: 'Tasks deleted.'})
            });
        }
    })
})


//Detele a Task. 
router.delete('/:user/tasks/name/:name', chequeaJWT, (req, res) => {
    User.findOne({ 'name': req.params.user }, (err, user) => {
        if (user != null) {
            var taskss = user.tasks.filter((t) => t.name != req.params.name)
            User.findByIdAndUpdate(user._id, { 'tasks': taskss }, function (err, response) {
                if (err) res.status(400).json({ message: "Error in updating person with id " + user._id });
                res.status(200).redirect('/' + req.params.user + '/tasks')
            });
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    })
})


module.exports = router;