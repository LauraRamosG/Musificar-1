'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
var local = 'mongodb://localhost:27017/curso_mean2';
 //mongoose.Promise = global.Promise;
mongoose.connect(local, (err,res) => {
    if(err){
        //throw err;
        console.log('Problema con la conexión hacia MongoDB');
    }else{
        console.log('La conexión a la base de datos se hizo correctamente');

        app.listen(port,function(){
            console.log("Servidor del API Rest escuchando en el puerto: " + port);
        });
    }
});