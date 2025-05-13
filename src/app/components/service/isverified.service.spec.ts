import { TestBed } from '@angular/core/testing';

import { IsverifiedService } from './isverified.service';

describe('IsverifiedService', () => {
  let service: IsverifiedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsverifiedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
