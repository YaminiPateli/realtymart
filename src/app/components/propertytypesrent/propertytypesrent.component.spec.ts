import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertytypesrentComponent } from './propertytypesrent.component';

describe('PropertytypesrentComponent', () => {
  let component: PropertytypesrentComponent;
  let fixture: ComponentFixture<PropertytypesrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertytypesrentComponent]
    });
    fixture = TestBed.createComponent(PropertytypesrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
