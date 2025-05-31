import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BASE_URL } from './api.service';


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

}
