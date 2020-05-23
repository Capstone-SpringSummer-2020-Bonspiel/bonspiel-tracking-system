import { TestBed } from '@angular/core/testing';

import { ModuleImportGuard } from './module-import.guard';

describe('ModuleImportGuard', () => {
  let guard: ModuleImportGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModuleImportGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
