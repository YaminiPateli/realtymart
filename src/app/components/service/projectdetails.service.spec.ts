import { TestBed } from '@angular/core/testing';

import { ProjectdetailsService } from './projectdetails.service';

describe('ProjectdetailsService', () => {
  let service: ProjectdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
