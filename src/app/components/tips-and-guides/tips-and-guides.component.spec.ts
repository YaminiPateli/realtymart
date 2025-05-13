import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsAndGuidesComponent } from './tips-and-guides.component';

describe('TipsAndGuidesComponent', () => {
  let component: TipsAndGuidesComponent;
  let fixture: ComponentFixture<TipsAndGuidesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipsAndGuidesComponent]
    });
    fixture = TestBed.createComponent(TipsAndGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
