import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderAllProjectListComponent } from './builder-project.component';

describe('BuilderAllProjectListComponent', () => {
  let component: BuilderAllProjectListComponent;
  let fixture: ComponentFixture<BuilderAllProjectListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuilderAllProjectListComponent]
    });
    fixture = TestBed.createComponent(BuilderAllProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
