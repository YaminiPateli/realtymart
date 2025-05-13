import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreBuildersComponent } from './explore-builders.component';

describe('ExploreBuildersComponent', () => {
  let component: ExploreBuildersComponent;
  let fixture: ComponentFixture<ExploreBuildersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExploreBuildersComponent]
    });
    fixture = TestBed.createComponent(ExploreBuildersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
