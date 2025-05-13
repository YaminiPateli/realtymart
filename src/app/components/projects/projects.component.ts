import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  slideConfig2 = {
    "slidesToShow": 4,
    "slidesToScroll": 3,
    "dots": true,
    "arrows": false,
    "infinite": true,
    "autoplay":true,
    "responsive": [
      {
        breakpoint: 1365,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        'breakpoint': 480,
        'settings': {
          'slidesToShow': 1,
          'slidesToScroll': 1
        }
      }
    ]
  };


  //-------------------------------//
  // Top Feature Slider //
  //-------------------------------//

  slideConfig1 = {
    "slidesToShow": 3,
    "slidesToScroll": 3,
    "dots": true,
    "arrows": false,
    "infinite": true,
    "autoplay": true,
    "responsive": [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        'breakpoint': 480,
        'settings': {
          'slidesToShow': 1,
          'slidesToScroll': 1
        }
      }
    ]
  };

}
