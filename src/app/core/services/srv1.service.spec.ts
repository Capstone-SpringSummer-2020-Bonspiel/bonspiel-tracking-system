import { TestBed } from '@angular/core/testing';

import { Srv1Service } from './srv1.service';

describe('Srv1Service', () => {
  let service: Srv1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Srv1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
