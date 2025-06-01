import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { EventData } from '../_shared/event.class';
import { EventBusService } from '../_shared/event-bus.service';
import { StorageService } from '../_services/storage.service';

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
    this.userService.updateUserProfile(this.updateProfile.full_name, this.updateProfile.email)
        .subscribe({
        next: response => {
          this.user.full_name = this.updateProfile.full_name
          this.user.email = this.updateProfile.email
          this.userService.getUserProfile().subscribe(profile => {
            this.eventBusService.emit(new EventData('profile-updated', profile));
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
                  this.storageService.saveItem(this.storageService.USER_KEY, profile);
                  this.eventBusService.emit(new EventData('profile-updated', profile));
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
            this.eventBusService.emit(new EventData('profile-updated', profile));
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
