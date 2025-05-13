import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistedPropertiesComponent } from './shortlisted-properties.component';

describe('ShortlistedPropertiesComponent', () => {
  let component: ShortlistedPropertiesComponent;
  let fixture: ComponentFixture<ShortlistedPropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShortlistedPropertiesComponent]
    });
    fixture = TestBed.createComponent(ShortlistedPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
