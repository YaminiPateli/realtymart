import { Component, HostListener, OnInit } from '@angular/core';
import { CompanyPropertyServiceService } from '../../components/service/company-property-service.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {NgFor, NgForOf , CommonModule} from "@angular/common";
import { Fancybox } from "@fancyapps/ui";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeolocationService } from '../service/geolocation.service';

declare const google: any;

@Component({
  selector: 'app-services-detail',
  templateUrl: './services-detail.component.html',
  styleUrls: ['./services-detail.component.css'],
  standalone: true,
  imports: [NgbRatingModule,CommonModule,
    SlickCarouselModule,],
})
export class ServicesDetailComponent implements OnInit {
  tooltipVisible = false;
  tooltipPosition = { top: '0px', left: '0px' };
  [x: string]: any;
  currentRate:any;
  singlecompany: any = {};
  urlSegments:any;
  fullPath:any;
  activeSection: string | undefined ='about';
  // google reviews
  placeName: string = '';
  errorMessage: string | null = null;
  reviews: any[] | null = null;
  placeDetails: any = null;
  googleReviews: any;
  dayNames: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  private apiKey = 'AIzaSyD-iX9GMP2C8Tsz4hOM3qksvMHyzLSXLxA';
  private textSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  private placeDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
  private apiUrl: string = environment.apiUrl;
  url: any;
  city: any;
  placesName: any;
  dynamicUrl: any;
   serviceName = this.route.snapshot.paramMap.get('name');
   serviceId = this.route.snapshot.paramMap.get('id');

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private singleCompanyService: CompanyPropertyServiceService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private http:HttpClient,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
      // this.singleCompanyService.initializeLocation().then(() => {
      //   this.fetchCompanyServiceListing();
      // }).catch((error: any) => {
      //   console.warn('Location not set, calling without place name');
      //   this.fetchCompanyServiceListing();
      // });
        this.fetchCompanyServiceListing();
    this.loadGoogleMapsScript();
    // share on whatsapp code by jeet thaker on 18-12-24 START
    this.activatedRoute.url.subscribe((segments) => {
      this.urlSegments = segments.map((segment) => segment.path);
      this.fullPath = `${this.apiUrl}/${this.urlSegments.join('/')}`;
    });
    // share on whatsapp code by jeet thaker on 18-12-24 END
  }

  getSanitizedHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private loadGoogleMapsScript(): void {
    if (typeof google === 'undefined' || !google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCSTCnateoFfNtpPRtURlnEroMPDL0Bxs8`;
      script.async = false;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
      };

      script.onerror = () => {
        this.errorMessage = 'Error loading Google Maps API.';
      };
    }
  }

  getUrl(urlPart1:any, urlPart2:any){
    this.url = window.location.origin;
    const staticpart = '/company-detail/';
    this.dynamicUrl = this.url + staticpart + this.serviceName + '/' + this.serviceId;
  }

  whatsappShare() {
    const link = `https://wa.me/?text=${encodeURIComponent(this.dynamicUrl)}`;
    window.open(link, '_blank');
  }

  copyLink(event: MouseEvent) {
    navigator.clipboard.writeText(this.dynamicUrl).then(() =>
      {
      this.showTooltip(event);
    }, (err) => {
      console.log('failed copy')
    });
  }

  showTooltip(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    this.tooltipPosition = {
      top: `${buttonRect.top - 50}px`,
      left: `${buttonRect.left + 60}px`,

    };

    this.tooltipVisible = true;

    setTimeout(() => {
      this.tooltipVisible = false;
    }, 1500);
  }


  fetchCompanyServiceListing() {
    const serviceName = this.route.snapshot.paramMap.get('name');
    const serviceId = this.route.snapshot.paramMap.get('id');

    if (serviceName && serviceId) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const lat = latitude;
            const lng = longitude;
            const city = localStorage.getItem('location');

            this.singleCompanyService.getCompanyServiceListing(serviceName, serviceId, lat, lng, city).subscribe(
              (response: any) => {
                this.singlecompany = response.data;
                this.setMetaTags(this.singlecompany.meta_title, this.singlecompany.meta_description, this.singlecompany.company_logo);
                this.queryPlaceByName(this.singlecompany.company_name);
              },
              (error: any) => {
                console.error('Error fetching company service listing:', error);
              }
            );
          },
          (error) => {
            console.error('Geolocation error:', error);
            // fallback without location
          }
        );
      } else {
        // fallback if geolocation is not supported
      }
    }
  }

  // Set the title and meta description
  setMetaTags(title: string, description: string, image: string): void {
    this.titleService.setTitle(title || '');
    this.metaService.updateTag({ name: 'description', content: description || 'Default description' });

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:title', content: image });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
  }

  selectedImages: FileWithPreview[] = [];
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as FileWithPreview;
      this.selectedImages.push(file);
      this.previewImage(file);
    }
  }

  previewImage(file: FileWithPreview): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      file.preview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }
  ngAfterViewInit() {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // Custom options if needed
    });
  }


  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
  };

  // gallery slider

  slideConfig2 = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 1199,  // Max width 1024px
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 2,
        }
      },
    ],
  };

  slideConfig3 = {
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 768,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };

  slideConfig4 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
  };

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    const navbar = document.getElementById('navbar');

    if (section && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
      const scrollMargin = 130;
      const scrollToPosition = sectionPosition - navbarHeight - scrollMargin;
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
      this.activeSection = sectionId;
    }
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const navbar = document.getElementById("navbar");
    const sticky = navbar?.offsetTop;

    if (window.pageYOffset > sticky!) {
      navbar?.classList.add("sticky");
    } else {
      navbar?.classList.remove("sticky");
    }
  }

  // share on whatsapp code by jeet thaker on 18-12-24 START
  shareonWhatsapp(){
    const whatsappMessage = `https://api.whatsapp.com/send?text=${encodeURIComponent('Check out my amazing concept: My Amazing Website! '+this.fullPath)}`;
    window.open(whatsappMessage, '_blank');
  }
  // share on whatsapp code by jeet thaker on 18-12-24 END


 // google reviews
 queryPlaceByName(placeName: string): void {
  const service = new google.maps.places.PlacesService(document.createElement('div'));

  const request = {
    query: placeName,
    fields: ['place_id', 'name'],
  };

  service.textSearch(request, (results: any, status: any) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      const placeId = results[0].place_id;
      this.fetchPlaceDetails(placeId);
    } else {
      this.errorMessage = 'Error: Place not found.';
    }
  });
}

getToday(): string {
  const today = new Date().getDay(); // Sunday = 0, Saturday = 6
  return today === 0 ? '7' : today.toString(); // Convert Sunday (0) to '7'
}

// Check if the day matches today
isToday(day: string): boolean {
  return day === this.getToday();
}

// Convert day number to day name
getDayName(day: string): string {
  return this.dayNames[parseInt(day, 10) - 1] || 'UNKNOWN';
}

// Reorder business hours to start with today
reorderBusinessHours() {
  const today = this.getToday();
  const todayIndex = parseInt(today, 10) - 1;

  const sortedHours = [
    ...this.singlecompany?.bussiness_hours?.slice(todayIndex),
    ...this.singlecompany?.bussiness_hours?.slice(0, todayIndex),
  ];

  return sortedHours;
}

  fetchPlaceDetails(placeId: string): void {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      placeId: placeId,
      fields: ['name', 'rating', 'reviews'],
    };

    service.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.googleReviews = place;
        this.errorMessage = null;
        this.reviews = place.reviews || [];

        this.placeDetails = {
          name: place.name,
          rating: place.rating,
          profile_photo_url: place.profile_photo_url,
        };
      } else {
        this.errorMessage = `Error retrieving place details: ${status}`;
      }
    });
  }
}

interface FileWithPreview extends File {
  preview: string;
}
