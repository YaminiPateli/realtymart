import { TestBed } from '@angular/core/testing';

import { HotdealsserviceService } from './hotdealsservice.service';

describe('HotdealsserviceService', () => {
  let service: HotdealsserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotdealsserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
