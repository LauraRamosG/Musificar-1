import {Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {Album} from '../models/album';
import {AlbumService} from '../services/album.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from '../services/global';
@Component({
    selector: 'album-detail',
    templateUrl: '../Views/album-detail.html',
    providers: [UserService, AlbumService]
})
export class AlbumDetailComponent implements OnInit {
    public titulo: string;
    public album: Album;
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
        private _albumService: AlbumService
    ) {
        this.identity = this._userservice.getIdentity();
        this.token = this._userservice.getToken();
        this.url = GLOBAL.url;
    }
    ngOnInit() {
         console.log ('album-edit.component.ts cargado');
       this.getAlbum();
    }
    getAlbum() {
        console.log('El método getAlbum fuciona');
        // console.log ('entrando a getArtist');
        // this._route.params.forEach((params: Params) => {
        //     let id = params['id'];
        //     this._artistService.getArtist(this.token, id).subscribe(
        //         response => {
        //             if (!response.artist) {
        //                 this._router.navigate(['/']);
        //             } else {
        //                  this.artist = response.artist;
        //                  this._albumService.getAlbums(this.token, response.artist._id).subscribe(
        //                     resp => {
        //                         if (!resp.albums) {
        //                             this.alertMessage = 'Este artista no tiene álbums';
        //                            // console.log(resp);
        //                         } else {
        //                            this.albums = resp.albums;
        //                         }
        //                      },
        //                     error => {
        //                         const errorMessage = <any> error;
        //                         if (errorMessage != null) {
        //                           const body = JSON.parse(error._body);
        //                            this.alertMessage = body.message;
        //                           console.log(error);
        //                         }
        //                       }
        //                  );
        //             }
        //         },
        //         error => {
        //             const errorMessage = <any> error;
        //             if (errorMessage != null) {
        //               const body = JSON.parse(error._body);
        //                this.alertMessage = body.message;
        //               console.log(error);
        //             }
        //           }
        //     );
        // });
    }
}