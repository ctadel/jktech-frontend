import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private API_BASE = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient, private user: UserService) {}

  getConversations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/conversations`, {
      headers: this.user._get_header()
    });
  }

  getConversationById(convoId: string) {
    return this.http.get<any[]>(`${this.API_BASE}/conversations/${convoId}`, {
      headers: this.user._get_header()
    });
  }

  getMessages(convoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/conversations/${convoId}`, {
      headers: this.user._get_header()
    });
  }

  deleteConversation(convoId: string): Observable<any> {
    return this.http.delete(`${this.API_BASE}/conversations/${convoId}`, {
      headers: this.user._get_header()
    });
  }

  sendMessage(convoId: string, content: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/conversations/${convoId}`,
      { role: 'user',
        content: content
      }, {
      headers: this.user._get_header()
    });
  }

  startConversation(document_id: number, title: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/conversations`,
      { document_id: document_id,
        title: title
      }, {
      headers: this.user._get_header()
    });
  }

  uploadDocument(file: File, title: string, isPrivate: boolean) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('is_private', isPrivate.toString());
    return this.http.post(`${this.API_BASE}/documents`, formData, {
      headers: this.user._get_header()
    });
  }


}
