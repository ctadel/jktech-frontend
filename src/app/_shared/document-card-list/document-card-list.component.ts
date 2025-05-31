import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from '../../_services/conversation.service';
import { PublicDocument, UserDocument } from '../../models/document.model';
import { UserProfile } from '../../models/user.model';

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
    private router: Router,
  ) {}

  toggleStar(doc: any) {
    console.log('NOT IMPLEMENTED: Star a document')
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
