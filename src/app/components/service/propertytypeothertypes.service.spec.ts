import { TestBed } from '@angular/core/testing';

import { PropertytypeothertypesService } from './propertytypeothertypes.service';

describe('PropertytypeothertypesService', () => {
  let service: PropertytypeothertypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytypeothertypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
