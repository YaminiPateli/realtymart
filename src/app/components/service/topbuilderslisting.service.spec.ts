import { TestBed } from '@angular/core/testing';

import { TopbuilderslistingService } from './topbuilderslisting.service';

describe('TopbuilderslistingService', () => {
  let service: TopbuilderslistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopbuilderslistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
