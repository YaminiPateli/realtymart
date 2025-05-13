import { TestBed } from '@angular/core/testing';

import { CountrycodeService } from './countrycode.service';

describe('CountrycodeService', () => {
  let service: CountrycodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountrycodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
