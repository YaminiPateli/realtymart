import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldPackageComponent } from './gold-package.component';

describe('GoldPackageComponent', () => {
  let component: GoldPackageComponent;
  let fixture: ComponentFixture<GoldPackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldPackageComponent]
    });
    fixture = TestBed.createComponent(GoldPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
