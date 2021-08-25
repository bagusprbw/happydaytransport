import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AccessProviders {
    // url backed api json
    server = 'https://198a-202-152-137-24.ngrok.io/api/';
    gambar = 'https://198a-202-152-137-24.ngrok.io/web_rental/upload/product/';

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
