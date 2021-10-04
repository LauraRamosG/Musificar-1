import {Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {GLOBAL} from '../services/global';
import {Album} from '../models/album';
@Component({
    selector: 'album-add',
    templateUrl: '../Views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})
export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userservice: UserService,
        private _albumservice: AlbumService
    ) {
        this.titulo = 'Crear álbum';
        this.identity = this._userservice.getIdentity();
        this.token = this._userservice.getToken();
        this.url = GLOBAL.url;
        this.album = new Album ('', '', 2018, '', '');
    }
    ngOnInit() {
       // console.log('Componente AlbumAddComponent Cargado');
    }
    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let artist_id = params['artist'];
            this.album.artist = artist_id;
            this._albumservice.addAlbum(this.token, this.album).subscribe(
                response => {
                    // respuesta de la BD
                    if (!response.album) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = 'El álbum se ha creado correctamente';
                        this.album = response.album;
                         this._router.navigate(['/editar-album', response.album._id]);
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
}