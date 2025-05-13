import { TestBed } from '@angular/core/testing';

import { AgentcommercialpropertyforsellService } from './agentcommercialpropertyforsell.service';

describe('AgentcommercialpropertyforsellService', () => {
  let service: AgentcommercialpropertyforsellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentcommercialpropertyforsellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
