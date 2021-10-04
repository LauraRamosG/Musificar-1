'user strict'
var fs =  require('fs');
var path = require('path');
var bcrypt = require ('bcrypt-nodejs');
var User = require ('../models/user');
var jwt = require('../services/jwt');
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando acción controlador de usuario con Nodejs y MongoDB'
    });
}
function saveUser(req, res){
    var user = new User();
    var params = req.body;
    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';
    if(params.password){
      bcrypt.hash(params.password, null,null,function(err,hash){
        user.password= hash;
        if(user.name != null && user.surname != null && user.email != null){
        // Guardar usuario
            //res.status(200).send({message: 'datos correctos'});            
            user.save((err,userStored) => {
                if(err){
                    res.status(500).send({message: 'Error al guardar el usuario'});
                }else{
                    if(!userStored){
                        res.status(404).send({message: 'No se ha registrado el usuario'});
                    }else{
                        res.status(200).send({user: userStored});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'Introduce todos lo datos'});        
        }
      });
    }else{
        res.status(200).send({message: 'Introduce la contraseña'});
    }
}
function loginUser(req, res){
    var params = req.body;
 //   var user = params.user;
    var email = params.email;
    var password = params.password;
    User.findOne({email: email}, (err,user) =>{
        if (err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if (!user){
            res.status(500).send({message: 'El usuario no existe'});
            }else
            // Comprobar la contraseña
            bcrypt.compare(password,user.password,function(err,check){
                if (check){
                    // devolver los datos del usuario logueado
                    if (params.gethash){
                       // devolver un token de jwt 
                       res.status(200).send({token: jwt.createToken(user)});
                    }else{
                        res.status(200).send({user});
                    }
                }else{
                    res.status(404).send({message: 'El usuario no ha podido loguearse'});
                }
            });
        }
    });
}
// Funcion para actualizar datos del usuario 
function updateUser (req,res) {
    var userId = req.params.id;
    var update = req.body;
    // valida que el usuario ID sea el mismo del usuario del Token
    if(userId != req.user.sub){
      return res.status(500).send({message: 'No tienes permiso par actualizar este usuario'});        
    }
    User.findByIdAndUpdate(userId,update,(err,userUpdated) =>{
        if (err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
            }else{
                if (!userUpdated){
                    res.status(404).send({message: 'No se ha actualizado el usuario'});
                }else{
                    res.status(200).send({user: userUpdated});
                }
            }
        }) ;
}
// Funcionalidad para la Carga de imagen asociada al usuario
function uploadImage(req,res){
    var userId = req.params.id;
    var file_name = 'No subido...';
    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg'|| file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name},(err,userUpdated)=>{
                if (!userUpdated){
                    res.status(404).send({message: 'No se ha actualizado el usuario'});
                }else{
                    res.status(200).send({image: file_name, user: userUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Tipo de archivo no válido'});
        }
        console.log (file_split);
    }else{
        res.status(200).send({message: 'La imágen no se ha subido'});
    }
}
function getPrueba(req,res){
    res.status(200).send({message: 'Esto es una prueba'});
}
function getImageFile(req,res){
    //res.status(200).send({message: 'funciona'});
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imágen'});
        }
    });
}
module.exports = {
    pruebas,
    getPrueba,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};