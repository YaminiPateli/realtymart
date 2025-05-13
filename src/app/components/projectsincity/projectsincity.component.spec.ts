import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsincityComponent } from './projectsincity.component';

describe('ProjectsincityComponent', () => {
  let component: ProjectsincityComponent;
  let fixture: ComponentFixture<ProjectsincityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsincityComponent]
    });
    fixture = TestBed.createComponent(ProjectsincityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
