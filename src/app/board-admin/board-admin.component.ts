import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AdminService } from '../_services/admin.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;

  constructor(private userService: UserService, private adminService: AdminService) { }

  page = 1;
  users: any[] = [];
  columns = ['id', 'username', 'email', 'account_type', 'created_at'];
  hasMore = true;
  isLoading = false;

  loadUsers(page: number) {
    this.isLoading = true
    this.page = page;
    this.adminService.fetchUsers(page).subscribe({
      next: (res) => {
        this.users = res;
        this.hasMore = res.length === 10;
      },
      error: (err) => {
        console.log("error while fetching the users", err)
      },
      complete: () => {
        this.isLoading =false
      }
    });
  }

  ngOnInit() {
    this.loadUsers(this.page);
  }

  onAddUser() {
    // open modal or navigate to form
  }

  onEditUser(user: any) {
    // open edit form with user info
  }

  onDeleteUser(user: any) {
    // confirm and call API
  }
}
