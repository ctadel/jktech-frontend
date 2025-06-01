import { Component, OnInit } from '@angular/core';
import { AdminService } from '../_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  users: any[] = [];
  documents: any[] = [];

  columnDefs = [
    { headerName: 'ID', field: 'id', width: 60 },
    {
      headerName: 'Active',
      width: 60,
      suppressMovable: true,
      cellClass: 'text-center',
      cellRenderer: (params: any) => {
        const userId = params.data.id;
        const isActive = params.data.is_active === true;

        const icon = isActive
          ? '🟢'
          : '🔴';

        return `
          <button
            data-user-id="${userId}"
            data-current-status="${isActive}"
            onclick="window.toggleUserStatus(event)"
            title="Toggle Active"
            class="w-full flex justify-center items-center"
          >
            ${icon}
          </button>
        `;
      },
    },

    { headerName: 'Username', field: 'username' },
    { headerName: 'Full Name', field: 'full_name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Account Type', field: 'account_type', width: 150 },

    {
      headerName: 'Actions',
      width: 100,
      suppressSizeToFit: true,
      suppressMovable: true,
      cellClass: 'text-center',
      cellRenderer: (params: any) => {
        return `
          <div class="flex justify-center gap-2">
            <button
              title="Edit"
            >📝</button>
            <button
              class="delete-btn text-red-600 hover:text-red-800"
              data-user-id="${params.data.id}"
              onclick="window.deleteUserHandler(event)"
              title="Delete"
            >🗑️</button>
          </div>
        `;
      },
    },

    { headerName: 'Created At', field: 'created_at' },
  ];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressSizeToFit: true,
  };

  toggleUserStatus(event: Event): void {
    const button = event.target as HTMLButtonElement;
    let userId = button.getAttribute('data-user-id');
    const currentStatus = button.getAttribute('data-current-status') === 'true';

    const newStatus = !currentStatus;

    const action = newStatus ? this.adminService.activateUser(userId) : this.adminService.deactivateUser(userId);

    action.subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.is_active = newStatus;
        }
      },
      error: () => {
        this.toastr.error('Failed to update user status', 'Error');
      }
    });
  }

  deleteUserHandler(event: Event): void {
    const button = event.target as HTMLButtonElement;
    const userId = Number(button.getAttribute('data-user-id'));

    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(userId).subscribe({
          next: () => {
            this.users = this.users.filter(user => user.id !== userId);
            this.toastr.success('User deleted successfully', 'Deleted');
          },
          error: () => {
            this.toastr.error('Failed to delete user', 'Error');
          }
        });
      }
    });
  }

  onEditUser(user: any) {
    this.toastr.warning(`Why delete ${user.full_name}`, 'This feature is not implemented yet');
  }

  onDeleteUser(user: any) {
    this.toastr.info(`Deleted ${user.username}`, 'Successfull');
  }

  loadUsers(page: number|null = null) {
    this.adminService.fetchUsers(page).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (error) => {
        this.toastr.error(error, "Error")
      },
    });
  }

  loadDocuments(page: number|null = null) {
    this.adminService.fetchDocuments(page).subscribe({
      next: (res) => {
        this.documents = res;
      },
      error: (error) => {
        this.toastr.error(error, "Error")
      },
    });
  }

  ngOnInit() {
    (window as any).toggleUserStatus = this.toggleUserStatus.bind(this);
    (window as any).deleteUserHandler = this.deleteUserHandler.bind(this);
    this.loadUsers();
    this.loadDocuments();
  }
}
