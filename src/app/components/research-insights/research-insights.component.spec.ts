import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchInsightsComponent } from './research-insights.component';

describe('ResearchInsightsComponent', () => {
  let component: ResearchInsightsComponent;
  let fixture: ComponentFixture<ResearchInsightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchInsightsComponent]
    });
    fixture = TestBed.createComponent(ResearchInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
