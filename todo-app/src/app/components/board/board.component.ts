import { Component, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService, Task } from '../../services/todo.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnDestroy {
  tasks: Task[] = [];
  private destroy$ = new Subject<void>();

  backlogTitle: string = 'Backlog';
  inProgressTitle: string = 'Pending';
  completedTitle: string = 'Completed';

  constructor(
    private todoService: TodoService,
    private ngZone: NgZone,
  ) {
    this.loadTasks();
  }

  get backlogTasks(): Task[] {
    return this.tasks.filter((task: Task) => task.status === undefined);
  }

  get inProgressTasks(): Task[] {
    return this.tasks.filter((task: Task) => task.status === false);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter((task: Task) => task.status === true);
  }

  loadTasks(): void {
    this.todoService.tasks$
      .pipe(
        takeUntil(this.destroy$),
        tap({
          next: (tasks: Task[]) => {
            this.tasks = tasks;
          },
          error: (err) => {
            console.error('Failed to load tasks', err);
          },
        }),
      )
      .subscribe();
  }
  //Добавить позже позицию в интерфейс задачи, запоминать и учитывать ее при перемещении, добавить подсветку столбца,  куда перемещаем (сделаю после закрытия всех домашек)
  drop(event: CdkDragDrop<Task[]>): void {
    this.ngZone.run(() => {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        this.updateTaskStatus(
          event.container.data[event.currentIndex],
          event.container.id,
        );
      }
    });
  }

  updateTaskStatus(task: Task, containerId: string): void {
    console.log(`Updating task status for task ${task.id} to ${containerId}`);
    task.status =
      containerId === 'completed'
        ? true
        : containerId === 'in-progress'
          ? false
          : undefined;
    this.todoService
      .updateTask(task)
      .pipe(
        tap({
          next: () => {
            console.log(`Task ${task.id} updated successfully`);
          },
          error: (err) => {
            console.error(`Failed to update task ${task.id}`, err);
          },
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
