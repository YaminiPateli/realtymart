import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingPropertiesEditComponent } from './matching-properties-edit.component';

describe('MatchingPropertiesEditComponent', () => {
  let component: MatchingPropertiesEditComponent;
  let fixture: ComponentFixture<MatchingPropertiesEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchingPropertiesEditComponent]
    });
    fixture = TestBed.createComponent(MatchingPropertiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
