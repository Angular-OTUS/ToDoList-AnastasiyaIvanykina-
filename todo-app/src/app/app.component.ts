import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastsComponent } from './components/toasts/toasts.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { TaskControlPanelComponent } from './components/task-control-panel/task-control-panel.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { AppToDoItemViewComponent } from './components/app-to-do-item-view/app-to-do-item-view.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { BoardComponent } from './components/board/board.component';
import { ToggleClassDirective } from './shared/toggle-class.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToastsComponent,
    ToDoListComponent,
    LoadingSpinnerComponent,
    TaskControlPanelComponent,
    TaskFilterComponent,
    AppToDoItemViewComponent,
    PageNotFoundComponent,
    SidePanelComponent,
    BoardComponent,
    ToggleClassDirective,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ToDo List';
  isCollapsed: boolean = false;

  toggleSidePanel(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
