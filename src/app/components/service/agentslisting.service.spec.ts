import { TestBed } from '@angular/core/testing';

import { AgentslistingService } from './agentslisting.service';

describe('AgentslistingService', () => {
  let service: AgentslistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentslistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
