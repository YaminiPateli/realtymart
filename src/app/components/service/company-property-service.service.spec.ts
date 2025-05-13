import { TestBed } from '@angular/core/testing';

import { CompanyPropertyServiceService } from './company-property-service.service';

describe('CompanyPropertyServiceService', () => {
  let service: CompanyPropertyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyPropertyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
