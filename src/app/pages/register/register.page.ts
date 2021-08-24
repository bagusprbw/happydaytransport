import { AccessProviders } from './../../providers/access_providers';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from "@angular/forms";


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nama: string ="";
  alamat: string ="";
  no_hp: string ="";
  email: string ="";
  password: string ="";
  confirm_password: string ="";
  disabledButton;

  constructor( 
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accPrvds: AccessProviders
    
    ) { }

  ngOnInit() {
  }
  ionViewDidEnter(){
   this.disabledButton = false;
  }

 async register(){
    if (this.nama === ''){
      this.presentToast('Nama harus di isi !');
    }else if (this.alamat === ''){
      this.presentToast('Alamat harus di isi !');
    }else if (this.no_hp === ''){
      this.presentToast('Nomor hp harus di isi !');
    }else if (this.email === ''){
      this.presentToast('Email harus di isi !');
    }else if (this.password === ''){
      this.presentToast('password harus di isi !');
    }else if (this.confirm_password !== this.password){
      this.presentToast('password harus sama !');
    }
    else{
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Mohon ditunggu...........',
      });
      loader.present();

      return new Promise(() =>{
       let body = {
        aksi: 'register',
        nama: this.nama,
        alamat: this.alamat,
        no_hp: this.no_hp,
        email: this.email,
        password: this.password
       };

       this.accPrvds.postData(body, 'proses_api.php').subscribe((res: any) => {
          if(res.success === true){
            loader.dismiss();
            this.disabledButton = true;
            this.presentToast(res.msg);
            this.router.navigate(['/login']);
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
            this.register();
          }
        }
      ]
    });
    await alert.present();
  }
}
