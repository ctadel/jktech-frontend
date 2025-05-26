import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { BASE_URL } from './api.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  isLoggedIn(){
    return this.storage.isLoggedIn()
  }

  getLoggedInUser() {
    return this.storage.getLoggedInUser()
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      BASE_URL + '/users/auth/login',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, fullname: string, email: string, password: string): Observable<any> {
    return this.http.post(
      BASE_URL + '/users/auth/register',
      {
        username,
        fullname,
        email,
        password,
      },
      httpOptions
    );
  }
}
