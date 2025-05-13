import { TestBed } from '@angular/core/testing';

import { PropertytypehostelService } from './propertytypehostel.service';

describe('PropertytypehostelService', () => {
  let service: PropertytypehostelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytypehostelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
