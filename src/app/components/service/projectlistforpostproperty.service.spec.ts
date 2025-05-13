import { TestBed } from '@angular/core/testing';

import { ProjectlistforpostpropertyService } from './projectlistforpostproperty.service';

describe('ProjectlistforpostpropertyService', () => {
  let service: ProjectlistforpostpropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectlistforpostpropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
