import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Добавляем FormsModule
import { ButtonComponent } from '../button/button.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-to-do-list-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SharedModule], // Добавляем FormsModule
  templateUrl: './to-do-list-item-component.component.html',
  styleUrls: ['./to-do-list-item-component.component.css'],
})
export class ToDoListItemComponent {
  @Input() item!: { id: number; text: string; description: string };
  @Output() delete = new EventEmitter<number>();
  deleteButtonTitle: string = 'Delete';
  showDescriptionFlag: boolean = false;

  deleteItem() {
    this.delete.emit(this.item.id);
  }

  toggleDescription() {
    this.showDescriptionFlag = !this.showDescriptionFlag;
  }
}
