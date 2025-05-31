import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCardListComponent } from './document-card-list/document-card-list.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DocumentStatsComponent } from './document-stats/document-stats.component';

@NgModule({
  declarations: [
    DocumentCardListComponent,
    DataTableComponent,
    DocumentStatsComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DocumentCardListComponent,
    DataTableComponent,
    DocumentStatsComponent,
  ]
})
export class SharedModule {}
