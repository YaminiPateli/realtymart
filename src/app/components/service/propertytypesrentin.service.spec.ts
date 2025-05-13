import { TestBed } from '@angular/core/testing';

import { PropertytypesrentinService } from './propertytypesrentin.service';

describe('PropertytypesrentinService', () => {
  let service: PropertytypesrentinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytypesrentinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
