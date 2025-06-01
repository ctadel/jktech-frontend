import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from '../../_services/conversation.service';
import { PublicDocument, UserDocument } from '../../models/document.model';
import { UserProfile } from '../../models/user.model';
import { DocumentService } from '../../_services/document.service';

@Component({
  selector: 'app-document-card-list',
  templateUrl: './document-card-list.component.html',
  styleUrls: ['./document-card-list.component.css']
})
export class DocumentCardListComponent {
  @Input() documents: PublicDocument[] | UserDocument[]= [];
  @Input() user: UserProfile | null = null;

  constructor(
    private conversationService: ConversationService,
    private documentService: DocumentService,
    private router: Router,
  ) {}

  toggleStar(document: any) {
    if (document.user_starred) {
      this.documentService.unStarDocument(document.id).subscribe({
        next: () => {
          document.user_starred = false;
          if (document.total_stars !== undefined && document.total_stars > 0) {
            document.total_stars -= 1;
          }
        },
        error: err => console.error('Failed to unstar document', err)
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
        error: err => console.error('Failed to star document', err)
      });
    }
  }

  startChat(doc: any) {
    this.conversationService.startConversation(doc.id, doc.title).subscribe({
      next: (res) => {
        const conversationId = res.id;
        this.router.navigate([`/conversation/${conversationId}`]);
      },
      error: err => console.error('Failed to start conversation', err)
    });
  }

  manage_document(document_key: string) {
    this.router.navigate([`/document/${document_key}`]);
  }


}
