import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  imports: [CommonModule, SharedModule],
})
export class ButtonComponent {
  @Input() title!: string;
  @Input() disabled: boolean = false;
  @Input() buttonClasses: { [key: string]: boolean } = {};
  @Input() tooltipText: string = 'Click me!';
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}
