import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Set loading state to true before forwarding request (Hands-On 8 Step 91)
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Revert loading state to false on completion, completion error, or cancellation (finalize)
      loadingService.hide();
    })
  );
};
