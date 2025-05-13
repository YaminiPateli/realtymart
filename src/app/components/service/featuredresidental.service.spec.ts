import { TestBed } from '@angular/core/testing';

import { FeaturedresidentalService } from './featuredresidental.service';

describe('FeaturedresidentalService', () => {
  let service: FeaturedresidentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedresidentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
