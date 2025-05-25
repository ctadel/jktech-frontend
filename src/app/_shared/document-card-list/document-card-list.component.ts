import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-document-card-list',
  templateUrl: './document-card-list.component.html',
  styleUrls: ['./document-card-list.component.css']
})
export class DocumentCardListComponent {
  @Input() documents: any[] = [];
  @Input() sectionTitle: string = '';

startChat(doc: any): void {
  console.log('Start chat clicked for:', doc);
  // TODO: implement actual navigation logic later
}
}
