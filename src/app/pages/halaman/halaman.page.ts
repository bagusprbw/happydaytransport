import { AccessProviders } from './../../providers/access_providers';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule} from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-halaman',
  templateUrl: './halaman.page.html',
  styleUrls: ['./halaman.page.scss'],
})
export class HalamanPage implements OnInit {
  datastorage: any;
  name: any;
  gambar: any;
  users: any = [];
  limit = 13;
  start = 0;
  id_member: any;
  status: string="";
  tipe_kendaraan: any;
  constructor(
    private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private accPrvds: AccessProviders,
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.storage.get('storage_xxx').then((res) => {
     console.log(res);
     this.datastorage = res;
     this.status = res.status;
  

    });

    this.start = 0;
    this.users = [];
    this.loadUsers();

 }
 async loadUsers() {
  return new Promise(resolve => {
    const body = {
      aksi: 'load_mobil',
      start: this.start,
      limit: this.limit
    };
    this.gambar = this.accPrvds.getGambar();

    this.accPrvds.postData(body, 'proses_api.php').subscribe((res: any) => {
        for (const datas of res.result){ // untuk infinity scroll load data
          this.users.push(datas);
          this.status = res.result.status;
        }
        resolve(true);
      });
    });

  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
    });
    toast.present();
  }

  async doRefresh(event) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait.........',
    });
    loader.present();
    this.ionViewDidEnter();
    event.target.complete();

    loader.dismiss();

  }

 async loadData(event) {
    this.start += this.limit;
    setTimeout(() => {
      this.loadUsers().then(() => {
        event.target.complete();
      });
    }, 500);
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

async prosesLogout() {
  this.status 
  this.storage.get('storage_xxx').then(async (res) => {
    if (res === null){
      this.presentAlert('Anda harus "login" terlebih dahulu, jika belum punya akun maka "register" terlebih dahulu ');
    }else{
      this.navCtrl.navigateRoot(['/halaman']);
      const alert = await this.alertCtrl.create({
       header: 'Anda ingin keluar?',
       message: 'Jika anda ingin keluar tekan "Logout". jika tidak tekan "Batalkan"',
       buttons:[
        {
          text: 'Batalkan',
          handler: () => {
            this.router.navigate(['/halaman']);
          }
        }, {
          text: 'Logout',
          handler: async () => {
          await this.storage.clear();
           this.router.navigate(['/halaman']);
             const toast = await this.toastCtrl.create({
              message: 'Logout Successfuly',
              duration: 1500,
              position: 'bottom'
             });
            toast.present();
          }
        }
       ]
      });
     await alert.present();
    }
  });

}

async openDetail(a,b) {
  this.storage.get('storage_xxx').then(async (res) => {
      if (res === null){
        this.presentAlert('Anda harus "login" terlebih dahulu, jika belum punya akun maka "register" terlebih dahulu ');
      }
      else if(b =="Tersedia") {
        this.router.navigate(['/detail/' + a,b]);
    
      }
      else{
        const alert = await this.alertCtrl.create({
          header: 'Mobil Tidak Tersedia !',
          message: 'Silahkan Pilih Yang Lain',
          buttons:[
           {
             text: 'Oke',
             handler: () => {
               this.router.navigate(['/halaman']);
             }
           }
          ]
         });
        await alert.present();
      }
    });
}

}
