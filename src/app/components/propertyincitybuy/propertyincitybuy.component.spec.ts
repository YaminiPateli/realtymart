import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyincitybuyComponent } from './propertyincitybuy.component';

describe('PropertyincitybuyComponent', () => {
  let component: PropertyincitybuyComponent;
  let fixture: ComponentFixture<PropertyincitybuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyincitybuyComponent]
    });
    fixture = TestBed.createComponent(PropertyincitybuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
