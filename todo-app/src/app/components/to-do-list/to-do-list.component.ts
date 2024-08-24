import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToDoListItemComponent } from '../to-do-list-item-component/to-do-list-item-component.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ToDoListItemComponent, MatInputModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToDoListComponent {
  title: string = 'ToDo List';
  addButtonTitle: string = 'Add task';
  tasks: { id: number, text: string }[] = [
    { id: 1, text: 'First task' },
    { id: 2, text: 'Second task' }
  ];
  newTask: string = '';

  addTask(): void {
    if (this.newTask.trim()) {
      const maxId = Math.max(...this.tasks.map(task => task.id));
      this.tasks.push({ id: maxId + 1, text: this.newTask.trim() });
      this.newTask = '';
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}
