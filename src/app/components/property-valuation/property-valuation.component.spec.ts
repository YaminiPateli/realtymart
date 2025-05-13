import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyValuationComponent } from './property-valuation.component';

describe('PropertyValuationComponent', () => {
  let component: PropertyValuationComponent;
  let fixture: ComponentFixture<PropertyValuationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyValuationComponent]
    });
    fixture = TestBed.createComponent(PropertyValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
