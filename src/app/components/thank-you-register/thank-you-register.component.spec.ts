import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouRegisterComponent } from './thank-you-register.component';

describe('ThankYouRegisterComponent', () => {
  let component: ThankYouRegisterComponent;
  let fixture: ComponentFixture<ThankYouRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThankYouRegisterComponent]
    });
    fixture = TestBed.createComponent(ThankYouRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
