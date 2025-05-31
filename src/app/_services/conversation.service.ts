import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { BASE_URL } from './api.service';


@Injectable({ providedIn: 'root' })
export class ConversationService {

  constructor(private http: HttpClient, private user: UserService) {}

  getConversations(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/conversations`, {
      headers: this.user._get_header()
    });
  }

  getConversationById(convoId: string) {
    return this.http.get<any[]>(`${BASE_URL}/conversations/${convoId}`, {
      headers: this.user._get_header()
    });
  }

  getMessages(convoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/conversations/${convoId}`, {
      headers: this.user._get_header()
    });
  }

  deleteConversation(convoId: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/conversations/${convoId}`, {
      headers: this.user._get_header()
    });
  }

  sendMessage(convoId: string, content: string): Observable<any> {
    return this.http.post(`${BASE_URL}/conversations/${convoId}`,
      { role: 'user',
        content: content
      }, {
      headers: this.user._get_header()
    });
  }

  startConversation(document_id: number, title: string): Observable<any> {
    return this.http.post(`${BASE_URL}/conversations`,
      { document_id: document_id,
        title: title
      }, {
      headers: this.user._get_header()
    });
  }

}
