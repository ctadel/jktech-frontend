import { CommonModule } from '@angular/common';
import { DocumentCardListComponent } from '../_shared/document-card-list/document-card-list';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DocumentCardListComponent],
  imports: [CommonModule],
  exports: [DocumentCardListComponent]
})
export class SharedModule {}
