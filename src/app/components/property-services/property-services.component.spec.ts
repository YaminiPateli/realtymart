import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyServicesComponent } from './property-services.component';

describe('PropertyServicesComponent', () => {
  let component: PropertyServicesComponent;
  let fixture: ComponentFixture<PropertyServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyServicesComponent]
    });
    fixture = TestBed.createComponent(PropertyServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
