import { TestBed } from '@angular/core/testing';

import { FeaturedbunlowsvillasService } from './featuredbunlowsvillas.service';

describe('FeaturedbunlowsvillasService', () => {
  let service: FeaturedbunlowsvillasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedbunlowsvillasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
