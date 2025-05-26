import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../_services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  fetchUsers(page: number = 1): Observable<any> {
    const url = `${BASE_URL}/users/profile/users?page=${page}`;
    return this.http.get<any>(url);
  }
}
