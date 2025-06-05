import { TestBed } from '@angular/core/testing';

import { PropertyplotService } from './propertyplot.service';

describe('PropertyplotService', () => {
  let service: PropertyplotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyplotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
