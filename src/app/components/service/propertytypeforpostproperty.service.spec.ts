import { TestBed } from '@angular/core/testing';

import { PropertytypeforpostpropertyService } from './propertytypeforpostproperty.service';

describe('PropertytypeforpostpropertyService', () => {
  let service: PropertytypeforpostpropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytypeforpostpropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
