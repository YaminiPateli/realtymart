import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingPropertiesComponent } from './matching-properties.component';

describe('MatchingPropertiesComponent', () => {
  let component: MatchingPropertiesComponent;
  let fixture: ComponentFixture<MatchingPropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchingPropertiesComponent]
    });
    fixture = TestBed.createComponent(MatchingPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
