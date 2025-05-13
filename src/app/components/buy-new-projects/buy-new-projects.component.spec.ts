import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyNewProjectsComponent } from './buy-new-projects.component';

describe('BuyNewProjectsComponent', () => {
  let component: BuyNewProjectsComponent;
  let fixture: ComponentFixture<BuyNewProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyNewProjectsComponent]
    });
    fixture = TestBed.createComponent(BuyNewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
