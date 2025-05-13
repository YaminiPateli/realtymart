import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPackagesComponent } from './ad-packages.component';

describe('AdPackagesComponent', () => {
  let component: AdPackagesComponent;
  let fixture: ComponentFixture<AdPackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdPackagesComponent]
    });
    fixture = TestBed.createComponent(AdPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
