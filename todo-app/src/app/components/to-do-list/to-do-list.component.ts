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
  ],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListComponent implements OnInit, OnDestroy {
  title: string = 'ToDo-list';
  addButtonTitle: string = 'Add task';
  tasks!: Observable<Task[]>;
  taskForm: FormGroup;
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
    this.taskForm = this.fb.group({
      newTask: ['', Validators.required],
      newDescription: ['', Validators.required],
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
    if (this.taskForm.valid) {
      this.tasks.pipe(first(), takeUntil(this.destroy$)).subscribe({
        next: (tasks) => {
          const maxId = Math.max(...tasks.map((task: Task) => task.id));
          this.todoService.addTask({
            id: maxId + 1,
            text: this.taskForm.value.newTask.trim(),
            description: this.taskForm.value.newDescription.trim(),
          });
          this.taskForm.reset();
          this.toastService.showToast('Task added successfully!');
        },
        error: (err) => {
          console.error('Error adding task:', err);
          this.toastService.showToast('Failed to add task.');
        },
      });
    }
  }

  deleteTask(taskId: number): void {
    this.todoService.deleteTask(taskId);
    this.toastService.showToast('Task deleted successfully!');
  }

  selectTask(taskId: number, event: Event): void {
    event.stopPropagation();
    if (this.editingTaskId !== null && this.editingTaskId !== taskId) {
      this.showConfirmationModal(taskId);
    } else {
      this.selectedItemId = taskId;
      this.cdr.detectChanges();
    }
  }

  editTask(taskId: number): void {
    this.editingTaskId = taskId;
    this.tasks
      .pipe(
        first(),
        map((tasks) => tasks.find((task: Task) => task.id === taskId)),
        takeUntil(this.destroy$),
      )
      .subscribe((task) => {
        if (task) {
          this.taskForm.patchValue({
            newTask: task.text,
            newDescription: task.description,
          });
        } else {
          this.toastService.showToast('Task not found!');
        }
      });
  }

  saveTask(taskId: number): void {
    const updatedTask: Task = {
      id: taskId,
      text: this.taskForm.get('newTask')?.value,
      description: this.taskForm.get('newDescription')?.value,
    };
    this.todoService.updateTask(updatedTask.id, updatedTask.text);
    this.editingTaskId = null;
    this.taskForm.reset();
    this.toastService.showToast('Task updated successfully!');
  }

  showConfirmationModal(newTaskId: number): void {
    const confirmation = confirm('Do you really want to undo the changes?');
    if (confirmation) {
      this.editingTaskId = null;
      this.selectedItemId = newTaskId;
      this.cdr.detectChanges();
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
