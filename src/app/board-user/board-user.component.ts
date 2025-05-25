// board-user.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationService } from '../_services/conversation.service';

@Component({
  selector: 'app-chat',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
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
          console.log(err)
        },
        complete: () => {
          this.loading = false;
        }
    })
  }

  constructor(
    private convoService: ConversationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  goToIngest(): void {
    this.router.navigate(['/conversations']);
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

    this.convoService.uploadDocument(this.file, this.formTitle, this.isPrivate).subscribe({
      next: (res: any) => {
        // res should contain the new conversation ID
        if (res) {
          this.convoService.startConversation(res.id, res.title).subscribe({
            next: (conv: any) => {
              this.loadConversations();
              this.router.navigate(['/conversation/', conv.id]);
            },
            error: (err) => {
              console.log("failed to start a conversation", err)
            }

          })
        } else {
          console.log('Upload succeeded but no conversation returned.');
        }
      },
      error: (err) => {
        console.error('Document upload failed', err);
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
      this.conversations = this.conversations.filter(c => c.id !== convoId);
      if (this.selectedConversation?.id === convoId) {
        this.selectedConversation = null;
        this.messages = [];
        this.router.navigate(['/conversation']);
      }
    });
  }

  handleEnter(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault();
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


}
