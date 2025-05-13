import { TestBed } from '@angular/core/testing';

import { PropertytypesbuyinService } from './propertytypesbuyin.service';

describe('PropertytypesbuyinService', () => {
  let service: PropertytypesbuyinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertytypesbuyinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
