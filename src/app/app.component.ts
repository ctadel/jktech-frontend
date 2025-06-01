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
  showAdminBoard = false;

  // UI Interaction
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

  eventBusSub?: Subscription;

  constructor(
    private authService: AuthService,
    private eventBusService: EventBusService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userService.getUserProfile().subscribe(profile => this.user = profile)
    this.showAdminBoard = (this.user && this.user.account_type == 'MODERATOR')

    this.eventBusService.on('profile-updated', (profile: UserProfile) => {
      this.user = profile;
      this.showAdminBoard = profile.account_type === 'MODERATOR';
    });

  }
  ngOnDestroy(): void {
    this.eventBusSub?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  upgradeAccount(): void {
    this.router.navigate(['/profile'])
  }
}
