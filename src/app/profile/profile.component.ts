import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { EventData } from '../_shared/event.class';
import { EventBusService } from '../_shared/event-bus.service';
import { StorageService } from '../_services/storage.service';
import { UserProfile } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

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
    private eventBusService: EventBusService,
    private router: Router,
    private toastr: ToastrService,
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
          this.toastr.show("User Profile", "Your profile has been updated and applied")
          this.userService.getUserProfile().subscribe(profile => {
            this.authService.hotReload(profile)
          });
        },
        error: err => {
          this.toastr.error("User Profile", err)
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
                this.toastr.show("User Profile", "Your password was updated successfully")
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
            this.toastr.success("Subscription Updated", `You are now a ${targetProfile} user`)
            this.authService.hotReload(profile)
          });
        },
        error: err => {
          this.toastr.error("Upgrade Error", err)
        }
      })
  }

  onDeleteAccount() {
    this.userService.deleteAccount().subscribe({
        next: response => {
          this.toastr.show("Your profile is deleted")
          this.storageService.deleteUserProfile()
          this.storageService.removeAccessToken()
          this.router.navigate(['/auth'])
        },
        error: err => {
          this.toastr.error("Account Deletion", err)
        }
      })
  }
}
