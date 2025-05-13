import { TestBed } from '@angular/core/testing';

import { NewlylaunchedService } from './newlylaunched.service';

describe('NewlylaunchedService', () => {
  let service: NewlylaunchedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewlylaunchedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
