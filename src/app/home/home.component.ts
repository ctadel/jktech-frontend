import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mostLikedDocs: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.userService.fetchExplore().subscribe({
      next: data => {
        this.mostLikedDocs = data
        console.table(data)
        },
      error: err => console.error('Failed to load most liked docs', err)
    });
  }
}
