import { Component } from '@angular/core';

@Component({
  selector: 'app-title-check',
  templateUrl: './title-check.component.html',
  styleUrls: ['./title-check.component.css']
})
export class TitleCheckComponent {
// TOP SLIDER 
slideConfig1 = {
  slidesToShow: 2,
  slidesToScroll: 2,
  dots: true,
  arrows: false,
  infinite: true,
  "autoplay": true,
  responsive: [
    {
      breakpoint: 1365,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

}
