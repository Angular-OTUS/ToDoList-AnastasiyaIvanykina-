import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, ToDoListComponent],
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'todo-app';
}
