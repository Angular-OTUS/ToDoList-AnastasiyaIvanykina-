import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { FilterOption } from '../task-filter/filter-option.interface';

@Component({
  selector: 'app-task-control-panel',
  standalone: true,
  imports: [CommonModule, TaskFilterComponent],
  templateUrl: './task-control-panel.component.html',
  styleUrls: ['./task-control-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskControlPanelComponent {
  @Output() filterChange: EventEmitter<string | null> = new EventEmitter<
    string | null
  >();

  filterOptions: FilterOption[] = [
    { value: null, label: 'ALL' },
    { value: 'completed', label: 'COMPLETED' },
    { value: 'in progress', label: 'PENDING' },
  ];

  onFilterChange(filter: string | null): void {
    this.filterChange.emit(filter);
  }
}
