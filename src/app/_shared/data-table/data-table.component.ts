import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() page: number = 1;
  @Input() hasMore: boolean = false;
  @Input() loading: boolean = false;

  @Output() nextPage = new EventEmitter<number>();
  @Output() prevPage = new EventEmitter<number>();
  @Output() firstPage = new EventEmitter<void>();
  @Output() addNew = new EventEmitter<void>();
  @Output() editRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();

  onNext() {
    this.nextPage.emit(this.page + 1);
  }

  onPrev() {
    if (this.page > 1) this.prevPage.emit(this.page - 1);
  }

  onFirst() {
    this.firstPage.emit();
  }

  onAdd() {
    this.addNew.emit();
  }

  onEdit(row: any) {
    this.editRow.emit(row);
  }

  onDelete(row: any) {
    this.deleteRow.emit(row);
  }
}
