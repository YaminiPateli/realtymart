import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlylaunchedComponent } from './newlylaunched.component';

describe('NewlylaunchedComponent', () => {
  let component: NewlylaunchedComponent;
  let fixture: ComponentFixture<NewlylaunchedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewlylaunchedComponent]
    });
    fixture = TestBed.createComponent(NewlylaunchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
