import { TestBed } from '@angular/core/testing';

import { PropertytypepgService } from './propertytypepg.service';

describe('PropertytypepgService', () => {
  let service: PropertytypepgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytypepgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
