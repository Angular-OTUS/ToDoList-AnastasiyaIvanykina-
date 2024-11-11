import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Task {
  id: string;
  text: string;
  description: string;
  status?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService implements OnDestroy {
  private apiUrl: string = 'http://localhost:3000/tasks';
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    [],
  );
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  private subscriptions: Subscription = new Subscription();

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  private loadTasks(): void {
    const loadTasksSubscription = this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        tap((tasks) => this.tasksSubject.next(tasks)),
        catchError((error) => {
          console.error('Error loading tasks:', error);
          return EMPTY;
        }),
      )
      .subscribe();
    this.subscriptions.add(loadTasksSubscription);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap((newTask) => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, newTask]);
      }),
      catchError((error) => {
        console.error('Error adding task:', error);
        return throwError(() => new Error('Error adding task'));
      }),
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value.filter(
          (task) => task.id !== id,
        );
        this.tasksSubject.next(currentTasks);
      }),
      catchError((error) => {
        console.error('Error deleting task:', error);
        return throwError(() => new Error('Error deleting task'));
      }),
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject.value.map((t) =>
          t.id === updatedTask.id ? updatedTask : t,
        );
        this.tasksSubject.next(currentTasks);
      }),
      catchError((error) => {
        console.error('Error updating task:', error);
        return throwError(() => new Error('Error updating task'));
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
