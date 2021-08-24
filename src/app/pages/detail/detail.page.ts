import { AccessProviders } from './../../providers/access_providers';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  gambar: any;
  nama: string;
  status: string;
  id: number;
  users: any = [];
  nama_member: String='';
  id_member: number;
  no_hp: String='';
  nama_kendaraan: String = '';
  tipe_kendaraan: String = '';
  tahun: any = '';
  plat: String = '';
  warna: String = '';
  harga: any='';
  tgl_sewa: String = '';
  jam_pengambilan: String = '';
  foto: String = '';
  total: any='';
  lama_sewa:any='';
  datastorage: any;


  disabledButton;
  constructor(private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private accPrvds: AccessProviders,
    public navCtrl: NavController,
    public actRoute: ActivatedRoute,
    public alertCtrl: AlertController
    
  ) { }

  ngOnInit() {
    this.actRoute.params.subscribe((data: any) => {
      console.log(data);
      this.id = data.id;
      this.status = data.status;

      if (this.id !== 0) {
        this.loadDetail();
      }
    });
  }
  ionViewDidEnter() {
    this.storage.get('storage_xxx').then((res) => {
      console.log(res);
      this.datastorage = res;
      this.id_member = res.id_member;
      this.nama_member = res.nama;
      this.no_hp = res.no_hp;

    });

    this.disabledButton = false;
    this.users = [];
  }
  loadDetail() {
    return new Promise(resolve => {
      const body = {
        aksi: 'load_single_data',
        id: this.id
      };
      this.gambar = this.accPrvds.getGambar();
      this.accPrvds.postData(body, 'proses_api.php').subscribe((res: any) => { 
        this.nama_kendaraan = res.result.nama_kendaraan;
        this.tipe_kendaraan = res.result.tipe_kendaraan;
        this.tahun = res.result.tahun;
        this.plat = res.result.plat;
        this.warna = res.result.warna;
        this.harga = res.result.harga;
        this.foto = this.gambar + res.result.foto;
        
      });
    });
  }

  async booking(a){
    if (this.lama_sewa === ''){
      this.presentToast('Lama sewa harus di isi !');
    }else if (this.tgl_sewa === ''){
      this.presentToast('Tanggal sewa harus di isi !');
    }else if (this.no_hp === ''){
      this.presentToast('Nomor Hp harus di isi !');
    }else if (this.jam_pengambilan === ''){
      this.presentToast('Jam harus di isi !');
    }else{
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Mohon ditunggu...........',
      });
      loader.present();

      return new Promise(resolve =>{
       let body = {
        aksi: 'booking',
        id_member: this.id_member,
        nama_member: this.nama_member,
        no_hp: this.no_hp,
        nama_kendaraan: this.nama_kendaraan,
        tahun: this.tahun,
        plat: this.plat,
        tipe_kendaraan: this.tipe_kendaraan,
        harga: this.harga,
        lama_sewa: this.lama_sewa,
        tgl_sewa: this.tgl_sewa,
        jam_pengambilan: this.jam_pengambilan,
        total: this.lama_sewa * this.harga,
        id:a

       };

       this.accPrvds.postData(body, 'proses_api.php').subscribe(async (res: any) => {
          if(res.success === true){
            loader.dismiss();
            this.disabledButton = false;
            const alert = await this.alertCtrl.create({
              header: 'Perhatian !',
              message: 'Pembayaran booking di lakukan sebelum 24 jam mobil di ambil, Pembayaran bisa dilakukan via transfer atau langsung datang ke kantor',
              buttons:[
               {
                 text: 'Oke',
                 handler: async () => {
                  this.router.navigate(['/halaman']);
                  this.presentToast(res.msg);
                 }
               }
              ]
             });
            await alert.present();
          }else{
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast(res.msg);
          }
       }, ()=>{
          loader.dismiss();
          this.disabledButton = false;
          this.presentAlert('Timeout');
       });

      });
    }

  }

   async presentToast(a){
      const toast = await this.toastCtrl.create({
        message: a,
        duration: 1500,
        position: 'top'
      });
      toast.present();
    }

    async presentAlert(a) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: a,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            handler: () => {
              this.booking(a);
            }
          }
        ]
      });
      await alert.present();
    }

}
