import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-to-do-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './to-do-list-item-component.component.html',
  styleUrls: ['./to-do-list-item-component.component.css'],
})
export class ToDoListItemComponent {
  @Input() item!: { id: number; text: string };
  @Output() delete = new EventEmitter<number>();
  deleteButtonTitle: string = 'Delete';

  deleteItem() {
    this.delete.emit(this.item.id);
  }
}
