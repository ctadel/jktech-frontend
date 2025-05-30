import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { UserProfile } from '../models/user.model';
import { BASE_URL } from './api.service';
import { AuthService } from './auth.service';

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
    return this.http.get<UserProfile>(BASE_URL + '/users/profile', {
      headers: headers,
      responseType: 'json'
    })
  }

  // based on top views
  fetchExplore(): Observable<any> {
    return this.http.get(BASE_URL + '/documents/public/explore', { responseType: 'json' });
  }

  // based on upload date
  fetchLatestDocuments(): Observable<any> {
    return this.http.get(BASE_URL + '/documents/public/explore/latest', { responseType: 'json' });
  }

  // based on top stars
  fetchTrendingDocuments(): Observable<any> {
    return this.http.get(BASE_URL + '/documents/public/explore/trending', { responseType: 'json' });
  }

  fetchUserDocuments(): Observable<any> {
    const headers = this._get_header()
    return this.http.get(BASE_URL + `/documents`, {
      responseType: 'json',
      headers: headers
    });
  }
}
