import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest,
  HttpHandler, HttpEvent
} from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth.isLoggedIn()) {
      return next.handle(req);
    }

    return from(this.auth.getValidToken()).pipe(
      switchMap(token => {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next.handle(cloned);
      })
    );
  }
}