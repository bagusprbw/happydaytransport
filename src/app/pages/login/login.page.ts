import { AccessProviders } from './../../providers/access_providers';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Form, FormBuilder, Validators} from '@angular/forms'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {



  email: String = '';
  password: String = '' ;
  no_hp: String = '';

  loader: any;
 
  disabledButton;


  constructor( 
    private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private accPrvds: AccessProviders,
    public navCtrl: NavController,
    private formBuilder : FormBuilder
 
    ) { }

  ngOnInit() {
  }

  bukaRegister(){
    this.router.navigate(['/register']);
  }

  ionViewDidEnter(){
    this.disabledButton = false;
   }



  async cobalogin() {

    if (this.email === ''){
      this.presentToast('Email / Nomor Hp harus di isi !');
    }else if (this.password === ''){
      this.presentToast('Password harus di isi !');
    }else{
        this.disabledButton = true;
        const loader = await this.loadingCtrl.create({
          message: 'Mohon ditunggu...........',
        });
        loader.present();
        

    
      return new Promise(resolve => {
        const body = {
         aksi: 'proses_login',
         email: this.email,
         no_hp: this.no_hp,
         password: this.password
        };
        
        this.accPrvds.postData(body, 'proses_api.php').subscribe((res: any) => {
             if (res.success === true){
               this.disabledButton = false;
               this.navCtrl.navigateRoot(['/halaman']);
               this.storage.set('storage_xxx', res.result); // create stzz session
               this.presentToast('Login Successfuly');
               loader.dismiss();
               console.log(res);
           }else{
            loader.dismiss();
             this.disabledButton = false;
             this.presentToast('Email atau Password salah');
             console.log(res);
           }
        }, () => {
          loader.dismiss();
           this.disabledButton = false;
           this.presentToast('Timeout');
        });
       });
    }
  }

  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
    });
    toast.present();
  }

  async presentLoading(){
    this.loader = await this.loadingCtrl.create({
      message: 'Mohon ditunggu...........',
    });
    this.loader.present();
  }


}
