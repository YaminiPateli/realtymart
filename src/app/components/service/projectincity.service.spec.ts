import { TestBed } from '@angular/core/testing';

import { ProjectincityService } from './projectincity.service';

describe('ProjectincityService', () => {
  let service: ProjectincityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectincityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
