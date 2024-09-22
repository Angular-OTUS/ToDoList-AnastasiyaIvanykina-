import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  imports: [CommonModule]
})
export class ButtonComponent {
  @Input() title!: string;
  @Input() disabled: boolean = false;
  @Input() buttonClasses: { [key: string]: boolean } = {};
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}
