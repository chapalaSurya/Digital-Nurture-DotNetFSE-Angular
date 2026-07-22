import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
  private notifications: string[] = [];

  add(message: string): void {
    this.notifications.push(message);
  }

  get(): string[] {
    return this.notifications;
  }
}
