import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, FormsModule],
  providers: [NotificationService], // Scoped component-level provider (Hands-On 6 Step 67)
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent {
  @Input() name: string = 'Default Instance';
  newAlert: string = '';

  /*
   * WHY COMPONENT-LEVEL PROVIDING CREATES A SEPARATE INSTANCE:
   *
   * By adding `NotificationService` to the `providers` list of this component:
   * 1. Angular creates a new injector specifically for this component instance.
   * 2. Whenever this component or its children request the `NotificationService`, they get
   *    the instance created by this component's injector.
   * 3. This instance is completely isolated from other `NotificationService` instances created
   *    in other components or globally.
   * 4. This is highly useful for managing local, scoped state that shouldn't leak to other
   *    parts of the application (e.g. state of a specific form widget, popup alerts, dashboard tab state).
   */
  constructor(private notificationService: NotificationService) {}

  addAlert(): void {
    if (this.newAlert.trim()) {
      this.notificationService.add(this.newAlert);
      this.newAlert = '';
    }
  }

  get alerts(): string[] {
    return this.notificationService.get();
  }
}
