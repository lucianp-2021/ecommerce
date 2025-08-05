import { Inject, Injectable, Type } from '@angular/core';
import { Observable, from, lastValueFrom } from 'rxjs';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
// Update the import path if your environment file is located elsewhere, for example:
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const theEndpoint = environment.shopApiUrl + '/orders';
    const securedEndpoints = [theEndpoint];

    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      await this.auth.getAccessTokenSilently().forEach((token) => {
        console.log('Access Token: ', token);
        console.log('end point: ', theEndpoint);
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          },
        });
      });
    }
    return await lastValueFrom(next.handle(request));
  }

}