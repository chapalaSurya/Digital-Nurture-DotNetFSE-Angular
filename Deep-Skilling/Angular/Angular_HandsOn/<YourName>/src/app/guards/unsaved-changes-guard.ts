import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  // If the component reports unsaved changes, confirm with the user before navigating away (Hands-On 7 Step 77)
  if (component && component.hasUnsavedChanges()) {
    return window.confirm('You have unsaved changes. Leave?');
  }
  return true;
};
