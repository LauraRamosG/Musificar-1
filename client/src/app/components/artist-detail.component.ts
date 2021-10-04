import {Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {GLOBAL} from '../services/global';
@Component({
    selector: 'artist-detail',
    templateUrl: '../Views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})
export class ArtistdetailComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public confirmado;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userservice: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.identity = this._userservice.getIdentity();
        this.token = this._userservice.getToken();
        this.url = GLOBAL.url;
    }
    ngOnInit() {
        // console.log ('artist-edit.component.ts cargado');
       // llamar al metodo del api para sacar un artista en base a su id de getArtist
       this.getArtist();
    }
    getArtist() {
        console.log ('Entrando a getArtist');
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                         this.artist = response.artist;
                         this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            resp => {
                                if (!resp.albums) {
                                    this.alertMessage = 'Este artista no tiene álbums';
                                   // console.log(resp);
                                } else {
                                   this.albums = resp.albums;
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
    onDeleteConfirm(id) {
        this.confirmado = id;
    }
    onCancelAlbum() {
        this.confirmado = null;
    }
    onDeleteAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            responce => {
                if (!responce.album) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                    console.log('Esto es una prueba');
                   this.getArtist();
                }
             },
            error => {
                console.log('Esto es una prueba');
                const errorMessage = <any> error;
                if (errorMessage != null) {
                  const body = JSON.parse(error._body);
                   this.alertMessage = body.message;
                  console.log(error);
                }
              }
        );
    }
}