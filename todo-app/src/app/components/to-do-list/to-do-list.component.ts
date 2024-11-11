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
import { map, first, takeUntil } from 'rxjs/operators';
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
  public editTaskForm: FormGroup;
  public viewTaskForm: FormGroup;
  public selectedItemId: string | null = null;
  public editingTaskId: string | null = null;
  public isLoading: boolean = true;
  private filterSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private todoService: TodoService,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
  ) {
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
    setTimeout(() => {
      this.tasks$ = this.todoService.getTasks();
      this.filteredTasks$ = combineLatest([
        this.tasks$,
        this.filterSubject,
      ]).pipe(
        map(([tasks, filter]) => {
          if (!filter) {
            return tasks;
          }
          return tasks.filter(
            (task) => task.status === (filter === 'completed'),
          );
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
    }, 2000);
  }

  public onTaskCreated(task: { text: string; description: string }): void {
    this.toastService.showSuccess(`Task "${task.text}" created successfully!`);
  }

  public deleteTask(taskId: string, event: Event): void {
    event.stopPropagation();
    this.todoService
      .deleteTask(taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Task deleted successfully!');
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        },
      });
  }

  public handleClick(taskId: string, event: Event): void {
    event.stopPropagation();
    if (this.editingTaskId !== null && this.editingTaskId !== taskId) {
      this.showConfirmationModal(taskId);
    } else {
      this.selectedItemId = taskId;
      this.cdr.detectChanges();
    }
  }

  public editTask(taskId: string): void {
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

  public saveTask(taskId: string): void {
    const updatedTask: Task = {
      id: taskId,
      text: this.editTaskForm.get('editTask')?.value,
      description: this.editTaskForm.get('editDescription')?.value,
      status: this.editTaskForm.get('editStatus')?.value,
    };

    this.todoService
      .updateTask(updatedTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.editingTaskId = null;
          this.editTaskForm.reset();
          this.toastService.showSuccess('Task updated successfully!');
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        },
      });
  }

  public toggleStatus(task: Task): void {
    const updatedTask: Task = {
      ...task,
      status: !task.status,
    };
    this.todoService
      .updateTask(updatedTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const message = updatedTask.status
            ? 'Task marked as completed!'
            : 'Task marked as incomplete!';
          this.toastService.showSuccess(message);
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        },
      });
  }

  private showConfirmationModal(newTaskId: string): void {
    const confirmation = confirm('Do you really want to undo the changes?');
    if (confirmation) {
      this.editingTaskId = null;
      this.selectedItemId = newTaskId;
      this.cdr.detectChanges();
    }
  }

  public toggleDescription(taskId: string, event: Event): void {
    event.stopPropagation();
    this.selectedItemId = this.selectedItemId === taskId ? null : taskId;
  }

  public trackByTaskId(index: number, task: Task): string {
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
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
