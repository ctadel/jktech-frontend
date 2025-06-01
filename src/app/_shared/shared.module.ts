import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCardListComponent } from './document-card-list/document-card-list.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DocumentStatsComponent } from './document-stats/document-stats.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    DocumentCardListComponent,
    DataTableComponent,
    DocumentStatsComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule,
  ],
  exports: [
    DocumentCardListComponent,
    DataTableComponent,
    DocumentStatsComponent,
  ]
})
export class SharedModule {}
