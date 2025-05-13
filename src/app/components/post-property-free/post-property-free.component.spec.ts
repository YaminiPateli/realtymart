import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPropertyFreeComponent } from './post-property-free.component';

describe('PostPropertyFreeComponent', () => {
  let component: PostPropertyFreeComponent;
  let fixture: ComponentFixture<PostPropertyFreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostPropertyFreeComponent]
    });
    fixture = TestBed.createComponent(PostPropertyFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


$(document).ready(function () {
  $(".property_type_list li").click(function () {
    $(".property_type_list li").removeClass("active");
    // $(".tab").addClass("active"); // instead of this do the below 
    $(this).addClass("active");
  });
});



// select post property count active 

