import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingGuideComponent } from './selling-guide.component';

describe('SellingGuideComponent', () => {
  let component: SellingGuideComponent;
  let fixture: ComponentFixture<SellingGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellingGuideComponent]
    });
    fixture = TestBed.createComponent(SellingGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
