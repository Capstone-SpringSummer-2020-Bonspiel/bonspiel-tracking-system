import { TestBed } from '@angular/core/testing';

import { Srv2Service } from './srv2.service';

describe('Srv2Service', () => {
  let service: Srv2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Srv2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
