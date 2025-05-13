import { Component } from '@angular/core';
import { PgListingService } from '../service/pg-listing.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-paying-guest-for',
  templateUrl: './paying-guest-for.component.html',
  styleUrls: ['./paying-guest-for.component.css']
})
export class PayingGuestForComponent {
  pglistingData:any;
  pglisting: any;

  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: []
  }

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private pglistingservice: PgListingService,
    private route: ActivatedRoute,
  ) {
    const type = this.route.snapshot.paramMap.get('type');
    const cityName = this.route.snapshot.paramMap.get('city');
  }

  ngOnInit(): void {
    const city = localStorage.getItem('location');
    this.loadPgListing();
  }

  loadPgListing(): void {
    const type = this.route.snapshot.paramMap.get('type');
    const cityName = this.route.snapshot.paramMap.get('city');
  
    if (type && cityName) {
      this.pglistingservice.getpglisting(type, cityName).subscribe(
        (response: any) => {
          this.pglistingData = response;
          this.pglisting = this.pglistingData?.data;
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
}
