import { TestBed } from '@angular/core/testing';

import { IssponsoredService } from './issponsored.service';

describe('IssponsoredService', () => {
  let service: IssponsoredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssponsoredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
