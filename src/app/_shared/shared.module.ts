import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCardListComponent } from './document-card-list/document-card-list.component';

@NgModule({
  declarations: [
    DocumentCardListComponent,
    // other shared components
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DocumentCardListComponent,
    // export other shared components if needed
  ]
})
export class SharedModule {}
