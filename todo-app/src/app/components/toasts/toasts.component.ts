import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.css'],
})
export class ToastsComponent implements OnInit {
  toasts: string[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToasts().subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  removeToast(index: number): void {
    this.toastService.removeToast(index);
  }

  getToastClass(toast: string): string {
    if (toast.includes('successfully')) {
      return 'toast-success';
    } else if (toast.includes('Failed')) {
      return 'toast-error';
    }
    return '';
  }
}
