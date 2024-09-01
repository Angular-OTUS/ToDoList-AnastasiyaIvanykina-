import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToDoListItemComponent } from '../to-do-list-item-component/to-do-list-item-component.component';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToDoListItemComponent,
    MatInputModule,
    MatProgressSpinnerModule,
    ButtonComponent,
  ],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListComponent implements OnInit {
  title: string = 'ToDo-list';
  addButtonTitle: string = 'Add task';
  tasks: { id: number; text: string }[] = [
    { id: 1, text: 'Buy a Porsche' },
    { id: 2, text: 'Take a walk with the dog' },
  ];
  newTask: string = '';
  isLoading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  addTask(): void {
    if (this.newTask.trim()) {
      const maxId = Math.max(...this.tasks.map((task) => task.id));
      this.tasks.push({ id: maxId + 1, text: this.newTask.trim() });
      this.newTask = '';
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}
