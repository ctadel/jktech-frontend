import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  // Login form model
  login = {
    username: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  loginErrorMessage = '';

  // Register form model
  register = {
    username: '',
    fullname: '',
    email: '',
    password: ''
  };
  isSuccessful = false;
  isSignUpFailed = false;
  registerErrorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.toastr.warning('Session expired, please log in again.', 'Session Timeout');
      }
    });
  }


  onLogin(): void {
    const { username, password } = this.login;
    this.authService.login(username, password).subscribe({
      next: data => {
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.storageService.saveItem(this.storageService.TOKEN_KEY, data);
        this.userService.getUserProfile().subscribe({
          next: user => {
            this.storageService.saveItem(this.storageService.USER_KEY, user);

            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.reloadPage();
          },
          error: err => {
            this.toastr.error('Failed to fetch user profile:', err);
            this.loginErrorMessage = 'Login succeeded but failed to fetch user info.';
            this.isLoginFailed = true;
          }
        });
      },
      error: err => {
        this.loginErrorMessage = err.error.detail || 'Login failed';
        this.isLoginFailed = true;
      }
    });
  }

  onRegister(): void {
    const { username, fullname, email, password } = this.register;
    this.authService.register(username, fullname, email, password).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.registerErrorMessage = err.error.detail || 'Registration failed';
        this.isSignUpFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
