import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
  standalone: true
})
export class ErrorMessage {
  @Input() title: string = 'Error';
  @Input() message: string = '';
  @Input() showSupport: boolean = false;
  @Input() variant: 'error' | 'warning' = 'error';
}
