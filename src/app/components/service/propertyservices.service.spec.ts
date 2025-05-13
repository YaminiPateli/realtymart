import { TestBed } from '@angular/core/testing';

import { PropertyservicesService } from './propertyservices.service';

describe('PropertyservicesService', () => {
  let service: PropertyservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
