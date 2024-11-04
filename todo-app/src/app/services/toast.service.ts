import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<string[]>([
    'Task updated successfully!',
    'Task added successfully!',
    'Failed to add task!',
  ]);
  private toasts: string[] = this.toastsSubject.value;

  getToasts() {
    return this.toastsSubject.asObservable();
  }

  showToast(message: string): void {
    this.toasts.push(message);
    this.toastsSubject.next([...this.toasts]);
    setTimeout(() => {
      this.toasts.shift();
      this.toastsSubject.next([...this.toasts]);
    }, 3000);
  }

  removeToast(index: number): void {
    this.toasts.splice(index, 1);
    this.toastsSubject.next([...this.toasts]);
  }
}
