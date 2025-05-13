import { TestBed } from '@angular/core/testing';

import { BuilderdetailsService } from './builderdetails.service';

describe('BuilderdetailsService', () => {
  let service: BuilderdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
