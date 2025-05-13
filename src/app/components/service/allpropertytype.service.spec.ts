import { TestBed } from '@angular/core/testing';

import { AllpropertytypeService } from './allpropertytype.service';

describe('AllpropertytypeService', () => {
  let service: AllpropertytypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllpropertytypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
