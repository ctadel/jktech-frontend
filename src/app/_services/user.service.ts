import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { UserProfile } from '../models/user.model';
import { BASE_URL } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  _get_header() {
    let token = this.storageService.getItem(this.storageService.TOKEN_KEY).access_token
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return header
  }

  getUserProfile(): Observable<UserProfile> {
    const headers = this._get_header();
    return this.http.get<UserProfile>(BASE_URL + '/users/profile', {
      headers: headers,
      responseType: 'json'
    })
  }

  updateUserPassword(oldPassword: string | null, newPassword: string | null): Observable<any>{
    return this.http.patch(BASE_URL + '/users/profile/account/update-password', {
      old_password: oldPassword,
      new_password: newPassword
      }, {
        headers: this._get_header(),
      })
    }

  updateAccountType(accountType: string | null): Observable<any>{
    return this.http.post(BASE_URL + '/users/profile/account/update-account-type', {
      account_type: accountType
      }, {
        headers: this._get_header(),
      })
    }

  updateUserProfile(full_name: string | null, email: string | null): Observable<any>{
    return this.http.patch(BASE_URL + '/users/profile/update', {
      full_name: full_name,
      email: email
      }, {
        headers: this._get_header(),
      })
    }

  deleteAccount(): Observable<any> {
    const headers = this._get_header();
    return this.http.delete(BASE_URL + '/users/profile/account/deactivate', {
      headers: headers,
    })
  }


}
