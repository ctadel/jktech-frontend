import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { PublicDocument, UserDocument, UserDocumentStats } from '../models/document.model';
import { BASE_URL } from './api.service';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class DocumentService {

  constructor(private http: HttpClient, private user: UserService) {}

  uploadDocument(file: File, title: string, isPrivate: boolean) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('is_private', isPrivate.toString());
    return this.http.post(`${BASE_URL}/documents`, formData, {
      headers: this.user._get_header()
    });
  }

  reUploadDocument(file: File, title: string, isPrivate: boolean, documentKey: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('document_key', documentKey);
    formData.append('is_private', isPrivate.toString());
    return this.http.patch(`${BASE_URL}/documents`, formData, {
      headers: this.user._get_header()
    });
  }

  deleteDocument(documentKey: string) {
    return this.http.delete(`${BASE_URL}/documents/${documentKey}`, {
      headers: this.user._get_header()
    });
  }

  starDocument(document_id: number) {
    return this.http.post(`${BASE_URL}/documents/stars/${document_id}`, {}, {
      headers: this.user._get_header()
    });
  }

  unStarDocument(document_id: number) {
    return this.http.delete(`${BASE_URL}/documents/stars/${document_id}`, {
      headers: this.user._get_header()
    });
  }

  // based on top views
  fetchExplore(user_id: number|null): Observable<PublicDocument[]> {
    let endpoint = `/documents/public/explore?user_id=${user_id}`
    return this.http.get<PublicDocument[]>(BASE_URL + endpoint, { responseType: 'json' });
  }

  // based on upload date
  fetchLatestDocuments(user_id: number|null): Observable<PublicDocument[]> {
    let endpoint = `/documents/public/explore/latest?user_id=${user_id}`
    return this.http.get<PublicDocument[]>(BASE_URL + endpoint, { responseType: 'json' });
  }

  // based on top stars
  fetchTrendingDocuments(user_id: number|null): Observable<PublicDocument[]> {
    let endpoint = `/documents/public/explore/trending?user_id=${user_id}`
    return this.http.get<PublicDocument[]>(BASE_URL + endpoint, { responseType: 'json' });
  }

  fetchUserDocuments(): Observable<UserDocument[]> {
    const headers = this.user._get_header()
    return this.http.get<UserDocument[]>(BASE_URL + `/documents`, {
      responseType: 'json',
      headers: headers
    });
  }

  fetchUserDocumentByKey(document_key: string): Observable<UserDocument> {
    const headers = this.user._get_header()
    return this.http.get<UserDocument>(BASE_URL + `/documents/${document_key}`, {
      responseType: 'json',
      headers: headers
    });
  }

  fetchUserDocumentsStats(): Observable<UserDocumentStats> {
    const headers = this.user._get_header()
    return this.http.get<UserDocumentStats>(BASE_URL + `/documents/stats`, {
      responseType: 'json',
      headers: headers
    });
  }

}
