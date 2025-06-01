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

  fetchUsers(page: number|null): Observable<any> {
    const headers = this.userService._get_header();

    let endpoint = `${BASE_URL}/admin/users`
    if(page)
      endpoint += `?page=${page}`;

    return this.http.get( endpoint, {
      headers: headers,
      responseType: 'json'
    })
  }

  fetchDocuments(page: number|null): Observable<any> {
    const headers = this.userService._get_header();

    let endpoint = `${BASE_URL}/admin/documents`
    if(page)
      endpoint += `?page=${page}`;

    return this.http.get( endpoint, {
      headers: headers,
      responseType: 'json'
    })
  }


  activateUser(userId: any): Observable<any> {
    const headers = this.userService._get_header();
    return this.http.post(
      `${BASE_URL}/admin/user/${userId}/activate`,
      {},
      { headers: headers }
    );
  }

  deactivateUser(userId: any): Observable<any> {
    const headers = this.userService._get_header();
    return this.http.post(
      `${BASE_URL}/admin/user/${userId}/deactivate`,
      {},
      { headers: headers }
    );
  }

  deleteUser(userId: number): Observable<any> {
    const headers = this.userService._get_header();
    return this.http.delete(
      `${BASE_URL}/admin/user/${userId}/delete`,
      { headers: headers }
    );
  }

}
