import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPincodeComponent } from './find-pincode.component';

describe('FindPincodeComponent', () => {
  let component: FindPincodeComponent;
  let fixture: ComponentFixture<FindPincodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindPincodeComponent]
    });
    fixture = TestBed.createComponent(FindPincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
