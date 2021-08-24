import { AccessProviders } from './../../providers/access_providers';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-troli',
  templateUrl: './troli.page.html',
  styleUrls: ['./troli.page.scss'],
})
export class TroliPage implements OnInit {
  datastorage: any;
  name: string;
  alamat: string;
  nama_member: string;
  no_hp: string;
  gambar: any;
  troli: any = [];
  bayar:any =[];
  limit = 13;
  start = 0;
  id_member: number;
  id_booking: number;
  id: number;
  member: number;
  member_id: number;
  total: number;
  jumlah: number;
  
  disabledButton;

  constructor(
    private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private accPrvds: AccessProviders,
    public actRoute: ActivatedRoute,
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.actRoute.params.subscribe((data: any) => {
      console.log(data);
      this.member = data.member;

      
      if (this.member !== 0) {
        this.loadTroli();
      }
    });
  
  }

  ionViewDidEnter() {
    this.storage.get('storage_xxx').then((res) => {
      console.log(res);
      this.datastorage = res;
      this.name = this.datastorage.nama;
      this.member_id = res.id_member;
     });
 
     this.start = 0;
     this.troli = [];
     this.bayar = [];
     this.loadTroli();
  }

  async loadTroli() {
    return new Promise(resolve => {
      const body = {
        aksi: 'load_troli',
        member: this.member,
        member_id: this.member_id
      };
      this.gambar = this.accPrvds.getGambar();
  
      this.accPrvds.postData(body, 'proses_api.php').subscribe((res: any) => {
        if(this.member === this.member_id){
        for (const datas of res.result){
            this.troli.push(datas);
          }
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

  // async loadData(event) {
  //   this.start += this.limit;
  //   setTimeout(() => {
  //     this.loadTroli().then(() => {
  //       event.target.complete();
  //     });
  //   }, 500);
  // }

  async prosesLogout() {
    await this.storage.clear();
    this.navCtrl.navigateRoot(['/halaman']);
    const toast = await this.toastCtrl.create({
      message: 'Logout Successfuly',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
    await this.storage.clear();
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

  async delBooking(a) {
      const alert = await this.alertCtrl.create({
       header: 'Anda ingin hapus pesanan?',
       message: 'Jika anda ingin hapus pesanan tekan "Hapus". jika tidak tekan "Batalkan"',
       buttons:[
        {
          text: 'Batalkan',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Hapus',
          handler: () => {
            return new Promise(resolve => {
              let body = {
                aksi: 'del_booking',
                id_booking: a
              }
        
              this.accPrvds.postData(body, 'proses_api.php').subscribe(async (res: any) => {
                   
                if (res.success == true) {
                  this.presentToast('Booking batal');
                  this.ionViewDidEnter();
                } else {
                  this.presentToast('Pembatalan error');
                }
        
              });
            });
          }
        }
       ]
      });
     await alert.present();
  }

  async openDetail(a){
    
    this.router.navigate(['/troli/' + a]);
  }

}
