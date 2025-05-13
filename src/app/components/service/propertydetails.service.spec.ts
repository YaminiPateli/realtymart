import { TestBed } from '@angular/core/testing';

import { PropertydetailsService } from './propertydetails.service';

describe('PropertydetailsService', () => {
  let service: PropertydetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertydetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
