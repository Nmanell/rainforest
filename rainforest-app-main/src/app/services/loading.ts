import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HeaderMessage {
  icon: string;
  title: string;
  message: string;
  rightText?: string;
  variant?: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<HeaderMessage | null>(null);

  getLoadingState(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  getMessageState(): Observable<HeaderMessage | null> {
    return this.messageSubject.asObservable();
  }

  setMessage(message: HeaderMessage | null): void {
    this.messageSubject.next(message);
  }

  showMessage(message: HeaderMessage, duration: number = 5000): void {
    this.messageSubject.next(message);
    if (duration > 0) {
      setTimeout(() => {
        this.messageSubject.next(null);
      }, duration);
    }
  }
}
