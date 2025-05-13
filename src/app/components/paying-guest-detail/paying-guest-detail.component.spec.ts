import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayingGuestDetailComponent } from './paying-guest-detail.component';

describe('PayingGuestDetailComponent', () => {
  let component: PayingGuestDetailComponent;
  let fixture: ComponentFixture<PayingGuestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayingGuestDetailComponent]
    });
    fixture = TestBed.createComponent(PayingGuestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
