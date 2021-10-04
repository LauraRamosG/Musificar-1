'use strict'
//var NombreModelo = 'User';
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
} 
//,{ collection: NombreModelo }
// Esto es una prueba de Git
);
module.exports = mongoose.model('User',UserSchema);