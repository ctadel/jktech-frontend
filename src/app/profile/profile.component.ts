import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { EventData } from '../_shared/event.class';
import { EventBusService } from '../_shared/event-bus.service';
import { StorageService } from '../_services/storage.service';
import { UserProfile } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
          this.toastr.info("Your profile has been updated and applied", "User Profile")
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
          this.userService.getUserProfile().subscribe(profile => {
            this.toastr.success(`You are now a ${targetProfile} user`, `Subscription Updated`)
            this.authService.hotReload(profile)
          });
        },
        error: err => {
          this.toastr.error("Upgrade Error", err)
        }
      })
  }

  revokeModeratorAccess(): void {
    this.userService.updateAccountType('PREMIUM').subscribe({
        next: response => {
          this.userService.getUserProfile().subscribe(profile => {
            this.toastr.success("Back to earth, feel better!", `Subscription Updated`)
            this.authService.hotReload(profile)
          });
        },
        error: err => {
          this.toastr.error(err, "Upgrade Error")
        }
      })
  }

  requestModeratorAccess(): void {
    this.userService.updateAccountType('MODERATOR').subscribe({
        next: response => {
          this.userService.getUserProfile().subscribe(profile => {
            this.toastr.success("You are now a SUPERMAN", `Subscription Updated`)
            this.authService.hotReload(profile)
          });
        },
        error: err => {
          this.toastr.error(err, "Upgrade Error")
        }
      })
  }

  onDeleteAccount() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete your account permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result:any) => {
        if (result.isConfirmed) {
          this._DeleteAccount();
        }
      });
  }

  _DeleteAccount() {
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
