import { TestBed } from '@angular/core/testing';

import { SinglePropertyService } from './singleproperty.service'; // Corrected import


describe('SinglepropertyService', () => {
  let service: SinglePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinglePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
