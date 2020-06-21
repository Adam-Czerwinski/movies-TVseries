import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class ApiInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith('assets')) return next.handle(req);

    req = this.addUrl(req);

    const request = req.clone({
      setParams: {
        api_key: '1f1e21ddcabcb67b381c1ab4ae8deff6',
      },
    });

    return next.handle(request);
  }

  private addUrl(req: HttpRequest<any>): HttpRequest<any> {
    const url = 'https://api.themoviedb.org' + req.url;
    const modifiedRequest = req.clone({
      url: url,
    });
    return modifiedRequest;
  }
}
