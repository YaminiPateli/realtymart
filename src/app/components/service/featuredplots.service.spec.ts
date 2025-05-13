import { TestBed } from '@angular/core/testing';

import { FeaturedplotsService } from './featuredplots.service';

describe('FeaturedplotsService', () => {
  let service: FeaturedplotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedplotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
