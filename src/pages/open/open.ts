import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SubRequestsProvider } from '../../providers/sub-requests/sub-requests';
import { SubRequest } from '../../models/sub-request.model';
import { UsersProvider } from '../../providers/users/users';
import { ShowSubRequestPage } from '../sub-request/show-sub-request/show-sub-request';
import { User } from '../../models/user.model';
import { LoadingController } from 'ionic-angular';
import { RepliesProvider } from '../../providers/replies/replies';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Sendee } from '../../models/sendee.model';
import { MindBodyProvider } from '../../providers/mind-body/mind-body';
import { CreateSubRequest1Page } from '../sub-request/create-sub-request1/create-sub-request1';
import { SelectedSubsProvider } from '../../providers/selected-subs/selected-subs';

@IonicPage()
@Component({
  selector: 'page-open',
  templateUrl: 'open.html',
})
export class OpenPage {

   view: string;
   sent: Array<SubRequest> = [];
   incoming: Array<SubRequest> = [];
   loaded: boolean = false;
   errorLoadingSent: boolean = false;
   errorLoadingIncoming: boolean = false;
   currentUser: any;
   pushPage = CreateSubRequest1Page;


  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public sr: SubRequestsProvider,
     public users: UsersProvider,
     public loadingCtrl: LoadingController,
     public replies: RepliesProvider,
     public auth: AuthProvider,
     public toastCtrl: ToastController,
     public alertCtrl: AlertController,
     public mb: MindBodyProvider,
     public subs: SelectedSubsProvider,
   ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpenPage');
    this.view = 'incoming';
   }

   ionViewWillEnter() {
      this.loaded = false;
      let loader = this.loadingCtrl.create({
          spinner: 'dots',
          showBackdrop: false,
          enableBackdropDismiss: true
      });
      loader.present();

      this.currentUser = this.auth.getCurrentUser();

      Promise.all([this.getSent(), this.getIncoming()])
         .then( res => {
            console.log('Both sent and incoming are done.'),
            this.loaded = true;
            loader.dismiss();
         }).catch( err => {
            console.log('There was an error loading either sent or incoming requests.'),
            this.loaded = true;
            loader.dismiss();
         })
   }

   ionViewWillLeave() {
      this.loaded = false;
      this.errorLoadingSent = false;
      this.errorLoadingIncoming = false;
   }

   getSent() {
      return new Promise( (resolve, reject) => {
         this.sr.loadRequests('unresolved_sent').toPromise()
         .then( requests => {
            this.sent = requests as Array<SubRequest>;
            console.log('this.sent: ', this.sent),
            resolve(this.sent);
         }).catch( err => {
               this.errorLoadingSent = true;
               reject(console.log(err));
            });
      });
   }

   getIncoming() {
      return new Promise( (resolve, reject) => {
         this.sr.loadRequests('unresolved_incoming').toPromise()
         .then( requests => {
            this.incoming = requests as Array<SubRequest>;
            this.getCurrentUserSendeeForIncomingRequests();
            console.log('this.incoming: ', this.incoming);
            resolve(this.incoming);
         }).catch( err => {
            this.errorLoadingIncoming = true;
            reject(console.log(err));
         });
      });
   }

   getCurrentUserSendeeForIncomingRequests() {
      for (let r in this.incoming) {
         for (let s in this.incoming[r].sendees) {
            if (this.incoming[r].sendees[s]['first_name'] == this.currentUser['first_name'] && this.incoming[r].sendees[s]['last_name'] == this.currentUser['last_name']) {
               this.incoming[r]['currentUserSendee'] = this.incoming[r].sendees[s];
            }
         }
      }
      console.log('Got current user sendee info for incoming requests: ', this.incoming);
   }


   showRequest(id) {
      this.navCtrl.push(ShowSubRequestPage, {
         id: id,
         view: this.view
      });
   }

   reply(request, reply_value) {
      let reply_params = {
         value: reply_value,
         note: null
      }

      this.promptReplyNote().then( result => {
         if (result != 'Note skipped') {
            reply_params['note'] = result;
         }

         this.replies.editReply(request['id'], request['currentUserSendee']['id'], request['currentUserSendee']['reply']['id'], reply_params)
            .subscribe( res => {
               console.log(res);
               let toast = this.toastCtrl.create({
                  message: 'Sent reply: ' + reply_value + '.',
                  duration: 3000
               });
               toast.present();
               this.showRequest(request['id']);
            });
      });
   }

   promptReplyNote() {
      return new Promise ( (resolve) => {
         let prompt = this.alertCtrl.create({
            message: "Add a note to your reply.",
            inputs: [
               {},
            ],
            buttons: [
               {
                  text: 'Skip',
                  handler: data => {
                     console.log('Skip clicked');
                     resolve('Note skipped');
                  }
               },
               {
                  text: 'Save',
                  handler: note => {
                     console.log('Save clicked');
                     resolve(note);
                  }
               }
            ]
         });

         prompt.present();
      });
   }

   confirmSubAndChangeOnMB(request) {
      let selected_sub = {
         confirmed: true
      }

      let subbed_class = {
         class_id: request.class_id_mb,
         sub_staff_id: request.selected_sub.staff_id_mb
      }

      this.subs.editSelectedSub(request.id, request.selected_sub.id, {selected_sub, subbed_class}).toPromise()
         .then( res => {
            console.log(res);
            let toast = this.toastCtrl.create({
               message: 'Success! You are confirmed as the sub and MINDBODY has been updated.',
               duration: 3000
            });
            toast.present();
         }).catch( err => {
            let toast = this.toastCtrl.create({
               message: 'Whoops. Please try again.',
               duration: 3000
            });
         });
   }

}
