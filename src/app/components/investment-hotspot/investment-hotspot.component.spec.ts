import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentHotspotComponent } from './investment-hotspot.component';

describe('InvestmentHotspotComponent', () => {
  let component: InvestmentHotspotComponent;
  let fixture: ComponentFixture<InvestmentHotspotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentHotspotComponent]
    });
    fixture = TestBed.createComponent(InvestmentHotspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
