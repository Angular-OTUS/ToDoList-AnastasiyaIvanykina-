import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
})
export class ToDoListComponent {
  title: string = 'ToDo  List';
  addButtonTitle: string = 'Add task';
  deleteButtonTitle: string = 'Delete';
  tasks: string[] = [];
  newTask: string = '';

  addTask(): void {
    if (this.newTask.trim()) {
      this.tasks.push(this.newTask.trim());
      this.newTask = '';
    }
  }

  deleteTask(task: string): void {
    this.tasks = this.tasks.filter((t) => t !== task);
  }
}
