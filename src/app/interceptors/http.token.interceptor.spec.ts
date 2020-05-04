import { TestBed } from '@angular/core/testing';

import { Http.TokenInterceptor } from './http.token.interceptor';

describe('Http.TokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Http.TokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: Http.TokenInterceptor = TestBed.inject(Http.TokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
