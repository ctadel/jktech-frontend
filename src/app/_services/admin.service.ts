import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../_services/api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient, private userService: UserService) {}

  fetchUsers(page: number = 1): Observable<any> {
    const headers = this.userService._get_header();
    return this.http.get(`${BASE_URL}/admin/users?page=${page}`, {
      headers: headers,
      responseType: 'json'
    })
  }

}
