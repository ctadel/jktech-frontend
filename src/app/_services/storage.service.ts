import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  TOKEN_KEY = 'access_token';
  USER_KEY = 'profile';

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveItem(key: string, item: any): void {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, JSON.stringify(item));
  }

  public getItem(key: string): any {
    const item = window.sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  }

  public isLoggedIn(): boolean {
    const token = window.sessionStorage.getItem(this.TOKEN_KEY);
    if (token) {
      return true;
    }
    return false;
  }

  public deleteUserProfile(): void {
    window.sessionStorage.removeItem(this.USER_KEY);
  }

  public removeAccessToken(): void {
    window.sessionStorage.removeItem(this.TOKEN_KEY);
  }

  public getLoggedInUser(): UserProfile | null {
    const userStr = window.sessionStorage.getItem(this.USER_KEY);
    if (userStr) {
      const user = JSON.parse(userStr) as UserProfile;
      return user;
    }
    return null;
  }
}
