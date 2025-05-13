import { TestBed } from '@angular/core/testing';

import { PgDetailsService } from './pg-details.service';

describe('PgDetailsService', () => {
  let service: PgDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PgDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
