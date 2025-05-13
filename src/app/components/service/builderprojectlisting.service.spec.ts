import { TestBed } from '@angular/core/testing';

import { BuilderprojectlistingService } from './builderprojectlisting.service';

describe('BuilderprojectlistingService', () => {
  let service: BuilderprojectlistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderprojectlistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
