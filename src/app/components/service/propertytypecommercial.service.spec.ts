import { TestBed } from '@angular/core/testing';

import { PropertytypecommercialService } from './propertytypecommercial.service';

describe('PropertytypecommercialService', () => {
  let service: PropertytypecommercialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytypecommercialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
