import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @Input() rowData: any[] = [];
  @Input() columnDefs: any[] = [];
  @Input() defaultColDef: any = {};

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onCellClicked(event: any) {
    const target = event.event.target as HTMLElement;

    if (event.colDef.headerName === 'Actions') {
      if (target.closest('.edit-btn')) {
        this.edit.emit(event.data);
      } else if (target.closest('.delete-btn')) {
        this.delete.emit(event.data);
      }
    }
  }
}
