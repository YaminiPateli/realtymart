import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerpropertyrentComponent } from './ownerpropertyrent.component';

describe('OwnerpropertyrentComponent', () => {
  let component: OwnerpropertyrentComponent;
  let fixture: ComponentFixture<OwnerpropertyrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerpropertyrentComponent]
    });
    fixture = TestBed.createComponent(OwnerpropertyrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
