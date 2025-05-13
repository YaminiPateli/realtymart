import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbuildersComponent } from './topbuilders.component';

describe('TopbuildersComponent', () => {
  let component: TopbuildersComponent;
  let fixture: ComponentFixture<TopbuildersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopbuildersComponent]
    });
    fixture = TestBed.createComponent(TopbuildersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
