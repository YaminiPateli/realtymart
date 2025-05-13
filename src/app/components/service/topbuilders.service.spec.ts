import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbuildersService } from './topbuilders.service';

describe('TopbuildersService', () => {
  let component: TopbuildersService;
  let fixture: ComponentFixture<TopbuildersService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopbuildersService],
    });
    fixture = TestBed.createComponent(TopbuildersService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
