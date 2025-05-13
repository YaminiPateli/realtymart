import { TestBed } from '@angular/core/testing';

import { PropertyincitybuyService } from './propertyincitybuy.service';

describe('PropertyincitybuyService', () => {
  let service: PropertyincitybuyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyincitybuyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
