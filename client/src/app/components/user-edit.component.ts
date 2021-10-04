import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {GLOBAL} from '../services/global'
@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url: string;
    public filesToUpload: Array<File>;
    constructor(private _userService: UserService) {
        this.titulo = 'Actualizar mis datos';
        // LocalStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        // this.user = new User('','','','','','ROLE_USER',''); // objeto que se irá modificando
        this.url = GLOBAL.url;
    }
    ngOnInit() {
        console.log('user-edit.component.ts cargado');
    }
    onSubmit() {
        // console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
        response => {
            if (!response.user) {
                this.alertMessage = 'El usuario no se ha actualizado';
            } else {
                 // this.user = response.user; // devuelve los datos del api
                localStorage.setItem('identity', JSON.stringify(this.user));
                document.getElementById('identity.name').innerHTML = this.user.name;
                if (!this.filesToUpload) {
                    // redirección
                } else {
                    this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                        (result: any) => {
                            // recoger el resultado de la peticion ajax
                            this.user.image = result.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));

                            // para actulizar la imagen del menu
                            const image_path = this.url + 'get-image-user/' + this.user.image;
                            document.getElementById('image-logged').setAttribute('src', image_path);
                            // console.log(this.user);
                        }
                    );
                }
              this.alertMessage = 'El usuario se ha actualizado correctamente';
            }
        },
        error => {
            const errorMessage = <any> error;
            if (errorMessage != null) {
              const body = JSON.parse(error._body);
              this.alertMessage = body.message;
              console.log(error);
            }
          }
        );
    }
    fileChangeEvent(fileInput: any) {
        // recoge los archivos seleccionados en el input
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    // Peticion ajax para sur archivos
    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        const token = this.token;
        // lanza el código de la subida
        return new Promise(function(resolve, reject) {
            const formData: any = new FormData(); // para simular el comportamiento de un formulario normal
            const xhr = new XMLHttpRequest();  // petición ajax
            for (let i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}