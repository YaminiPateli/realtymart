import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderPropertyListingComponent } from './builder-property-listing.component';

describe('BuilderPropertyListingComponent', () => {
  let component: BuilderPropertyListingComponent;
  let fixture: ComponentFixture<BuilderPropertyListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuilderPropertyListingComponent]
    });
    fixture = TestBed.createComponent(BuilderPropertyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
