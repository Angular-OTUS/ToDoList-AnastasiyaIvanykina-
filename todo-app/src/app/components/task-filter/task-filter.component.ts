import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilterOption } from './filter-option.interface'; // Импорт интерфейса

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css'],
})
export class TaskFilterComponent {
  @Input() filterTitle: string = 'Filter by Status';
  @Output() filterChange = new EventEmitter<string | null>();
  selectedFilter: string | null = null;

  filterOptions: FilterOption[] = [
    { value: null, label: 'ALL' },
    { value: 'completed', label: 'Completed' },
    { value: 'in progress', label: 'In Progress' },
  ];

  onFilterChange(filter: string | null) {
    this.filterChange.emit(filter);
  }
}
