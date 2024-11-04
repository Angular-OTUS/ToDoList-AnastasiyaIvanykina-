import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Task {
  id: number;
  text: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private tasks: Task[] = [
    { id: 1, text: 'Buy a Porsche', description: 'Purchase a new Porsche car' },
    {
      id: 2,
      text: 'Take a walk with the dog',
      description: 'Walk the dog in the park',
    },
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  updateTask(taskId: number, newText: string) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.text = newText;
    }
  }
}
