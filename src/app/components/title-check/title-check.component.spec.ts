import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleCheckComponent } from './title-check.component';

describe('TitleCheckComponent', () => {
  let component: TitleCheckComponent;
  let fixture: ComponentFixture<TitleCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TitleCheckComponent]
    });
    fixture = TestBed.createComponent(TitleCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
