import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalitiesprojectlistingComponent } from './localitiesprojectlisting.component';

describe('LocalitiesprojectlistingComponent', () => {
  let component: LocalitiesprojectlistingComponent;
  let fixture: ComponentFixture<LocalitiesprojectlistingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalitiesprojectlistingComponent]
    });
    fixture = TestBed.createComponent(LocalitiesprojectlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
