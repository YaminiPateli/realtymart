import { TestBed } from '@angular/core/testing';

import { OwnerpropertyrentService } from './ownerpropertyrent.service';

describe('OwnerpropertyrentService', () => {
  let service: OwnerpropertyrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerpropertyrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
