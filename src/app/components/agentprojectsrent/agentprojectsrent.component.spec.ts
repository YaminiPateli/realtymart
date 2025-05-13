import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentprojectsrentComponent } from './agentprojectsrent.component';

describe('AgentprojectsrentComponent', () => {
  let component: AgentprojectsrentComponent;
  let fixture: ComponentFixture<AgentprojectsrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentprojectsrentComponent]
    });
    fixture = TestBed.createComponent(AgentprojectsrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
