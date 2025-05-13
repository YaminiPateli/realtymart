import { TestBed } from '@angular/core/testing';

import { AgentallprojectlistingService } from './agentallprojectlisting.service';

describe('AgentallprojectlistingService', () => {
  let service: AgentallprojectlistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentallprojectlistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
