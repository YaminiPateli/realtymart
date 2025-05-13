import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyincityrentComponent } from './propertyincityrent.component';

describe('PropertyincityrentComponent', () => {
  let component: PropertyincityrentComponent;
  let fixture: ComponentFixture<PropertyincityrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyincityrentComponent]
    });
    fixture = TestBed.createComponent(PropertyincityrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
