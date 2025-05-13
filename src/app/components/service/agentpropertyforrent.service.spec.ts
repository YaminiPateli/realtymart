import { TestBed } from '@angular/core/testing';

import { AgentpropertyforrentService } from './agentpropertyforrent.service';

describe('AgentpropertyforrentService', () => {
  let service: AgentpropertyforrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentpropertyforrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
