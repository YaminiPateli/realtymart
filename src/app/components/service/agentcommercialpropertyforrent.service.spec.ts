import { TestBed } from '@angular/core/testing';

import { AgentcommercialpropertyforrentService } from './agentcommercialpropertyforrent.service';

describe('AgentcommercialpropertyforrentService', () => {
  let service: AgentcommercialpropertyforrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentcommercialpropertyforrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
