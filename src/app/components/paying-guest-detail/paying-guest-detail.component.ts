import { Component } from '@angular/core';
import { PgDetailsService } from '../service/pg-details.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Fancybox } from '@fancyapps/ui';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-paying-guest-detail',
  templateUrl: './paying-guest-detail.component.html',
  styleUrls: ['./paying-guest-detail.component.css']
})
export class PayingGuestDetailComponent {
  pgdetailsData:any;
  pgdetails: any;

  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: []
  }
  slideConfig2 = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    prevArrow:
        "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
      nextArrow:
        "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [

    ],
  };

  constructor(
      private titleService: Title,
      private metaService: Meta,
    public http: HttpClient,
    private pgdetailsservice: PgDetailsService,
    private route: ActivatedRoute,
  ) {
    const type = this.route.snapshot.paramMap.get('type');
    const cityName = this.route.snapshot.paramMap.get('city');
  }

  ngOnInit(): void {
    const city = localStorage.getItem('location');
    this.loadPgListingDetails();
  }

  loadPgListingDetails(): void {
    const name = this.route.snapshot.paramMap.get('name');
    const idString = this.route.snapshot.paramMap.get('id');
    const id = Number(idString); // Convert the id to a number

    if (name && !isNaN(id)) {
        this.pgdetailsservice.getpglisting(name, id).subscribe(
            (response: any) => {
                this.pgdetailsData = response;
                this.pgdetails = this.pgdetailsData?.data;
                this.setMetaTags(
                  response.meta?.title,
                  response.meta?.description,
                );
            },
            (error: any) => {
                console.error('Error fetching all builders:', error);
            }
        );
    }
}

// meta title
  setMetaTags(title: string, description: string) {
    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    // this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    // this.metaService.updateTag({ name: 'twitter:image', content: image });
  }

   // fancybox for images
      
   ngAfterViewInit(): void {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // Custom options if needed
    });
  }
    checkDescriptionHeight() {
      throw new Error('Method not implemented.');
    }

}
