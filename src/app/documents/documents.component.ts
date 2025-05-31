import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  userDocuments: any[] = [];
  userDocumentStats: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserDocuments();
    this.loadUserDocumentsStatistics();
  }

  loadUserDocuments(): void {
    this.userService.fetchUserDocuments().subscribe({
      next: data => this.userDocuments = data,
      error: err => console.error('Failed to load user documents', err)
    });
  }

  loadUserDocumentsStatistics(): void {
    this.userService.fetchUserDocumentsStats().subscribe({
      next: data => console.log(data),
      error: err => console.error('Failed to load user documents', err)
    });
  }

}
