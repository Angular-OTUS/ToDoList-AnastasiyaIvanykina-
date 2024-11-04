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
import { Observable, Subject } from 'rxjs';
import { map, first, takeUntil, delay } from 'rxjs/operators';
import { ClickDirective } from '../../shared/click.directive';
import { TooltipDirective } from '../../shared/tooltip.directive';

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
  ],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListComponent implements OnInit, OnDestroy {
  title: string = 'ToDo-list';
  addButtonTitle: string = 'Add task';
  tasks!: Observable<Task[]>;
  addTaskForm: FormGroup;
  editTaskForm: FormGroup;
  viewTaskForm: FormGroup;
  selectedItemId: number | null = null;
  editingTaskId: number | null = null;
  isLoading: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private todoService: TodoService,
    private toastService: ToastService,
  ) {
    this.addTaskForm = this.fb.group({
      newTask: ['', Validators.required],
      newDescription: ['', Validators.required],
    });

    this.editTaskForm = this.fb.group({
      editTask: ['', Validators.required],
      editDescription: ['', Validators.required],
    });

    this.viewTaskForm = this.fb.group({
      viewTask: ['', Validators.required],
      viewDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.tasks = this.todoService
      .getTasks()
      .pipe(delay(500), takeUntil(this.destroy$));
    this.tasks.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.isLoading = false;
      },
    });
  }

  addTask(): void {
    if (this.addTaskForm.valid) {
      this.tasks.pipe(first(), takeUntil(this.destroy$)).subscribe({
        next: (tasks) => {
          const maxId = Math.max(...tasks.map((task: Task) => task.id));
          this.todoService.addTask({
            id: maxId + 1,
            text: this.addTaskForm.value.newTask.trim(),
            description: this.addTaskForm.value.newDescription.trim(),
          });
          this.addTaskForm.reset();
          this.toastService.showToast('Task added successfully!');
          this.editingTaskId = null;
        },
        error: (err) => {
          this.toastService.showToast('Failed to add task!');
        },
      });
    }
  }

  deleteTask(taskId: number, event: Event): void {
    event.stopPropagation();
    this.todoService.deleteTask(taskId);
    this.toastService.showToast('Task deleted successfully!');
  }

  handleClick(taskId: number, event: Event): void {
    event.stopPropagation();
    if (this.editingTaskId !== null && this.editingTaskId !== taskId) {
      this.showConfirmationModal(taskId);
    } else {
      this.selectedItemId = taskId;
      this.cdr.detectChanges();
    }
  }

  editTask(taskId: number): void {
    if (this.selectedItemId !== taskId) {
      this.selectedItemId = taskId;
      this.cdr.detectChanges();
    }
    this.editingTaskId = taskId;
    this.tasks
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
          });
          this.cdr.detectChanges();
        } else {
          this.toastService.showToast('Task not found!');
        }
      });
  }

  saveTask(taskId: number): void {
    const updatedTask: Task = {
      id: taskId,
      text: this.editTaskForm.get('editTask')?.value,
      description: this.editTaskForm.get('editDescription')?.value,
    };
    this.todoService.updateTask(updatedTask);
    this.editingTaskId = null;
    this.editTaskForm.reset();
    this.toastService.showToast('Task updated successfully!');
  }

  showConfirmationModal(newTaskId: number): void {
    const confirmation = confirm('Do you really want to undo the changes?');
    if (confirmation) {
      this.editingTaskId = null;
      this.selectedItemId = newTaskId;
      this.cdr.detectChanges();
    } else {
    }
  }

  toggleDescription(taskId: number, event: Event): void {
    event.stopPropagation();
    this.selectedItemId = this.selectedItemId === taskId ? null : taskId;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
