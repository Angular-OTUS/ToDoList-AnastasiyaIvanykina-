import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = '';
  tooltipElement: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#4242428f');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'top', '-30px');
    this.renderer.setStyle(this.tooltipElement, 'left', '50%');
    this.renderer.setStyle(
      this.tooltipElement,
      'transform',
      'translateX(-50%)',
    );
    this.renderer.setStyle(this.tooltipElement, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'display', 'none');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '1000');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  @HostListener('click') onClick() {
    this.showTooltip();
  }

  showTooltip() {
    if (this.el.nativeElement.disabled) {
      this.renderer.setStyle(this.tooltipElement, 'background', '#4242428f');
      this.renderer.setProperty(
        this.tooltipElement,
        'innerText',
        'Fill the fields',
      );
    } else {
      this.renderer.setStyle(this.tooltipElement, 'background', '#333');
      this.renderer.setProperty(
        this.tooltipElement,
        'innerText',
        this.tooltipText,
      );
    }
    this.renderer.setStyle(this.tooltipElement, 'display', 'block');
  }

  hideTooltip() {
    this.renderer.setStyle(this.tooltipElement, 'display', 'none');
  }
}
