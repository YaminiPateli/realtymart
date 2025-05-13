import { TestBed } from '@angular/core/testing';

import { BuilderprojectService } from './builderproject.service';

describe('BuilderprojectService', () => {
  let service: BuilderprojectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderprojectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
