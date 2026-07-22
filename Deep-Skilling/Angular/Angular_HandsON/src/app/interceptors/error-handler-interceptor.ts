import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Global HTTP Error Interception (Hands-On 8 Step 90)
      if (error.status === 401) {
        console.error('Unauthorized request - Redirecting to login/home');
        router.navigate(['/']);
      } else if (error.status === 500) {
        console.error('Internal Server Error (500) - Global Alert Triggered');
        alert('Server Error (500): Something went wrong on the server.');
      }
      return throwError(() => error);
    })
  );
};
