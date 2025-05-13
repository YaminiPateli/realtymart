import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDetailComponent } from './services-detail.component';

describe('ServicesDetailComponent', () => {
  let component: ServicesDetailComponent;
  let fixture: ComponentFixture<ServicesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesDetailComponent]
    });
    fixture = TestBed.createComponent(ServicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
