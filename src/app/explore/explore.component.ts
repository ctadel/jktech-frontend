import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  latestDocs: any[] = [];
  trendingDocs: any[] = [];
  mostLikedDocs: any[] = [];
  user: any = {}

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadDocuments();
    this.user = this.authService.getLoggedInUser()
  }

  loadDocuments(): void {
    this.userService.fetchLatestDocuments().subscribe({
      next: data => this.latestDocs = data.slice(0, 8),
      error: err => console.error('Failed to load latest docs', err)
    });

    this.userService.fetchTrendingDocuments().subscribe({
      next: data => this.trendingDocs = data.slice(0, 4),
      error: err => console.error('Failed to load trending docs', err)
    });

    this.userService.fetchExplore().subscribe({
      next: data => this.mostLikedDocs = data.slice(0, 8),
      error: err => console.error('Failed to load most liked docs', err)
    });
  }
}
