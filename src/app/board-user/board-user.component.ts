import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationService } from '../_services/conversation.service';
import { AuthService } from '../_services/auth.service';
import { UserDocumentStats } from '../models/document.model';
import { DocumentService } from '../_services/document.service';
import { EventBusService } from '../_shared/event-bus.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  userDocumentStats: UserDocumentStats | null = null
  user: any = {}
  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';

  documentFile: File | null = null;
  documentTitle: string = '';
  isPrivate: boolean = false;

  formTitle: string = '';
  file: File | null = null;

  loading = false;

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({ role: 'user', content: this.newMessage.trim(), created_at: new Date() });
    this.loading = true;

    this.convoService.sendMessage(this.selectedConversation.id, this.newMessage).subscribe({
        next: (conv: any) => {
          this.newMessage = '';
          this.messages.push({ role: 'AI', content: conv.content, created_at: conv.created_at });
        }, error: (err: any) => {
          this.toastr.error("Error sending Message", err)
        },
        complete: () => {
          this.loading = false;
        }
    })
  }

  constructor(
    private convoService: ConversationService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser()
    this.eventBusService.on('profile-updated', (profile: any) => {
      this.user = profile;
    });
    this.loadConversations();
    this.loadUserDocumentsStatistics()
  }

  loadUserDocumentsStatistics(): void {
    this.documentService.fetchUserDocumentsStats().subscribe({
      next: data => this.userDocumentStats = data,
      error: err => this.toastr.error('Failed to load user documents', err)
    });
  }

  goToIngest(): void {
    this.router.navigate(['/conversations']);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.file = event.dataTransfer.files[0];
      event.dataTransfer.clearData();
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selected = target.files && target.files[0];
    if (selected) {
      this.file = selected;
      const nameWithoutExtension = selected.name.replace(/\.[^/.]+$/, '');
      this.formTitle = nameWithoutExtension;
    }
  }

  submitIngestForm(): void {
    if (!this.file || !this.formTitle.trim()) return;

    this.loading = true;

    this.documentService.uploadDocument(this.file, this.formTitle, this.isPrivate).subscribe({
      next: (res: any) => {
        // res should contain the new conversation ID
        if (res) {
          this.convoService.startConversation(res.id, res.title).subscribe({
            next: (conv: any) => {
              this.loadConversations();
              this.toastr.success("Have fun with it", "Conversation initiated")
              this.router.navigate(['/conversation/', conv.id]);
            },
            error: (err) => {
              this.toastr.error("Failed to start a conversation", err)
            }

          })
        } else {
          this.toastr.warning('Upload succeeded but no conversation returned.');
        }
      },
      error: (err) => {
        this.toastr.error('Document upload failed', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadConversations(): void {
    this.convoService.getConversations().subscribe(data => {
      this.conversations = data;

      const convoId = this.route.snapshot.paramMap.get('id');
      if (convoId) {
        const existing = this.conversations.find(c => c.id == convoId);
        if (existing) {
          this.selectConversation(existing);
        } else {
          this.convoService.getMessages(convoId).subscribe(convo => {
            if (convo) {
              this.conversations.push(convo);
              this.selectConversation(convo);
            }
          });
        }
      }
    });
  }

  selectConversation(convo: any): void {
    this.selectedConversation = convo;
    this.router.navigate(['/conversation', convo.id]);
    this.convoService.getMessages(convo.id).subscribe(data => {
      this.messages = data;
    });
  }

  deleteConversation(event: Event, convoId: string): void {
    event.stopPropagation();
    this.convoService.deleteConversation(convoId).subscribe(() => {
    this.toastr.success("Your conversation was successfully deleted", "Conversation")
      this.conversations = this.conversations.filter(c => c.id !== convoId);
      if (this.selectedConversation?.id === convoId) {
        this.selectedConversation = null;
        this.messages = [];
        this.router.navigate(['/conversation']);
      }
    });
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  dropFile(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.documentFile = event.dataTransfer.files[0];
    }
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  navigateToDocument(document_id: number) {
    this.documentService.fetchUserDocuments().subscribe({
      next: (documents) => {
        const matchedDoc = documents.find(doc => doc.id === document_id);
        if (matchedDoc) {
          this.router.navigate(['/document', matchedDoc.document_key]);
        } else {
          this.toastr.warning('Document not found with id:', `${document_id}`);
        }
      },
      error: err => {
        this.toastr.error('Failed to load user documents', err);
      }
    })
  }
}
