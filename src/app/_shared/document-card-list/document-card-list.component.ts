import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from '../../_services/conversation.service';

@Component({
  selector: 'app-document-card-list',
  templateUrl: './document-card-list.component.html',
  styleUrls: ['./document-card-list.component.css']
})
export class DocumentCardListComponent {
  @Input() documents: any[] = [];
  @Input() user: any = {};

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
}
