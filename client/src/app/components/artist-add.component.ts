import {Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {GLOBAL} from '../services/global';
@Component({
    selector: 'artist-add',
    templateUrl: '../Views/artist-add.html',
    providers: [UserService, ArtistService]
})
export class ArtistAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userservice: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Crear nuevo artista';
        this.identity = this._userservice.getIdentity();
        this.token = this._userservice.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
    }
    ngOnInit() {
        // console.log ('artist-add.component.ts cargado');
       // alert( this._artistService.addArtist());
    }
    onSubmit() {
        // console.log (this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {
                // respuesta de la BD
                if (!response.artist) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                    this.alertMessage = 'El artista se ha creado correctamente';
                    this.artist = response.artist;
                    this._router.navigate(['/editar-artista', response.artist._id]);
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
}