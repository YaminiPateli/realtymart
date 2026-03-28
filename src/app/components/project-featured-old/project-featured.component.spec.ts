import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeaturedComponent } from './oldproject-featured.component';

describe('ProjectFeaturedComponent', () => {
  let component: ProjectFeaturedComponent;
  let fixture: ComponentFixture<ProjectFeaturedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectFeaturedComponent]
    });
    fixture = TestBed.createComponent(ProjectFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
