import { Component, EventEmitter, Output } from '@angular/core';
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
import { first } from 'rxjs/operators';

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
})
export class TodoCreateItemComponent {
  @Output() taskCreated = new EventEmitter<{
    text: string;
    description: string;
  }>();
  public addTaskForm: FormGroup;
  public addButtonTitle: string = 'Add task';

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
  ) {
    this.addTaskForm = this.fb.group({
      newTask: ['', Validators.required],
      newDescription: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.addTaskForm.valid) {
      const newTask = {
        text: this.addTaskForm.value.newTask.trim(),
        description: this.addTaskForm.value.newDescription.trim(),
      };
      this.taskCreated.emit(newTask);
      this.addTaskForm.reset();
    }
  }
}
