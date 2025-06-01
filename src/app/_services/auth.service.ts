import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { BASE_URL } from './api.service';
import { UserProfile } from '../models/user.model';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService, private ebs: EventBusService) {}

  isLoggedIn(){
    return this.storage.isLoggedIn()
  }

  getLoggedInUser(): UserProfile | null{
    const user = this.storage.getLoggedInUser()
    if (!user){
      console.log("The user session has been deleted, forcing re-login")
    }
    return user
  }

  hotReload(profile: UserProfile): void {
      this.storage.deleteUserProfile()
      this.storage.saveItem(this.storage.USER_KEY, profile)
      this.ebs.emit(new EventData('profile-updated', profile));
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

  logout(): void {
    this.storage.clean();
    window.location.reload();
  }
}
