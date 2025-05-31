import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-document-stats',
  templateUrl: './document-stats.component.html',
  styleUrls: ['./document-stats.component.css']
})
export class DocumentStatsComponent {
  @Input() stats: any
  @Input() user: any

  get publicDocuments() {
    if (this.stats){
        return this.stats.total_documents - this.stats.private_documents;
    }
    return 0
  }

  get privatePercentage() {
    if (!this.stats){
      return 0
    }
    return this.stats.total_documents
      ? (this.stats.private_documents / this.stats.total_documents) * 100
      : 0;
  }

  get publicPercentage() {
    return 100 - this.privatePercentage;
  }
}
