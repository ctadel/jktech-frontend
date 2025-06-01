import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserProfile } from '../models/user.model';
import { DocumentService } from '../_services/document.service';

@Component({
  selector: 'app-home',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  latestDocs: any[] = [];
  trendingDocs: any[] = [];
  mostLikedDocs: any[] = [];
  user: UserProfile | null = null;

  constructor(private docService: DocumentService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser()
    this.loadDocuments();
  }

  loadDocuments(): void {

    let user = 0
    if (this.user){
      user = this.user.id
    }

    this.docService.fetchLatestDocuments(user).subscribe({
      next: data => this.latestDocs = data.slice(0, 8),
      error: err => console.error('Failed to load latest docs', err)
    });

    this.docService.fetchTrendingDocuments(user).subscribe({
      next: data => this.trendingDocs = data.slice(0, 4),
      error: err => console.error('Failed to load trending docs', err)
    });

    this.docService.fetchExplore(user).subscribe({
      next: data => this.mostLikedDocs = data.slice(0, 8),
      error: err => console.error('Failed to load most liked docs', err)
    });
  }
}
