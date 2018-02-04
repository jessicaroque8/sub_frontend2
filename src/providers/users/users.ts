import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UsersProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UsersProvider Provider');
  }

  loadUsers(scope: string) {
      return this.http.get('http://localhost:3000/users');
   }

   getUser(id) {
      return this.http.get('http://localhost:3000/users/' + id);
   }

}