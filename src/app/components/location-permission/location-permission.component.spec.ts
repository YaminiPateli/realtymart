import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPermissionComponent } from './location-permission.component';

describe('LocationPermissionComponent', () => {
  let component: LocationPermissionComponent;
  let fixture: ComponentFixture<LocationPermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationPermissionComponent]
    });
    fixture = TestBed.createComponent(LocationPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
