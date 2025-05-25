import { Injectable } from '@angular/core';

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

  public getLoggedInUser(): any {
    let user = window.sessionStorage.getItem(this.USER_KEY)
    if (user) {
      user = JSON.parse(user)
      return user
    }
    return null
  }
}
