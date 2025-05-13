import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderListingComponent } from './builder-listing.component';

describe('BuilderListingComponent', () => {
  let component: BuilderListingComponent;
  let fixture: ComponentFixture<BuilderListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuilderListingComponent]
    });
    fixture = TestBed.createComponent(BuilderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
