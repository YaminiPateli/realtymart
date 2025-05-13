import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertytypesbuyComponent } from './propertytypesbuy.component';

describe('PropertytypesbuyComponent', () => {
  let component: PropertytypesbuyComponent;
  let fixture: ComponentFixture<PropertytypesbuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertytypesbuyComponent]
    });
    fixture = TestBed.createComponent(PropertytypesbuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
