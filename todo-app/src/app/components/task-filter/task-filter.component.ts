import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilterOption } from './filter-option.interface';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css'],
})
export class TaskFilterComponent {
  @Input() filterTitle: string = 'Filter by Status';
  @Input() filterOptions: FilterOption[] = [];
  @Output() filterChange: EventEmitter<string | null> = new EventEmitter<
    string | null
  >();
  public selectedFilter?: string;

  onFilterChange(filter: string | null): void {
    this.filterChange.emit(filter);
  }
}
