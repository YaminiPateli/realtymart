import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedpropertyRentComponent } from './verifiedpropertyrent.component';

describe('VerifiedpropertyRentComponent', () => {
  let component: VerifiedpropertyRentComponent;
  let fixture: ComponentFixture<VerifiedpropertyRentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifiedpropertyRentComponent]
    });
    fixture = TestBed.createComponent(VerifiedpropertyRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
