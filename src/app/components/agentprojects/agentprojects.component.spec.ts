import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentprojectsComponent } from './agentprojects.component';

describe('AgentprojectsComponent', () => {
  let component: AgentprojectsComponent;
  let fixture: ComponentFixture<AgentprojectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentprojectsComponent]
    });
    fixture = TestBed.createComponent(AgentprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
