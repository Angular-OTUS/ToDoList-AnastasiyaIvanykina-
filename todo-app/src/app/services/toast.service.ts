import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new Subject<string[]>();
  private toasts: string[] = [];

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
}
