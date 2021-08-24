import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from './providers/access_providers';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  datastorage: any;
  name: string;
  alamat: string;
  nama_member: string;
  no_hp: string;
  gambar: any;
  users: any = [];
  limit = 13;
  start = 0;
  id_member: number;
  id: number;
  member: number;
  a: any;
  status: any;
  disabledButton;
  constructor(
    private platform: Platform,

    private storage: Storage,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private accPrvds: AccessProviders,
    public actRoute: ActivatedRoute,
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {

  }

  ngOnInit() {
    this.storage.get('storage_xxx').then((res) => {
      console.log(res);
      this.datastorage = res;
      this.member = this.datastorage.id_member;
     });

  }

  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: a,
      backdropDismiss: true,
      buttons: [
        {
          text: 'Register',
          handler: () => {
            this.router.navigate(['/register']);
          }
        }, {
          text: 'Login',
          handler: () => {
           this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }


  async openTroli(member){
    this.storage.get('storage_xxx').then((res) => {
      if (res === null){
        this.presentAlert('Anda harus "login" terlebih dahulu, jika belum punya akun maka "register" terlebih dahulu ');
      }else{
        this.router.navigate(['/troli/' + member]);
      }
    });

  }

 

    // this.storage.get('storage_xxx').then((res) => {
    //   if (res === null){
    //     this.navCtrl.navigateRoot('/login');
    //   }else{
    //     this.navCtrl.navigateRoot('/halaman');
    //   }
    // });

}
