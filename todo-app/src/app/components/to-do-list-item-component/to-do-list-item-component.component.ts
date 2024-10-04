import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-to-do-list-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SharedModule],
  templateUrl: './to-do-list-item-component.component.html',
  styleUrls: ['./to-do-list-item-component.component.css'],
})
export class ToDoListItemComponent {
  @Input() item!: { id: number; text: string; description: string };
  @Input() selectedItemId!: number | null;
  @Output() delete = new EventEmitter<number>();
  deleteButtonTitle: string = 'Delete';

  deleteItem(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.item.id);
  }

  toggleDescription(event: Event): void {
    event.stopPropagation();
    this.selectedItemId =
      this.selectedItemId === this.item.id ? null : this.item.id;
  }
}
