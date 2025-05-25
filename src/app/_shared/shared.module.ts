import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCardListComponent } from './document-card-list/document-card-list.component';
import { DataTableComponent } from './data-table/data-table.component';

@NgModule({
  declarations: [
    DocumentCardListComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DocumentCardListComponent,
    DataTableComponent,
  ]
})
export class SharedModule {}
