import { TestBed } from '@angular/core/testing';

import { HomepagesearchService } from './homepagesearch.service';

describe('HomepagesearchService', () => {
  let service: HomepagesearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomepagesearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
