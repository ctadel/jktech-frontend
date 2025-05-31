import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  userDocuments: any[] = [];
  userDocumentStats: any[] = [];
  user: any = null

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserDocuments();
    this.loadUserDocumentsStatistics();
    this.user = this.authService.getLoggedInUser()
  }

  loadUserDocuments(): void {
    this.userService.fetchUserDocuments().subscribe({
      next: data => this.userDocuments = data,
      error: err => console.error('Failed to load user documents', err)
    });
  }

  loadUserDocumentsStatistics(): void {
    this.userService.fetchUserDocumentsStats().subscribe({
      next: data => this.userDocumentStats = data,
      error: err => console.error('Failed to load user documents', err)
    });
  }

}
