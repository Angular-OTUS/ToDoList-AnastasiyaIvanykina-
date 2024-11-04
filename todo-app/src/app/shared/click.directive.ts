import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClick]',
  standalone: true,
})
export class ClickDirective {
  @Output() singleClick = new EventEmitter<Event>();
  @Output() doubleClick = new EventEmitter<Event>();

  private clickCount = 0;
  private timeout: any;

  @HostListener('click', ['$event'])
  handleClickEvent(event: Event): void {
    this.clickCount++;
    if (this.clickCount === 1) {
      this.timeout = setTimeout(() => {
        if (this.clickCount === 1) {
          this.singleClick.emit(event);
        }
        this.clickCount = 0;
      }, 250);
    } else if (this.clickCount === 2) {
      clearTimeout(this.timeout);
      this.doubleClick.emit(event);
      this.clickCount = 0;
    }
  }
}
