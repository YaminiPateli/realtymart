import { TestBed } from '@angular/core/testing';

import { PropertyincityrentService } from './propertyincityrent.service';

describe('PropertyincityrentService', () => {
  let service: PropertyincityrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyincityrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
