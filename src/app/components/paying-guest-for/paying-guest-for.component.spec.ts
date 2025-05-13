import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayingGuestForComponent } from './paying-guest-for.component';

describe('PayingGuestForComponent', () => {
  let component: PayingGuestForComponent;
  let fixture: ComponentFixture<PayingGuestForComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayingGuestForComponent]
    });
    fixture = TestBed.createComponent(PayingGuestForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
