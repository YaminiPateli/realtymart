import { TestBed } from '@angular/core/testing';

import { FeaturedcommercialService } from './featuredcommercial.service';

describe('FeaturedcommercialService', () => {
  let service: FeaturedcommercialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedcommercialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
