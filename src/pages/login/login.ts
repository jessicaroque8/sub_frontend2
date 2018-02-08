import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Angular2TokenService } from 'angular2-token';
import { TabsPage } from '../tabs/tabs'
import { AuthProvider } from '../../providers/auth/auth'
import { LoadingController } from 'ionic-angular';
import { CreateAccountPage } from '../create-account/create-account';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ AuthProvider ]
})
export class LoginPage {

   loginData = {
        email: '',
        password: ''
     };
   output: string;
   pushPage: any;
   pushCreate = CreateAccountPage;
   loaded: boolean;

  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public auth: AuthProvider,
     public _tokenService: Angular2TokenService,
     public loadingCtrl: LoadingController
   ) {
      this.pushPage = TabsPage;
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad LoginPage');
      this.loaded = false;
      if (this._tokenService.userSignedIn()) {
         this.loaded = true;
         this.navCtrl.push(TabsPage);
      }
   }

  signIn(email, password) {
     let loader = this.loadingCtrl.create({
         spinner: 'bubbles',
         showBackdrop: true
     });
     loader.present();

     this.auth.signIn(email, password).toPromise().then( (result) => {
        console.log(result);
        if (result === true) {
           console.log('Sign in success.'),
             loader.dismiss();
             this.navCtrl.push(TabsPage)
        } else {
           console.log('Sign in fail.'),
           this.output = 'Invalid credentials. Please try again.';
        }
     });
   }

   // presentLoading() {
   //    let loader = this.loadingCtrl.create({
   //        duration: 2000,
   //        spinner: 'bubbles',
   //        showBackdrop: true
   //    });
   //    loader.present();
   // }

}
