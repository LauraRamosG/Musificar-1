'use strict'
var jwt = require ('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';
exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message:'La petición no tiene cabecera'});
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try{
        var payload = jwt.decode(token,secret); // Decodificar 
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'El token ha expirado ' + payload.exp + ' ' +  moment().unix()});
        }
    }catch(ex){
            console.log(ex);
            return res.status(404).send({message:'Token no válido'});
    }
    req.user =payload;
    next();
};