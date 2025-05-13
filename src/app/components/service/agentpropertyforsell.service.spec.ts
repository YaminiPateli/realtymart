import { TestBed } from '@angular/core/testing';

import { AgentpropertyforsellService } from './agentpropertyforsell.service';

describe('AgentpropertyforsellService', () => {
  let service: AgentpropertyforsellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentpropertyforsellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
