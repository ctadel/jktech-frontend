import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  userDocuments: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserDocuments();
  }

  loadUserDocuments(): void {
    this.userService.fetchUserDocuments().subscribe({
      next: data => this.userDocuments = data,
      error: err => console.error('Failed to load user documents', err)
    });
  }
}
