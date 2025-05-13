import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerpropertyComponent } from './ownerproperty.component';

describe('OwnerpropertyComponent', () => {
  let component: OwnerpropertyComponent;
  let fixture: ComponentFixture<OwnerpropertyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerpropertyComponent]
    });
    fixture = TestBed.createComponent(OwnerpropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
