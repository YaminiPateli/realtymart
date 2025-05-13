import { TestBed } from '@angular/core/testing';

import { HomepagebannerService } from './homepagebanner.service';

describe('HomepagebannerService', () => {
  let service: HomepagebannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomepagebannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
