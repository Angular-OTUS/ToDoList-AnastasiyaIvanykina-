import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToDoListItemComponent } from '../to-do-list-item-component/to-do-list-item-component.component';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    CommonModule,
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
export class ToDoListComponent implements OnInit {
  title: string = 'ToDo-list';
  addButtonTitle: string = 'Add task';
  tasks: {
    id: number;
    text: string;
    description: string;
    showDescriptionFlag?: boolean;
  }[] = [
    {
      id: 1,
      text: 'Buy a Porsche',
      description: 'Purchase a new Porsche car',
      showDescriptionFlag: false,
    },
    {
      id: 2,
      text: 'Take a walk with the dog',
      description: 'Walk the dog in the park',
      showDescriptionFlag: false,
    },
  ];
  newTask: string = '';
  newDescription: string = '';
  selectedItemId: number | null = null;
  isLoading: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  addTask(): void {
    if (this.newTask.trim() && this.newDescription.trim()) {
      const maxId = Math.max(...this.tasks.map((task) => task.id));
      this.tasks.push({
        id: maxId + 1,
        text: this.newTask.trim(),
        description: this.newDescription.trim(),
        showDescriptionFlag: false,
      });
      this.newTask = '';
      this.newDescription = '';
    }
  }

  deleteTask(taskId: number, event: Event): void {
    event.stopPropagation();
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  selectTask(taskId: number, event: Event): void {
    event.stopPropagation();
    console.log('Selected Task ID:', taskId);
    this.selectedItemId = taskId;
    this.cdr.detectChanges();
  }

  toggleDescription(taskId: number, event: Event): void {
    event.stopPropagation();
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.showDescriptionFlag = !task.showDescriptionFlag;
    }
  }
}
