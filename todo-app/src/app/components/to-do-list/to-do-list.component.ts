import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ToDoListItemComponent } from '../to-do-list-item-component/to-do-list-item-component.component';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent } from '../button/button.component';
import { TodoService, Task } from '../../services/todo.service';
import { ToastService } from '../../services/toast.service';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { map, first, takeUntil, delay } from 'rxjs/operators';
import { ClickDirective } from '../../shared/click.directive';
import { TooltipDirective } from '../../shared/tooltip.directive';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { TaskControlPanelComponent } from '../task-control-panel/task-control-panel.component';
import { TodoCreateItemComponent } from '../todo-create-item/todo-create-item.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToDoListItemComponent,
    MatInputModule,
    MatProgressSpinnerModule,
    ButtonComponent,
    ClickDirective,
    TooltipDirective,
    LoadingSpinnerComponent,
    TaskControlPanelComponent,
    TodoCreateItemComponent,
  ],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListComponent implements OnInit, OnDestroy {
  public title: string = 'ToDo-list';
  public saveButtonTitle: string = 'Save';
  public deleteButtonTitle: string = 'Delete';
  public tasks$!: Observable<Task[]>;
  public filteredTasks$!: Observable<Task[]>;
  public statuses$!: Observable<(boolean | null | undefined)[]>;
  public addTaskForm: FormGroup;
  public editTaskForm: FormGroup;
  public viewTaskForm: FormGroup;
  public selectedItemId: number | null = null;
  public editingTaskId: number | null = null;
  public isLoading: boolean = true;
  private filterSubject = new BehaviorSubject<string | null>(null);
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private todoService: TodoService,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.addTaskForm = this.fb.group({
      newTask: ['', Validators.required],
      newDescription: ['', Validators.required],
    });

    this.editTaskForm = this.fb.group({
      editTask: ['', Validators.required],
      editDescription: ['', Validators.required],
      editStatus: [false],
    });

    this.viewTaskForm = this.fb.group({
      viewTask: ['', Validators.required],
      viewDescription: ['', Validators.required],
      viewStatus: [false],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.tasks$ = this.todoService
      .getTasks()
      .pipe(delay(500), takeUntil(this.destroy$));
    this.statuses$ = this.todoService.getStatuses();
    this.filteredTasks$ = combineLatest([this.tasks$, this.filterSubject]).pipe(
      map(([tasks, filter]) => {
        if (!filter) {
          return tasks;
        }
        return tasks.filter((task) => task.status === (filter === 'completed'));
      }),
    );
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.errorHandler.handleError(err);
        this.isLoading = false;
      },
    });
  }

  public addTask(task: { text: string; description: string }): void {
    this.tasks$.pipe(first(), takeUntil(this.destroy$)).subscribe({
      next: (tasks) => {
        const maxId = Math.max(...tasks.map((task: Task) => task.id));
        this.todoService.addTask({
          id: maxId + 1,
          text: task.text.trim(),
          description: task.description.trim(),
          status: undefined,
        });
        this.toastService.showSuccess('Task added to backlog!');
        this.editingTaskId = null;
      },
      error: (err) => {
        this.errorHandler.handleError(err);
      },
    });
  }

  public deleteTask(taskId: number, event: Event): void {
    event.stopPropagation();
    this.todoService.deleteTask(taskId);
    this.toastService.showSuccess('Task deleted successfully!');
  }

  public handleClick(taskId: number, event: Event): void {
    event.stopPropagation();
    if (this.editingTaskId !== null && this.editingTaskId !== taskId) {
      this.showConfirmationModal(taskId);
    } else {
      this.selectedItemId = taskId;
      this.cdr.detectChanges();
    }
  }

  public editTask(taskId: number): void {
    if (this.selectedItemId !== taskId) {
      this.selectedItemId = taskId;
      this.cdr.detectChanges();
    }
    this.editingTaskId = taskId;
    this.tasks$
      .pipe(
        first(),
        map((tasks) => tasks.find((task: Task) => task.id === taskId)),
        takeUntil(this.destroy$),
      )
      .subscribe((task) => {
        if (task) {
          this.editTaskForm.patchValue({
            editTask: task.text,
            editDescription: task.description,
            editStatus: task.status === true,
          });
          this.cdr.detectChanges();
        } else {
          this.toastService.showToast('Task not found!');
        }
      });
  }

  public saveTask(taskId: number): void {
    const updatedTask: Task = {
      id: taskId,
      text: this.editTaskForm.get('editTask')?.value,
      description: this.editTaskForm.get('editDescription')?.value,
      status: this.editTaskForm.get('editStatus')?.value,
    };
    this.todoService.updateTask(updatedTask);
    this.editingTaskId = null;
    this.editTaskForm.reset();
    this.toastService.showSuccess('Task updated successfully!');
  }

  public toggleStatus(task: Task): void {
    const updatedTask: Task = {
      ...task,
      status: !task.status,
    };
    this.todoService.updateTask(updatedTask);
    const message = updatedTask.status
      ? 'Task marked as completed!'
      : 'Task marked as incomplete!';
    this.toastService.showSuccess(message);
  }

  private showConfirmationModal(newTaskId: number): void {
    const confirmation = confirm('Do you really want to undo the changes?');
    if (confirmation) {
      this.editingTaskId = null;
      this.selectedItemId = newTaskId;
      this.cdr.detectChanges();
    }
  }

  public toggleDescription(taskId: number, event: Event): void {
    event.stopPropagation();
    this.selectedItemId = this.selectedItemId === taskId ? null : taskId;
  }

  public trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  public applyFilter(filter: string | null): void {
    this.filterSubject.next(filter);
    this.filteredTasks$ = combineLatest([this.tasks$, this.filterSubject]).pipe(
      map(([tasks, filter]) => {
        if (!filter) {
          return tasks;
        }
        if (filter === 'completed') {
          return tasks.filter((task) => task.status === true);
        } else if (filter === 'in progress') {
          return tasks.filter(
            (task) => task.status === false || task.status === null,
          );
        } else {
          return tasks;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
