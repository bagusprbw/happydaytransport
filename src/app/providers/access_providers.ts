import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AccessProviders {
    // url backed api json
    server = 'http://127.0.0.1:4040/api/';
    gambar = 'http://127.0.0.1:4040/web_rental/upload/product/';

    constructor(
        public http: HttpClient,
      ) { }


    postData(body, file) {
        const headers = new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
        });
        const options = {
            headers: headers
        };
        return this.http.post(this.server + file, JSON.stringify(body), options).timeout(59000).map(res => res);
    }

    getGambar() {
        return this.gambar;
    }

}
