import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { TaskControlPanelComponent } from './components/task-control-panel/task-control-panel.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ToDoListComponent,
    ToastsComponent,
    LoadingSpinnerComponent,
    TaskControlPanelComponent,
    TaskFilterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ToDo List';
}
