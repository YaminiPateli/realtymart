import { TestBed } from '@angular/core/testing';

import { FarmhouseService } from './farmhouse.service';

describe('FarmhouseService', () => {
  let service: FarmhouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmhouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
