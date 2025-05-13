import { TestBed } from '@angular/core/testing';

import { AllcitiesService } from './allcities.service';

describe('AllcitiesService', () => {
  let service: AllcitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllcitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
