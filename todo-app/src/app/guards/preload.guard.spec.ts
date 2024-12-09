import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { preloadGuard } from './preload.guard';

describe('preloadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => preloadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
