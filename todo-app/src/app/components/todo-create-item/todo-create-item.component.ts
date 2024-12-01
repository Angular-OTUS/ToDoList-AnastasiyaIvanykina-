import {
  Component,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../button/button.component';
import { TodoService, Task } from '../../services/todo.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { v4 as uuidv4 } from 'uuid';
import { TaskCreate } from './task-create.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-create-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonComponent,
  ],
  templateUrl: './todo-create-item.component.html',
  styleUrls: ['./todo-create-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCreateItemComponent implements OnDestroy {
  @Output() taskCreated = new EventEmitter<TaskCreate>();
  public addTaskForm: FormGroup;
  public addButtonTitle: string = 'Add task';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.addTaskForm = this.fb.group({
      newTask: ['', Validators.required],
      newDescription: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.addTaskForm.valid) {
      const newTask: Task = {
        id: uuidv4(),
        text: this.addTaskForm.value.newTask.trim(),
        description: this.addTaskForm.value.newDescription.trim(),
        status: undefined,
      };
      const addTaskSubscription = this.todoService.addTask(newTask).subscribe({
        next: (addedTask) => {
          this.taskCreated.emit({
            text: addedTask.text,
            description: addedTask.description,
          });
          this.addTaskForm.reset();
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        },
      });
      this.subscriptions.add(addTaskSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
