import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreLocalitiesComponent } from './explore-localities.component';

describe('ExploreLocalitiesComponent', () => {
  let component: ExploreLocalitiesComponent;
  let fixture: ComponentFixture<ExploreLocalitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExploreLocalitiesComponent]
    });
    fixture = TestBed.createComponent(ExploreLocalitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
