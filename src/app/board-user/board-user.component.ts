import { Component, OnInit } from '@angular/core';
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

  constructor(private convoService: ConversationService) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.convoService.getConversations().subscribe(data => {
      this.conversations = data;
    });
  }

  selectConversation(convo: any): void {
    this.selectedConversation = convo;
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
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    this.convoService.sendMessage(this.selectedConversation.id, this.newMessage).subscribe(() => {
      this.messages.push({
        role: 'user',
        content: this.newMessage,
        created_at: new Date().toISOString()
      });
      this.newMessage = '';
    });
  }
}
