import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { SubRequest } from '../../models/sub-request.model';
import { Sendee } from '../../models/sendee.model';
import { Reply } from '../../models/reply.model';
import { UsersProvider } from '../users/users';
import { Storage } from '@ionic/storage';

@Injectable()
export class SubRequestsProvider {

   currentUser = null;

  constructor(
     public http: HttpClient,
     public auth: AuthProvider,
     public users: UsersProvider,
     public local: Storage
  ) {
      console.log('Hello SubRequestsProvider');
      if (this.auth.currentUser) {
         this.currentUser = this.auth.currentUser
      } else {
         this.local.get('currentUser').then(currentUser => {
            this.currentUser = currentUser
         });
      }
    }

// For index views. Returns an Observable.
  loadRequests(scope: string) {
      return this.http.get('http://localhost:3000/sub_requests/', {params: {scope: scope, user_id: this.currentUser.id} });
   }

// Returns an Observable. Includes User, Group, Sendee, Sendee Reply, Sendee first_name, Sendee last_name, Sendee image.
   loadRequest(id: number): Observable<any> {
      return this.http.get('http://localhost:3000/sub_requests/' + id )
               .map( request => {
                        return request as SubRequest;
                  });
   }

   deleteRequest(id: number): Observable<any> {
      return this.http.delete('http://localhost:3000/sub_requests/' + id );
   }

}
