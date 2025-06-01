import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import { UserProfile } from './models/user.model';
import { UserService } from './_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  @ViewChild('dropdownRef', { static: false }) dropdownRef!: ElementRef;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isDropdownOpen && this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  user: UserProfile | any = null

  constructor(
    private authService: AuthService,
    private eventBusService: EventBusService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.userService.getUserProfile().subscribe(user => {
      this.user = user;
    })
    this.eventBusService.on('profile-updated', (profile: UserProfile) => {
      this.user = profile;
    });
  }


  logout(): void {
    this.authService.logout();
  }

  upgradeAccount(): void {
    this.router.navigate(['/profile'])
  }
}
