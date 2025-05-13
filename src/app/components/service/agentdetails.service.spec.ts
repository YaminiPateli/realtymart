import { TestBed } from '@angular/core/testing';

import { AgentdetailsService } from './agentdetails.service';

describe('AgentdetailsService', () => {
  let service: AgentdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
