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
    return this.http.post(`${this.API_BASE}/conversations/${convoId}`, { content }, {
      headers: this.user._get_header()
    });
  }
}
