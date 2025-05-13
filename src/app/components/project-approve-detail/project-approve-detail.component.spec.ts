import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectApproveDetailComponent } from './project-approve-detail.component';

describe('ProjectApproveDetailComponent', () => {
  let component: ProjectApproveDetailComponent;
  let fixture: ComponentFixture<ProjectApproveDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectApproveDetailComponent]
    });
    fixture = TestBed.createComponent(ProjectApproveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
