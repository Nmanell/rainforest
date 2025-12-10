import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { LoadingService, HeaderMessage } from '../services/loading';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header implements OnInit, OnDestroy {
  isLoading = false;
  message: HeaderMessage | null = null;
  isMessageExiting = false;
  private loadingSubscription?: Subscription;
  private messageSubscription?: Subscription;

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.loadingService.getLoadingState().subscribe(
      isLoading => {
        this.isLoading = isLoading;
        this.cdr.detectChanges();
      }
    );

    this.messageSubscription = this.loadingService.getMessageState().subscribe(
      message => {
        if (message) {
          this.message = message;
          this.isMessageExiting = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.isMessageExiting = true;
            this.cdr.detectChanges();

            setTimeout(() => {
              this.message = null;
              this.isMessageExiting = false;
              this.cdr.detectChanges();
            }, 300);
          }, 1500);
        }
      }
    );
  }
  ngOnDestroy() {
    this.loadingSubscription?.unsubscribe();
    this.messageSubscription?.unsubscribe();
  }
}
