import {Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Artist} from '../models/artist';
import {GLOBAL} from '../services/global';
@Component({
    selector: 'artist-list',
    templateUrl: '../Views/artist-list.html',
    providers: [UserService, ArtistService]
})
export class ArtistListComponent implements OnInit {
    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public confirmado;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userservice: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Artistas';
        this.identity = this._userservice.getIdentity();
        this.token = this._userservice.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }
    ngOnInit() {
        console.log ('artist-list.component.ts cargado');
       this.getArtists();
    }
    getArtists() {
        this._route.params.forEach((params: Params) => {
            let page = +params['page']; // convertido en número
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;
                if (this.prev_page === 0) {
                    this.prev_page = 1;
                }
            }
            this._artistService.getArtists(this.token, page).subscribe(
                response => {
                    if (!response.artists) {
                        this._router.navigate(['/']);
                    } else {
                         this.artists = response.artists;
                    }
                },
                error => {
                    let errorMessage = <any> error;
                    if (errorMessage != null) {
                      let body = JSON.parse(error._body);
                      console.log(error);
                    }
                  }
            );
        });
    }
    onDeleteConfirm(id) {
     this.confirmado = id;
    }
    onCancelArtist() {
        this.confirmado = null;
    }
    onDeleteArtist(id) {
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                if (!response.artist) {
                    alert('Error en el servidor');
                }
                // this.getArtists();
            },
            error => {
                let errorMessage = <any> error;
                if (errorMessage != null) {
                  let body = JSON.parse(error._body);
                  console.log(error);
                }
              }
        );
        this.getArtists();
    }
}