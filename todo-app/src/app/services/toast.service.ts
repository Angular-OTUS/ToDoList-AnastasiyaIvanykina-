import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<string[]>([]);
  private toasts: string[] = this.toastsSubject.value;

  getToasts(): Observable<string[]> {
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

  showSuccess(message: string): void {
    this.showToast(`Success: ${message}`);
  }

  showError(message: string): void {
    this.showToast(`Error: ${message}`);
  }

  removeToast(index: number): void {
    this.toasts.splice(index, 1);
    this.toastsSubject.next([...this.toasts]);
  }
}
