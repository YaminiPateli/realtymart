import { TestBed } from '@angular/core/testing';

import { ExplorelocalitiesService } from './explorelocalities.service';

describe('ExplorelocalitiesService', () => {
  let service: ExplorelocalitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplorelocalitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
