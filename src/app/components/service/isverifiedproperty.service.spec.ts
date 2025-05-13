import { TestBed } from '@angular/core/testing';

import { IsverifiedpropertyService } from './isverifiedproperty.service';

describe('IsverifiedpropertyService', () => {
  let service: IsverifiedpropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsverifiedpropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
