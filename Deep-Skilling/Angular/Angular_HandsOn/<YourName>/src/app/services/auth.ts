import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = true; // Hardcoded logged in state for now (Hands-On 7 Step 75)
}
