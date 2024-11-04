import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Task {
  id: number;
  text: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private tasksSubject = new BehaviorSubject<Task[]>([
    { id: 1, text: 'Buy a Porsche', description: 'Purchase a new Porsche car' },
    {
      id: 2,
      text: 'Take a walk with the dog',
      description: 'Walk the dog in the park',
    },
  ]);
  tasks$ = this.tasksSubject.asObservable();

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): void {
    const tasks = this.tasksSubject.getValue();
    this.tasksSubject.next([...tasks, task]);
  }

  deleteTask(id: number): void {
    const tasks = this.tasksSubject.getValue();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    this.tasksSubject.next(updatedTasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.getValue();
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    this.tasksSubject.next(updatedTasks);
  }
}
