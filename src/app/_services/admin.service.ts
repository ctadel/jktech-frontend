import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:8000/api/v1';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  fetchUsers(page: number = 1): Observable<any> {
    const url = `${API_URL}/users/profile/users?page=${page}`;
    return this.http.get<any>(url);
  }
}
