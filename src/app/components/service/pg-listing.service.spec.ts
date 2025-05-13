import { TestBed } from '@angular/core/testing';

import { PgListingService } from './pg-listing.service';

describe('PgListingService', () => {
  let service: PgListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PgListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
