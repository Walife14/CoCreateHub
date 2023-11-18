import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)
  const authService = inject(AuthService)

  if(authService.currentUser.token) {
    return true
  }
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } })
  return false;
};
