import { TestBed } from '@angular/core/testing';

import { ExplorelocalitiesprojectlistingService } from './explorelocalitiesprojectlisting.service';

describe('ExplorelocalitiesprojectlistingService', () => {
  let service: ExplorelocalitiesprojectlistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplorelocalitiesprojectlistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
