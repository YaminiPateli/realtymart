import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyServicesListingComponent } from './property-services-listing.component';

describe('PropertyServicesListingComponent', () => {
  let component: PropertyServicesListingComponent;
  let fixture: ComponentFixture<PropertyServicesListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyServicesListingComponent]
    });
    fixture = TestBed.createComponent(PropertyServicesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
