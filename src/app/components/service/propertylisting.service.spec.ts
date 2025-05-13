import { TestBed } from '@angular/core/testing';

import { PropertylistingService } from './propertylisting.service';

describe('PropertylistingService', () => {
  let service: PropertylistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertylistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
