import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { UserProfile } from '../models/user.model';
import { PublicDocument, UserDocument, UserDocumentStats } from '../models/document.model';
import { BASE_URL } from './api.service';

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
  fetchExplore(): Observable<PublicDocument[]> {
    return this.http.get<PublicDocument[]>(BASE_URL + '/documents/public/explore', { responseType: 'json' });
  }

  // based on upload date
  fetchLatestDocuments(): Observable<PublicDocument[]> {
    return this.http.get<PublicDocument[]>(BASE_URL + '/documents/public/explore/latest', { responseType: 'json' });
  }

  // based on top stars
  fetchTrendingDocuments(): Observable<PublicDocument[]> {
    return this.http.get<PublicDocument[]>(BASE_URL + '/documents/public/explore/trending', { responseType: 'json' });
  }

  fetchUserDocuments(): Observable<UserDocument[]> {
    const headers = this._get_header()
    return this.http.get<UserDocument[]>(BASE_URL + `/documents`, {
      responseType: 'json',
      headers: headers
    });
  }

  fetchUserDocumentByKey(document_key: string): Observable<UserDocument> {
    const headers = this._get_header()
    return this.http.get<UserDocument>(BASE_URL + `/documents/${document_key}`, {
      responseType: 'json',
      headers: headers
    });
  }

  fetchUserDocumentsStats(): Observable<UserDocumentStats> {
    const headers = this._get_header()
    return this.http.get<UserDocumentStats>(BASE_URL + `/documents/stats`, {
      responseType: 'json',
      headers: headers
    });
  }

}
