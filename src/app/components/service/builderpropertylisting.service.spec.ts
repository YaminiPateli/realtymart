import { TestBed } from '@angular/core/testing';

import { BuilderpropertylistingService } from './builderpropertylisting.service';

describe('BuilderpropertylistingService', () => {
  let service: BuilderpropertylistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderpropertylistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
