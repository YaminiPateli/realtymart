import { TestBed } from '@angular/core/testing';

import { SingleagentprojectlistingrentService } from './singleagentprojectlistingrent.service';

describe('SingleagentprojectlistingrentService', () => {
  let service: SingleagentprojectlistingrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleagentprojectlistingrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
