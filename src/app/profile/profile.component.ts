import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { EventData } from '../_shared/event.class';
import { EventBusService } from '../_shared/event-bus.service';
import { StorageService } from '../_services/storage.service';
import { UserProfile } from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService,
    private eventBusService: EventBusService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser()
    this.eventBusService.on('profile-updated', (profile: UserProfile) => {
      this.user = profile;
    });
  }

  resetData = {
    old_password: '',
    new_password: ''
  };

  updateProfile = {
    full_name: '',
    email: ''
  };

  onUpdateProfile() {
    let fullName = this.updateProfile.full_name || null
    let email = this.updateProfile.email || null
    this.userService.updateUserProfile(fullName, email)
        .subscribe({
        next: response => {
          this.userService.getUserProfile().subscribe(profile => {
            this.authService.hotReload(profile)
          });
        },
        error: err => {
          console.log(err)
        }
      })
  }

  onResetPassword() {
    this.userService.updateUserPassword(this.resetData.old_password, this.resetData.new_password)
        .subscribe( _ => {
          this.authService.login(this.user.username, this.resetData.new_password).subscribe(
            token => {
              this.storageService.saveItem(this.storageService.TOKEN_KEY, token);
              this.userService.getUserProfile().subscribe( profile => {
                this.authService.hotReload(profile)
              })
          })
      })
  }

  switchSubscription() {
    let targetProfile = ''
    if(this.user.account_type === 'BASIC'){
      targetProfile = 'PREMIUM'
    } else if(this.user.account_type === 'PREMIUM'){
      targetProfile = 'BASIC'
    }

    this.userService.updateAccountType(targetProfile).subscribe({
        next: response => {
          this.user.account_type = targetProfile
          this.userService.getUserProfile().subscribe(profile => {
            this.authService.hotReload(profile)
          });
        },
        error: err => {
          console.log(err)
        }
      })
  }

  onDeleteAccount() {
    this.userService.deleteAccount().subscribe({
        next: response => {
          console.log(response)
        },
        error: err => {
          console.log(err)
        }
      })
  }
}
