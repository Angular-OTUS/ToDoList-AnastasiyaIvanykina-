import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-task-control-panel',
  standalone: true,
  imports: [CommonModule, TaskFilterComponent],
  templateUrl: './task-control-panel.component.html',
  styleUrls: ['./task-control-panel.component.css'],
})
export class TaskControlPanelComponent {
  @Output() filterChange = new EventEmitter<string | null>();

  onFilterChange(filter: string | null) {
    this.filterChange.emit(filter);
  }
}
