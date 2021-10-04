import {Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../services/global';
import {Album} from '../models/album';
import {UploadService} from '../services/upload.service';
@Component({
    selector: 'album-edit',
    templateUrl: '../Views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})
export class AlbumEditComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    public filesToUpload: Array<File>;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userservice: UserService,
        private _albumservice: AlbumService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar álbum';
        this.identity = this._userservice.getIdentity();
        this.token = this._userservice.getToken();
        this.url = GLOBAL.url;
        this.album = new Album ('', '', 2018, '', '');
        this.is_edit = true;
    }
    ngOnInit() {
        console.log('Componente AlbumEditComponent cargado');
        // conseguir el album
        this.getAlbum();
    }
    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumservice.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                    }
                },
                error => {
                    const errorMessage = <any> error;
                    if (errorMessage != null) {
                      const body = JSON.parse(error._body);
                      console.log(error);
                    }
                  }
            );
        });
    }
    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumservice.editAlbum(this.token, id, this.album).subscribe(
                response => {
                    // respuesta de la BD
                    if (!response.album) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = 'El álbum se ha actualizado correctamente';
                        if (!this.filesToUpload) {
                            // Redirigir
                        } else {
                            this._uploadService.makeFileRequest(
                            this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                            .then(
                                (result) => {
                                    this._router.navigate(['/artista', response.album.artista]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }
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
        });
    }
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}