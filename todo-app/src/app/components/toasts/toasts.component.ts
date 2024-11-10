import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.css'],
})
export class ToastsComponent implements OnInit, OnDestroy {
  public toasts: string[] = [];
  private toastSubscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscribeToToasts();
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }

  private subscribeToToasts(): void {
    this.toastSubscription = this.toastService
      .getToasts()
      .subscribe((toasts) => {
        this.toasts = toasts;
      });
  }

  public removeToast(index: number): void {
    this.toastService.removeToast(index);
  }

  public getToastClass(toast: string): string {
    if (toast.includes('Success')) {
      return 'toast-success';
    } else if (toast.includes('Error')) {
      return 'toast-error';
    }
    return '';
  }
}
