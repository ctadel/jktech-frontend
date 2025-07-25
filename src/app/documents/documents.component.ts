import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { UserDocument, UserDocumentStats } from '../models/document.model';
import { UserProfile } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentService } from '../_services/document.service';
import { EventBusService } from '../_shared/event-bus.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  viewMode: string = 'list'
  userDocuments: UserDocument[] = []
  document_data: UserDocument | null = null
  userDocumentStats: UserDocumentStats | null = null
  user: UserProfile | null = null
  isBasicUser = true
  upload_in_progress = false

  formTitle: string = '';
  isPrivate: boolean = false;
  selectedFile: File | null = null;

  isDragging = false;
  selectedFileName: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      this.formTitle = nameWithoutExtension;
    }
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  constructor(
    private authService: AuthService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private eventBusService: EventBusService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser()

    this.eventBusService.on('profile-updated', (profile: any) => {
      this.user = profile;
    });

    this.route.paramMap.subscribe(params => {
      const document_key = params.get('id');
      this.isBasicUser = this.user?.account_type === 'BASIC';
      if (document_key) {
        this.viewMode = 'detail';
        this.loadDocument(document_key);
      } else {
        this.viewMode = 'list';
        this.loadUserDocumentsStatistics();
        this.loadUserDocuments();
      }
    });

  }

  goBack(){
    this.location.back();
  }

  loadDocument(document_key: string): void {
    this.documentService.fetchUserDocumentByKey(document_key).subscribe({
      next: data => {
        this.document_data = data
      },
      error: err => {
        this.viewMode = '404'
        this.toastr.error('Failed to load user documents', err)
      }
    });
  }

  loadUserDocuments(): void {
    this.documentService.fetchUserDocuments().subscribe({
      next: data => this.userDocuments = data,
      error: err => {
        this.toastr.error('Failed to load user documents', err)
      }
    });
  }

  loadUserDocumentsStatistics(): void {
    this.documentService.fetchUserDocumentsStats().subscribe({
      next: data => this.userDocumentStats = data,
      error: err => {
        this.toastr.error('Failed to load user documents', err)
      }
    });
  }


  deleteDocument(document_key: string){
    this.documentService.deleteDocument(document_key).subscribe({
      next: (res: any) => {
        this.toastr.success('Document was deleted successfully', "Document Deletion");
        this.goBack()
      },
      error: (err) => {
        this.toastr.error('Document upload failed', err);
      }
    });
  }

  navigateToUpgrade(){
    this.router.navigate(['/profile'])
  }

  reuploadDocument(document_key: string): void{
    if (!this.selectedFile || !this.formTitle.trim()) return;
    this.upload_in_progress = true;
    this.documentService.reUploadDocument(
        this.selectedFile, this.formTitle, this.isPrivate, document_key
    ).subscribe({
      next: (res: any) => {
          console.log('File uploaded', res)
          this.toastr.success("Document was re-ingested successfully, Click on chat to start communicating", "Ingestion")
          this.router.navigate(['/documents'])
        },
      error: (err) => {
        this.toastr.error('Document upload failed', err);
        this.upload_in_progress = false;
      },
      complete: () => {
        this.upload_in_progress = false;
      }
    });
  }


  toggleStar(document: any) {
    if (document.user_starred) {
      this.documentService.unStarDocument(document.id).subscribe({
        next: () => {
          document.user_starred = false;
          if (document.total_stars !== undefined && document.total_stars > 0) {
            document.total_stars -= 1;
          }
        },
        error: err => this.toastr.error('Failed to unstar document', err)
      });
    } else {
      this.documentService.starDocument(document.id).subscribe({
        next: () => {
          document.user_starred = true;
          if (document.total_stars !== undefined) {
            document.total_stars += 1;
          } else {
            document.total_stars = 1;
          }
        },
        error: err => this.toastr.error('Failed to star document', err)
      });
    }
  }

  initiateChat(document: any): void {
    this.router.navigate([`/conversation/${document.document_key}`])
  }
}
