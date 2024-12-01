import { Routes } from '@angular/router';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { AppToDoItemViewComponent } from './components/app-to-do-item-view/app-to-do-item-view.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'; // Импортируем компонент для страницы 404

export const routes: Routes = [
  {
    path: 'tasks',
    component: ToDoListComponent,
    children: [{ path: ':id', component: AppToDoItemViewComponent }],
  },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
