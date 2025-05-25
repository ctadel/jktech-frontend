import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { UserProfile } from '../models/user.model';

const API_URL = 'http://localhost:8000/api/v1';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  _get_header() {
    const storage = new StorageService()
    let token = storage.getItem(storage.TOKEN_KEY).access_token
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return header
  }

  getUserProfile(): Observable<UserProfile> {
    const headers = this._get_header();
    return this.http.get<UserProfile>(API_URL + '/users/profile', {
      headers: headers,
      responseType: 'json'
    });
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + '/explore', { responseType: 'json' });
  }

  fetchExploreAPI(): Observable<any> {
    return this.http.get(API_URL + '/documents/public/explore', { responseType: 'json' });
  }

  getUserBoard(): Observable<any> {
    const headers = this._get_header();
    return this.http.get<UserProfile>(API_URL + '/conversations', {
      headers: headers,
      responseType: 'json'
    });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + '/users/profile/users', { responseType: 'json' });
  }
}
