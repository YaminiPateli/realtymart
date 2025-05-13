import { TestBed } from '@angular/core/testing';

import { PropertytyperesidentialService } from './propertytyperesidential.service';

describe('PropertytyperesidentialService', () => {
  let service: PropertytyperesidentialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytyperesidentialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
