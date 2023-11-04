import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const userService = inject(UserService)

  if(userService.currentUser.token) {
    router.navigate(['/dashboard'])
    return false
  }
  return true;
};
