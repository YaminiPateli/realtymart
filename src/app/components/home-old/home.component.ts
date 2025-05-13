import {
  AfterViewInit,
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopbuildersService } from '../service/topbuilders.service';
import { HotdealsserviceService } from '../service/hotdealsservice.service';
import { FeaturedcommercialService } from '../service/featuredcommercial.service';
import { FeaturedresidentalService } from '../service/featuredresidental.service';
import { FeaturedbunlowsvillasService } from '../service/featuredbunlowsvillas.service';
import { FeaturedplotsService } from '../service/featuredplots.service';
import { FarmhouseService } from '../service/farmhouse.service';
import { PropertytyperesidentialService } from '../service/propertytyperesidential.service';
import { PropertytypecommercialService } from '../service/propertytypecommercial.service';
import { PropertytypeothertypesService } from '../service/propertytypeothertypes.service';
import { PropertytypepgService } from '../service/propertytypepg.service';
import { PropertytypehostelService } from '../service/propertytypehostel.service';
import { HomepagebannerService } from '../service/homepagebanner.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeolocationService } from '../service/geolocation.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';

interface ErrorMessages {
  [key: string]: { type: string; message: string }[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    RouterModule,
    NgIf,
    NgFor,
  ],
})
export class HomeComponent implements AfterViewInit, OnInit {
  selectedResidentialItems: number[] = [];
  selectedCommercialItems: number[] = [];
  topbuilderData: any;
  topbuilders: any;
  hotdealData: any;
  hotdeals: any;
  featureCommercialData: any;
  featuredcommercials: any;
  featureResidentalData: any;
  featuredResidentals: any;
  featureBunglowsData: any;
  featuredBunglowss: any;
  featurePlotsData: any;
  featurePlotss: any;
  featurefarmhouse: any;
  featureFarmData: any;
  selectedCars: any;
  latitude: any;
  longitude: any;
  myForm: FormGroup;
  propertyresidentialData: any;
  propertyresidential: any;
  propertycommercialData: any;
  propertycommercial: any;
  propertyotherData: any;
  propertyother: any;
  propertypgData: any;
  propertypg: any;
  propertyhostelData: any;
  propertyhostel: any;
  bannerData: any;
  bannerbuilder: any;
  //  selectedCommercialItems: string[] = [];
  selectedOtherItems: number[] = [];
  errorMessages: ErrorMessages;
  searchError: boolean = false;
  budgetMinInput: any;
  cookie_location = ''; // Make it public
  all_cookies: any = ''; // Make it public
  locationCookie: any;
  activeTab: string = 'buy';
  city: any;
  validCities: string[] = [
    'Ahmedabad',
    'Rajkot',
    'Surat',
    'Vadodara',
    'Mumbai',
    'Navi Mumbai',
    'Pune',
    'Bangalore',
    'NCR',
    'Delhi',
    'Gurgaon',
    'Hyderabad',
  ];

  constructor(
    public http: HttpClient,
    private topbuildersService: TopbuildersService,
    private hotdealsService: HotdealsserviceService,
    private featurecommercialService: FeaturedcommercialService,
    private featureresidentalService: FeaturedresidentalService,
    private featurebunglowsService: FeaturedbunlowsvillasService,
    private featureplotsService: FeaturedplotsService,
    private farmHouseProjects: FarmhouseService,
    private propertyresidentialservice: PropertytyperesidentialService,
    private propertycommercialservice: PropertytypecommercialService,
    private propertyotherservice: PropertytypeothertypesService,
    private propertypgservice: PropertytypepgService,
    private propertyhostelservice: PropertytypehostelService,
    private bannerservice: HomepagebannerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private el: ElementRef,
    private geolocationService: GeolocationService
  ) {
    this.getLocation();
    this.loadHotDeals();
    this.loadFeaturedResidentalProjects();
    this.loadFeaturedCommercialProjects();
    this.loadFeaturedBunglowsProjects();
    this.loadFarmHouseProjects();
    this.loadFeaturedPlotsProjects();
    this.loadTopBuilders();
    this.loadHomeBanner();
    this.loadpropertyresidential();
    this.loadpropertycommercial();
    this.loadPropertyOther();
    this.loadPropertyPg();
    this.loadPropertyHostel();
    this.myForm = new FormGroup({
      selectcitysearch: new FormControl(''),
      propertytype: new FormControl(''),
      searchtype: new FormControl(''),
    });
    this.myForm = this.fb.group({
      selectcitysearch: ['', Validators.required],
      searchtype: [''],
    });

    // Initialize error messages
    this.errorMessages = {
      selectcitysearch: [{ type: 'required', message: 'City is required.' }],
    };
  }
  handleTabClick(tabName: string): void {
    this.activeTab = tabName;
  }
  ngOnInit() {
    this.locationCookie = localStorage.getItem('location');
  }

  ngAfterViewInit() {
    this.loadHomeBanner();
  }


  getLocation() {
    const locationCookie = localStorage.getItem('location');
    this.city = locationCookie;

    if (!locationCookie) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.geolocationService
              .getCity(latitude, longitude)
              .then((city: string) => {
                if (this.isValidCity(city)) {
                  this.updateCity(city);
                } else {
                  this.updateCity('Ahmedabad');
                }
              })
              .catch((error: any) => {
                console.error('Error getting city from coordinates:', error);
                this.updateCity('Ahmedabad');
              });
          },
          (error) => {
            console.error('Error getting location', error);
            this.updateCity('Ahmedabad');
          }
        );
      } else {
        console.error('Geolocation not supported by this browser.');
        this.updateCity('Ahmedabad');
      }
    }
  }

  isValidCity(city: string): boolean {
    return this.validCities.includes(city);
  }

  updateCity(city: string) {
    this.city = city;
    localStorage.setItem('location', city);
  }

  loadHomeBanner(): void {
    this.bannerservice.homepagebannerget()?.subscribe((bannerData: any) => {
      this.bannerData = bannerData;
      this.bannerbuilder = this.bannerData?.data;
    });
  }

  loadHotDeals() {
    const locationCookie = localStorage.getItem('location');

    if (!locationCookie) {
      this.hotdealsService.hotdealget('Ahmedabad')?.subscribe((hotdealData) => {
        this.hotdealData = hotdealData;
        this.hotdeals = this.hotdealData?.data;
      });
    } else {
      this.hotdealsService
        .hotdealget(locationCookie)
        ?.subscribe((hotdealData) => {
          this.hotdealData = hotdealData;
          this.hotdeals = this.hotdealData?.data;
        });
    }
  }

  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  loadFeaturedResidentalProjects() {
    const locationCookie = localStorage.getItem('location');

    if (!locationCookie) {
      this.featureresidentalService
        .futureresidentalget('Ahmedabad')
        ?.subscribe((featureResidentalData: any) => {
          this.featureResidentalData = featureResidentalData;
          this.featuredResidentals =
            this.featureResidentalData?.data;
        });
    } else {
      this.featureresidentalService
        .futureresidentalget(locationCookie)
        ?.subscribe((featureResidentalData: any) => {
          this.featureResidentalData = featureResidentalData;
          this.featuredResidentals =
            this.featureResidentalData?.data;
        });
    }
  }

  loadFeaturedCommercialProjects() {
    const locationCookie = localStorage.getItem('location');

    if (!locationCookie) {
      this.featurecommercialService
        .featurecommercialget('Ahmedabad')
        ?.subscribe((featuredcommercialData: any) => {
          this.featureCommercialData = featuredcommercialData;
          this.featuredcommercials =
            this.featureCommercialData?.data;
        });
    } else {
      this.featurecommercialService
        .featurecommercialget(locationCookie)
        ?.subscribe((featuredcommercialData: any) => {
          this.featureCommercialData = featuredcommercialData;
          this.featuredcommercials =
            this.featureCommercialData?.data;
        });
    }
  }

  loadFeaturedBunglowsProjects() {
    const locationCookie = localStorage.getItem('location');
    const city = locationCookie;

    if (!locationCookie) {
      this.featurebunglowsService
        .featurebunglowsvillasget('Ahmedabad')
        ?.subscribe((featureBunglowsData: any) => {
          this.featureBunglowsData = featureBunglowsData;
          this.featuredBunglowss =
            this.featureBunglowsData?.data;
        });
    } else {
      this.featurebunglowsService
        .featurebunglowsvillasget(locationCookie)
        ?.subscribe((featureBunglowsData: any) => {
          this.featureBunglowsData = featureBunglowsData;
          this.featuredBunglowss =
            this.featureBunglowsData?.data;
        });
    }
  }

  loadFarmHouseProjects() {
    const locationCookie = localStorage.getItem('location');

    if (!locationCookie) {
      this.farmHouseProjects
        .featurefarmhouseget('Ahmedabad')
        ?.subscribe((featureFarmData: any) => {
          this.featureFarmData = featureFarmData;
          this.featurefarmhouse =
            this.featureFarmData?.data;

        });
    } else {
      this.farmHouseProjects
        .featurefarmhouseget(locationCookie)
        ?.subscribe((featureFarmData: any) => {
          this.featureFarmData = featureFarmData;
          this.featurefarmhouse =
            this.featureFarmData?.data;
        });
    }
  }

  loadFeaturedPlotsProjects() {
    const locationCookie = localStorage.getItem('location');

    if (!locationCookie) {
      this.featureplotsService
        .featuredplotsget('Ahmedabad')
        ?.subscribe((featurePlotsData: any) => {
          this.featurePlotsData = featurePlotsData;
          this.featurePlotss =
            this.featurePlotsData?.data;
        });
    } else {
      this.featureplotsService
        .featuredplotsget(locationCookie)
        ?.subscribe((featurePlotsData: any) => {
          this.featurePlotsData = featurePlotsData;
          this.featurePlotss =
            this.featurePlotsData?.data;
        });
    }
  }

  loadTopBuilders() {
    const locationCookie = localStorage.getItem('location');

    if (!locationCookie) {
      this.topbuildersService.topbuilderget('Ahmedabad')?.subscribe((data) => {
        this.topbuilderData = data;
        this.topbuilders = this.topbuilderData?.responseData;
      });
    } else {
      this.topbuildersService
        .topbuilderget(locationCookie)
        ?.subscribe((data) => {
          this.topbuilderData = data;
          this.topbuilders = this.topbuilderData?.responseData;
        });
    }
  }

  loadpropertyresidential(): void {
    this.propertyresidentialservice
      .getpropertytyperesidential()
      ?.subscribe((propertyresidentialData: any) => {
        this.propertyresidentialData = propertyresidentialData;
        this.propertyresidential =
          this.propertyresidentialData?.responseData?.propertytyperesidential;
      });
  }
  loadpropertycommercial(): void {
    this.propertycommercialservice
      .getpropertytypecommercial()
      ?.subscribe((propertycommercialData: any) => {
        this.propertycommercialData = propertycommercialData;
        this.propertycommercial =
          this.propertycommercialData?.responseData?.propertytypecommercial;
      });
  }
  loadPropertyOther(): void {
    this.propertyotherservice
      .getpropertytypeother()
      ?.subscribe((propertyotherData: any) => {
        this.propertyotherData = propertyotherData;
        this.propertyother =
          this.propertyotherData?.responseData?.propertytypeothertypes;
      });
  }
  loadPropertyPg(): void {
    this.propertypgservice
      .getpropertytypepg()
      ?.subscribe((propertypgData: any) => {
        this.propertypgData = propertypgData;
        this.propertypg = this.propertypgData?.responseData?.propertytypepg;
      });
  }
  loadPropertyHostel(): void {
    this.propertyhostelservice
      .getpropertytypehostel()
      ?.subscribe((propertyhostelData: any) => {
        this.propertyhostelData = propertyhostelData;
        this.propertyhostel =
          this.propertyhostelData?.responseData?.propertytypehostel;
      });
  }
  visible: boolean = false;
  Residencialvisible: boolean = false;
  Commercialvisible: boolean = false;
  otherproperytypes: boolean = false;
  budget: boolean = false;
  togglebudget: boolean = false;
  gender: boolean = false;
  Lookingfor: boolean = false;
  minBudget: string = '';
  maxBudget: string = '';
  searchcityname: any;
  type: any;

  toggleDisplayDiv() {
    this.visible = !this.visible;
  }

  renttoggleDisplayDiv() {
    this.visible = !this.visible;
  }

  farmhousetoggleDisplayDiv() {
    this.visible = !this.visible;
  }

  plotstoggleDisplayDiv() {
    this.visible = !this.visible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    // Check if the clicked element is inside the toggle area or the visible div
    if (
      !clickedElement.closest('.property_wrapper') &&
      !clickedElement.closest('.property_inner')
    ) {
      this.visible = false;
    }
  }

  residencial() {
    this.Residencialvisible = !this.Residencialvisible;
  }
  commercial() {
    this.Commercialvisible = !this.Commercialvisible;
  }
  OtherPropertyTypes() {
    this.otherproperytypes = !this.otherproperytypes;
  }
  Budget() {
    this.budget = !this.budget;
  }
  toggleBudget() {
    this.togglebudget = !this.togglebudget;
  }
  Gender() {
    this.gender = !this.gender;
  }
  LookingFor() {
    this.Lookingfor = !this.Lookingfor;
  }

  city1 = [
    { cid: 0, cname: 'Ahmedabad' },
    { cid: 1, cname: 'Rajkot' },
    { cid: 2, cname: 'Surat' },
    { cid: 3, cname: 'Vadodara' },
    // { id: 4, name: 'Pune' },
    // { id: 5, name: 'Mumbai' },
    // { id: 6, name: 'Navi Mumbai' },
    // { id: 7, name: 'Banglore' },
    // { id: 8, name: 'NCR' },
    // { id: 9, name: 'Delhi' },
    // { id: 10, name: 'Gurgaon' },
    // { id: 11, name: 'Hydrabad' },
  ];

  cars = [
    { id: 0, name: 'Ahmedabad' },
    { id: 1, name: 'Rajkot' },
    { id: 2, name: 'Surat' },
    { id: 3, name: 'Vadodara' },
    // { id: 4, name: 'Pune' },
    // { id: 5, name: 'Mumbai' },
    // { id: 6, name: 'Navi Mumbai' },
    // { id: 7, name: 'Banglore' },
    // { id: 8, name: 'NCR' },
    // { id: 9, name: 'Delhi' },
    // { id: 10, name: 'Gurgaon' },
    // { id: 11, name: 'Hydrabad' },
  ];

  // ngOnInit() {}

  toggleDisabled() {
    const car: any = this.city[11];
    car.disabled = !car.disabled;
  }
  //-------------------------------//
  // Hot Deals Slider //
  //-------------------------------//
  slideConfig2 = {
    slidesToShow: 4,
    slidesToScroll: 3,
    dots: true,
    arrows: false,
    infinite: true,
    // "autoplay":true,
    responsive: [
      {
        breakpoint: 1535,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };
  //-------------------------------//
  //Featured Projects Slider //
  //-------------------------------//
  slideConfig1 = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  slideConfig3 = {
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 1,
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
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
  //-------------------------------//
  //top proparty Slider //
  //-------------------------------//
  slideConfig4 = {
    slidesToShow: 7,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1365,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  //-------------------------------//
  //top Builders Slider //
  //-------------------------------//
  slideConfig5 = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

  onSubmit() {
    if (this.myForm.valid) {
      const searchData = {
        // location: this.myForm.controls['selectcitysearch'].value[0],
        minPrice: this.minBudget,
        maxPrice: this.maxBudget,
        ResidentialItems: this.selectedResidentialItems,
        CommercialItems: this.selectedCommercialItems,
        OtherItems: this.selectedOtherItems,
        propertyfor: this.activeTab,
      };

      this.http
        .post(`${environment.apiUrl}searchproperty`, searchData)
        .subscribe(
          (response: any) => {
            const dataToSend = { result: response };
            this.router.navigate(['search-property'], { state: response });
          },
          (error: any) => {
            console.error('API Error:', error);
          }
        );
    } else {
      // Show the error message here
      this.searchError = true;

      // Optionally, you can loop through the form controls and mark them as touched to trigger validation messages
      Object.values(this.myForm.controls).forEach((control) => {
        control.markAsTouched();
      });

      // Reset searchError to false after 5 seconds
      setTimeout(() => {
        this.searchError = false;
      }, 15000); // 5000 milliseconds (5 seconds)
    }
  }

  handleResidentialCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedResidentialItems.push(id);
    } else {
      this.selectedResidentialItems = this.selectedResidentialItems.filter(
        (item) => item !== id
      );
    }
    this.changeLabel();
  }

  rentCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedResidentialItems.push(id);
    } else {
      this.selectedResidentialItems = this.selectedResidentialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.rentchangeLabel();
  }

  farmhouseCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedResidentialItems.push(id);
    } else {
      this.selectedResidentialItems = this.selectedResidentialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.farmhousechangeLabel();
  }

  plotsCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedResidentialItems.push(id);
    } else {
      this.selectedResidentialItems = this.selectedResidentialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.plotschangeLabel();
  }

  // pgCheckboxChange(event: any, id: number,type:any) {
  //   if (event.target.checked) {
  //     this.selectedResidentialItems.push(id);
  //   } else {
  //     this.selectedResidentialItems = this.selectedResidentialItems.filter(
  //       (item) => item !== id
  //     );
  //   }
  //   this.type = type;
  //   this.pgchangeLabel();
  // }

  changeLabel() {
    const label = document.querySelector('.property_tabs');

    if (label) {
      let labelText = '';

      const has1 = this.selectedResidentialItems.includes(1);
      const has3 = this.selectedResidentialItems.includes(3);
      const has9 = this.selectedResidentialItems.includes(9);
      const has8 = this.selectedCommercialItems.includes(8);
      const has16 = this.selectedCommercialItems.includes(16);
      const has17 = this.selectedCommercialItems.includes(17);
      const has18 = this.selectedCommercialItems.includes(18);
      const has4 = this.selectedOtherItems.includes(4);
      const has5 = this.selectedOtherItems.includes(5);

      if (has1 && has3 && has9 && has8 && has16) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has4 && has5) {
        labelText = 'Flat + 4';
      } else if (has9 && has1 && has3 && has8) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has16) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has17) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has18) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has4) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has5) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has8) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has16) {
        labelText = 'Flat + 3';
      } else if (has8 && has16 && has17 && has18) {
        labelText = 'Office Space + 3';
      } else if (has16 && has17 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has17 && has18) {
        labelText = 'Office Space + 2';
      } else if (has8 && has16 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has16 && has17) {
        labelText = 'Office Space + 2';
      } else if (has1 && has3 && has9 && !has8) {
        labelText = 'Flat + 2';
      } else if (has8 && has4 && has5) {
        labelText = 'Office Space + 2';
      } else if (has16 && has4 && has5) {
        labelText = 'Shop/Showroom + 2';
      } else if (has17 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has18 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has1 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has9 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has1 && has4) {
        labelText = 'Farm House + 1';
      } else if (has3 && has4) {
        labelText = 'Farm House + 1';
      } else if (has9 && has4) {
        labelText = 'Farm House + 1';
      } else if (has1 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has9 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has1 && has18) {
        labelText = 'Flat + 1';
      } else if (has3 && has16) {
        labelText = 'Shop/Showroom + 1';
      } else if (has3 && has18) {
        labelText = 'Villa + 1';
      } else if (has9 && has16) {
        labelText = 'Plot + 1';
      } else if (has9 && has18) {
        labelText = 'Plot + 1';
      } else if (has16 && has4) {
        labelText = 'Shop/Showroom + 1';
      } else if (has16 && has5) {
        labelText = 'Shop/Showroom + 1';
      } else if (has17 && has4) {
        labelText = 'Farm House + 1';
      } else if (has17 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has18 && has4) {
        labelText = 'Farm House + 1';
      } else if (has18 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has1 && !has9) {
        labelText = 'Villa + 1';
      } else if (has3 && !has1 && has9) {
        labelText = 'Villa + 1';
      } else if (has9 && has1 && !has3) {
        labelText = 'Plot + 1';
      } else if (has9 && !has1 && has3) {
        labelText = 'Plot + 1';
      } else if (has1 && has9 && !has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has9 && has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && !has8 && has16) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has8) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has17) {
        labelText = 'Flat + 1';
      } else if (has3 && !has9 && has17) {
        labelText = 'Villa + 1';
      } else if (has9 && has17) {
        labelText = 'Plot + 1';
      } else if (has8 && has17) {
        labelText = 'Office Space + 1';
      } else if (has16 && has17) {
        labelText = 'Shop/Showroom + 1';
      } else if (has8 && has16) {
        labelText = 'Office Space + 1';
      } else if (has17 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has16 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has8 && has18) {
        labelText = 'Office Space + 1';
      } else if (has8 && has1) {
        labelText = 'Office Space + 1';
      } else if (has8 && has3) {
        labelText = 'Office Space + 1';
      } else if (has8 && has9) {
        labelText = 'Office Space + 1';
      } else if (has8 && has4) {
        labelText = 'Office Space + 1';
      } else if (has8 && has5) {
        labelText = 'Office Space + 1';
      } else if (has4 && has5) {
        labelText = 'Farm House + 1';
      } else if (has1) {
        labelText = 'Flat';
      } else if (has3) {
        labelText = 'Villa';
      } else if (has9) {
        labelText = 'Plot';
      } else if (has8) {
        labelText = 'Office Space';
      } else if (has16) {
        labelText = 'Shop/Showroom';
      } else if (has17) {
        labelText = 'Commercial Land';
      } else if (has18) {
        labelText = 'Warehouse/Godown';
      } else if (has4) {
        labelText = 'Farm House';
      } else if (has5) {
        labelText = 'Agricultural Land';
      } else {
        labelText = 'Property Type';
      }

      label.textContent = labelText;
    }
  }

  rentchangeLabel() {
    const label = document.querySelector('#property_tabs_' + this.type);

    if (label) {
      let labelText = '';

      const has1 = this.selectedResidentialItems.includes(1);
      const has3 = this.selectedResidentialItems.includes(3);
      const has9 = this.selectedResidentialItems.includes(9);
      const has8 = this.selectedCommercialItems.includes(8);
      const has16 = this.selectedCommercialItems.includes(16);
      const has17 = this.selectedCommercialItems.includes(17);
      const has18 = this.selectedCommercialItems.includes(18);
      const has4 = this.selectedOtherItems.includes(4);
      const has5 = this.selectedOtherItems.includes(5);

      if (has1 && has3 && has9 && has8 && has16) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has4 && has5) {
        labelText = 'Flat + 4';
      } else if (has9 && has1 && has3 && has8) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has16) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has17) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has18) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has4) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has5) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has8) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has16) {
        labelText = 'Flat + 3';
      } else if (has8 && has16 && has17 && has18) {
        labelText = 'Office Space + 3';
      } else if (has16 && has17 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has17 && has18) {
        labelText = 'Office Space + 2';
      } else if (has8 && has16 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has16 && has17) {
        labelText = 'Office Space + 2';
      } else if (has1 && has3 && has9 && !has8) {
        labelText = 'Flat + 2';
      } else if (has8 && has4 && has5) {
        labelText = 'Office Space + 2';
      } else if (has16 && has4 && has5) {
        labelText = 'Shop/Showroom + 2';
      } else if (has17 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has18 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has1 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has9 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has1 && has4) {
        labelText = 'Farm House + 1';
      } else if (has3 && has4) {
        labelText = 'Farm House + 1';
      } else if (has9 && has4) {
        labelText = 'Farm House + 1';
      } else if (has1 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has9 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has1 && has18) {
        labelText = 'Flat + 1';
      } else if (has3 && has16) {
        labelText = 'Shop/Showroom + 1';
      } else if (has3 && has18) {
        labelText = 'Villa + 1';
      } else if (has9 && has16) {
        labelText = 'Plot + 1';
      } else if (has9 && has18) {
        labelText = 'Plot + 1';
      } else if (has16 && has4) {
        labelText = 'Shop/Showroom + 1';
      } else if (has16 && has5) {
        labelText = 'Shop/Showroom + 1';
      } else if (has17 && has4) {
        labelText = 'Farm House + 1';
      } else if (has17 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has18 && has4) {
        labelText = 'Farm House + 1';
      } else if (has18 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has1 && !has9) {
        labelText = 'Villa + 1';
      } else if (has3 && !has1 && has9) {
        labelText = 'Villa + 1';
      } else if (has9 && has1 && !has3) {
        labelText = 'Plot + 1';
      } else if (has9 && !has1 && has3) {
        labelText = 'Plot + 1';
      } else if (has1 && has9 && !has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has9 && has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && !has8 && has16) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has8) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has17) {
        labelText = 'Flat + 1';
      } else if (has3 && !has9 && has17) {
        labelText = 'Villa + 1';
      } else if (has9 && has17) {
        labelText = 'Plot + 1';
      } else if (has8 && has17) {
        labelText = 'Office Space + 1';
      } else if (has16 && has17) {
        labelText = 'Shop/Showroom + 1';
      } else if (has8 && has16) {
        labelText = 'Office Space + 1';
      } else if (has17 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has16 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has8 && has18) {
        labelText = 'Office Space + 1';
      } else if (has8 && has1) {
        labelText = 'Office Space + 1';
      } else if (has8 && has3) {
        labelText = 'Office Space + 1';
      } else if (has8 && has9) {
        labelText = 'Office Space + 1';
      } else if (has8 && has4) {
        labelText = 'Office Space + 1';
      } else if (has8 && has5) {
        labelText = 'Office Space + 1';
      } else if (has4 && has5) {
        labelText = 'Farm House + 1';
      } else if (has1) {
        labelText = 'Flat';
      } else if (has3) {
        labelText = 'Villa';
      } else if (has9) {
        labelText = 'Plot';
      } else if (has8) {
        labelText = 'Office Space';
      } else if (has16) {
        labelText = 'Shop/Showroom';
      } else if (has17) {
        labelText = 'Commercial Land';
      } else if (has18) {
        labelText = 'Warehouse/Godown';
      } else if (has4) {
        labelText = 'Farm House';
      } else if (has5) {
        labelText = 'Agricultural Land';
      } else {
        labelText = 'Property Type';
      }

      label.textContent = labelText;
    }
  }

  farmhousechangeLabel() {
    const label = document.querySelector('#property_tabs_' + this.type);

    if (label) {
      let labelText = '';

      const has1 = this.selectedResidentialItems.includes(1);
      const has3 = this.selectedResidentialItems.includes(3);
      const has9 = this.selectedResidentialItems.includes(9);
      const has8 = this.selectedCommercialItems.includes(8);
      const has16 = this.selectedCommercialItems.includes(16);
      const has17 = this.selectedCommercialItems.includes(17);
      const has18 = this.selectedCommercialItems.includes(18);
      const has4 = this.selectedOtherItems.includes(4);
      const has5 = this.selectedOtherItems.includes(5);

      if (has1 && has3 && has9 && has8 && has16) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has4 && has5) {
        labelText = 'Flat + 4';
      } else if (has9 && has1 && has3 && has8) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has16) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has17) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has18) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has4) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has5) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has8) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has16) {
        labelText = 'Flat + 3';
      } else if (has8 && has16 && has17 && has18) {
        labelText = 'Office Space + 3';
      } else if (has16 && has17 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has17 && has18) {
        labelText = 'Office Space + 2';
      } else if (has8 && has16 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has16 && has17) {
        labelText = 'Office Space + 2';
      } else if (has1 && has3 && has9 && !has8) {
        labelText = 'Flat + 2';
      } else if (has8 && has4 && has5) {
        labelText = 'Office Space + 2';
      } else if (has16 && has4 && has5) {
        labelText = 'Shop/Showroom + 2';
      } else if (has17 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has18 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has1 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has9 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has1 && has4) {
        labelText = 'Farm House + 1';
      } else if (has3 && has4) {
        labelText = 'Farm House + 1';
      } else if (has9 && has4) {
        labelText = 'Farm House + 1';
      } else if (has1 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has9 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has1 && has18) {
        labelText = 'Flat + 1';
      } else if (has3 && has16) {
        labelText = 'Shop/Showroom + 1';
      } else if (has3 && has18) {
        labelText = 'Villa + 1';
      } else if (has9 && has16) {
        labelText = 'Plot + 1';
      } else if (has9 && has18) {
        labelText = 'Plot + 1';
      } else if (has16 && has4) {
        labelText = 'Shop/Showroom + 1';
      } else if (has16 && has5) {
        labelText = 'Shop/Showroom + 1';
      } else if (has17 && has4) {
        labelText = 'Farm House + 1';
      } else if (has17 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has18 && has4) {
        labelText = 'Farm House + 1';
      } else if (has18 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has1 && !has9) {
        labelText = 'Villa + 1';
      } else if (has3 && !has1 && has9) {
        labelText = 'Villa + 1';
      } else if (has9 && has1 && !has3) {
        labelText = 'Plot + 1';
      } else if (has9 && !has1 && has3) {
        labelText = 'Plot + 1';
      } else if (has1 && has9 && !has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has9 && has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && !has8 && has16) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has8) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has17) {
        labelText = 'Flat + 1';
      } else if (has3 && !has9 && has17) {
        labelText = 'Villa + 1';
      } else if (has9 && has17) {
        labelText = 'Plot + 1';
      } else if (has8 && has17) {
        labelText = 'Office Space + 1';
      } else if (has16 && has17) {
        labelText = 'Shop/Showroom + 1';
      } else if (has8 && has16) {
        labelText = 'Office Space + 1';
      } else if (has17 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has16 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has8 && has18) {
        labelText = 'Office Space + 1';
      } else if (has8 && has1) {
        labelText = 'Office Space + 1';
      } else if (has8 && has3) {
        labelText = 'Office Space + 1';
      } else if (has8 && has9) {
        labelText = 'Office Space + 1';
      } else if (has8 && has4) {
        labelText = 'Office Space + 1';
      } else if (has8 && has5) {
        labelText = 'Office Space + 1';
      } else if (has4 && has5) {
        labelText = 'Farm House + 1';
      } else if (has1) {
        labelText = 'Flat';
      } else if (has3) {
        labelText = 'Villa';
      } else if (has9) {
        labelText = 'Plot';
      } else if (has8) {
        labelText = 'Office Space';
      } else if (has16) {
        labelText = 'Shop/Showroom';
      } else if (has17) {
        labelText = 'Commercial Land';
      } else if (has18) {
        labelText = 'Warehouse/Godown';
      } else if (has4) {
        labelText = 'Farm House';
      } else if (has5) {
        labelText = 'Agricultural Land';
      } else {
        labelText = 'Property Type';
      }

      label.textContent = labelText;
    }
  }

  plotschangeLabel() {
    const label = document.querySelector('#property_tabs_' + this.type);

    if (label) {
      let labelText = '';

      const has1 = this.selectedResidentialItems.includes(1);
      const has3 = this.selectedResidentialItems.includes(3);
      const has9 = this.selectedResidentialItems.includes(9);
      const has8 = this.selectedCommercialItems.includes(8);
      const has16 = this.selectedCommercialItems.includes(16);
      const has17 = this.selectedCommercialItems.includes(17);
      const has18 = this.selectedCommercialItems.includes(18);
      const has4 = this.selectedOtherItems.includes(4);
      const has5 = this.selectedOtherItems.includes(5);

      if (has1 && has3 && has9 && has8 && has16) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has8 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has17) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has16 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has18) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has17 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has4) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has18 && has5) {
        labelText = 'Flat + 4';
      } else if (has1 && has3 && has9 && has4 && has5) {
        labelText = 'Flat + 4';
      } else if (has9 && has1 && has3 && has8) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has16) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has17) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has18) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has4) {
        labelText = 'Flat + 3';
      } else if (has9 && has1 && has3 && has5) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has8) {
        labelText = 'Flat + 3';
      } else if (has1 && has3 && has9 && has16) {
        labelText = 'Flat + 3';
      } else if (has8 && has16 && has17 && has18) {
        labelText = 'Office Space + 3';
      } else if (has16 && has17 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has17 && has18) {
        labelText = 'Office Space + 2';
      } else if (has8 && has16 && has18) {
        labelText = 'Shop/Showroom + 2';
      } else if (has8 && has16 && has17) {
        labelText = 'Office Space + 2';
      } else if (has1 && has3 && has9 && !has8) {
        labelText = 'Flat + 2';
      } else if (has8 && has4 && has5) {
        labelText = 'Office Space + 2';
      } else if (has16 && has4 && has5) {
        labelText = 'Shop/Showroom + 2';
      } else if (has17 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has18 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has1 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has9 && has4 && has5) {
        labelText = 'Farm House + 2';
      } else if (has3 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has3 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has8) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has16) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has17) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has18) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has4) {
        labelText = 'Flat + 2';
      } else if (has9 && has1 && has5) {
        labelText = 'Flat + 2';
      } else if (has1 && has4) {
        labelText = 'Farm House + 1';
      } else if (has3 && has4) {
        labelText = 'Farm House + 1';
      } else if (has9 && has4) {
        labelText = 'Farm House + 1';
      } else if (has1 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has9 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has1 && has18) {
        labelText = 'Flat + 1';
      } else if (has3 && has16) {
        labelText = 'Shop/Showroom + 1';
      } else if (has3 && has18) {
        labelText = 'Villa + 1';
      } else if (has9 && has16) {
        labelText = 'Plot + 1';
      } else if (has9 && has18) {
        labelText = 'Plot + 1';
      } else if (has16 && has4) {
        labelText = 'Shop/Showroom + 1';
      } else if (has16 && has5) {
        labelText = 'Shop/Showroom + 1';
      } else if (has17 && has4) {
        labelText = 'Farm House + 1';
      } else if (has17 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has18 && has4) {
        labelText = 'Farm House + 1';
      } else if (has18 && has5) {
        labelText = 'Agricultural Land + 1';
      } else if (has3 && has1 && !has9) {
        labelText = 'Villa + 1';
      } else if (has3 && !has1 && has9) {
        labelText = 'Villa + 1';
      } else if (has9 && has1 && !has3) {
        labelText = 'Plot + 1';
      } else if (has9 && !has1 && has3) {
        labelText = 'Plot + 1';
      } else if (has1 && has9 && !has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has9 && has3) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && !has8 && has16) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has8) {
        labelText = 'Flat + 1';
      } else if (has1 && !has3 && !has9 && has17) {
        labelText = 'Flat + 1';
      } else if (has3 && !has9 && has17) {
        labelText = 'Villa + 1';
      } else if (has9 && has17) {
        labelText = 'Plot + 1';
      } else if (has8 && has17) {
        labelText = 'Office Space + 1';
      } else if (has16 && has17) {
        labelText = 'Shop/Showroom + 1';
      } else if (has8 && has16) {
        labelText = 'Office Space + 1';
      } else if (has17 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has16 && has18) {
        labelText = 'Warehouse/Godown + 1';
      } else if (has8 && has18) {
        labelText = 'Office Space + 1';
      } else if (has8 && has1) {
        labelText = 'Office Space + 1';
      } else if (has8 && has3) {
        labelText = 'Office Space + 1';
      } else if (has8 && has9) {
        labelText = 'Office Space + 1';
      } else if (has8 && has4) {
        labelText = 'Office Space + 1';
      } else if (has8 && has5) {
        labelText = 'Office Space + 1';
      } else if (has4 && has5) {
        labelText = 'Farm House + 1';
      } else if (has1) {
        labelText = 'Flat';
      } else if (has3) {
        labelText = 'Villa';
      } else if (has9) {
        labelText = 'Plot';
      } else if (has8) {
        labelText = 'Office Space';
      } else if (has16) {
        labelText = 'Shop/Showroom';
      } else if (has17) {
        labelText = 'Commercial Land';
      } else if (has18) {
        labelText = 'Warehouse/Godown';
      } else if (has4) {
        labelText = 'Farm House';
      } else if (has5) {
        labelText = 'Agricultural Land';
      } else {
        labelText = 'Property Type';
      }

      label.textContent = labelText;
    }
  }

  pgCheckboxChange(event: any, id: number, type: string) {
    if (event.target.checked) {
      this.selectedResidentialItems.push(id);
    } else {
      this.selectedResidentialItems = this.selectedResidentialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.pgChangeLabel();
  }

  pgChangeLabel() {
    const label = document.querySelector('#property_tabs_pg');

    if (label) {
      let labelText = '';

      const hasBoys = this.selectedResidentialItems.includes(1);
      const hasGirls = this.selectedResidentialItems.includes(2);
      const has22 = this.selectedResidentialItems.includes(22);
      const has23 = this.selectedResidentialItems.includes(23);

      if (hasBoys && hasGirls && has22 && has23) {
        labelText = 'Boys + 3';
      } else if (hasBoys && hasGirls && has22) {
        labelText = 'Boys + 2';
      } else if (hasBoys && hasGirls && has23) {
        labelText = 'Boys + 2';
      } else if (hasBoys && has23 && has22) {
        labelText = 'Boys + 2';
      } else if (has23 && hasGirls && has22) {
        labelText = 'PG + 2';
      } else if (hasBoys && hasGirls) {
        labelText = 'Boys + 1';
      } else if (has22 && has23) {
        labelText = 'PG + 1';
      } else if (has22 && hasBoys) {
        labelText = 'PG + 1';
      } else if (has23 && hasBoys) {
        labelText = 'Girls + 1';
      } else if (has23 && hasGirls) {
        labelText = 'Girls + 1';
      } else if (has22 && hasGirls) {
        labelText = 'Girls + 1';
      } else if (hasBoys) {
        labelText = 'Boys';
      } else if (hasGirls) {
        labelText = 'Girls';
      } else if (has22) {
        labelText = 'PG';
      } else if (has23) {
        labelText = 'Room/Bed in a Shared-Flat';
      } else {
        labelText = 'Property Type';
      }

      label.textContent = labelText;
    }
  }

  hostelCheckboxChange(event: any, id: number, type: string) {
    if (event.target.checked) {
      this.selectedResidentialItems.push(id);
    } else {
      this.selectedResidentialItems = this.selectedResidentialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.hostelChangeLabel();
  }

  hostelChangeLabel() {
    const label = document.querySelector('#property_tabs_hostel');

    if (label) {
      let labelText = '';

      const hasBoys = this.selectedResidentialItems.includes(1);
      const hasGirls = this.selectedResidentialItems.includes(2);
      const has24 = this.selectedResidentialItems.includes(24);
      const has25 = this.selectedResidentialItems.includes(25);

      if (hasBoys && hasGirls && has24 && has25) {
        labelText = 'Boys + 3';
      } else if (hasBoys && hasGirls && has24) {
        labelText = 'Boys + 2';
      } else if (hasBoys && hasGirls && has25) {
        labelText = 'Boys + 2';
      } else if (hasBoys && has25 && has24) {
        labelText = 'Boys + 2';
      } else if (has25 && hasGirls && has24) {
        labelText = 'PG + 2';
      } else if (hasBoys && hasGirls) {
        labelText = 'Boys + 1';
      } else if (has24 && has25) {
        labelText = 'PG + 1';
      } else if (has24 && hasBoys) {
        labelText = 'PG + 1';
      } else if (has25 && hasBoys) {
        labelText = 'Girls + 1';
      } else if (has25 && hasGirls) {
        labelText = 'Girls + 1';
      } else if (has24 && hasGirls) {
        labelText = 'Girls + 1';
      } else if (hasBoys) {
        labelText = 'Boys';
      } else if (hasGirls) {
        labelText = 'Girls';
      } else if (has24) {
        labelText = 'PG';
      } else if (has25) {
        labelText = 'Room/Bed in a Shared-Flat';
      } else {
        labelText = 'Property Type';
      }

      label.textContent = labelText;
    }
  }

  handleCommercialCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedCommercialItems.push(id);
    } else {
      this.selectedCommercialItems = this.selectedCommercialItems.filter(
        (item) => item !== id
      );
    }
    this.changeLabel();
  }

  handleOtherCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedOtherItems.push(id);
    } else {
      this.selectedOtherItems = this.selectedOtherItems.filter(
        (item) => item !== id
      );
    }
    this.changeLabel();
  }

  renthandleCommercialCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedCommercialItems.push(id);
    } else {
      this.selectedCommercialItems = this.selectedCommercialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.rentchangeLabel();
  }

  renthandleOtherCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedOtherItems.push(id);
    } else {
      this.selectedOtherItems = this.selectedOtherItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.rentchangeLabel();
  }

  farmhousehandleCommercialCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedCommercialItems.push(id);
    } else {
      this.selectedCommercialItems = this.selectedCommercialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.farmhousechangeLabel();
  }

  farmhousehandleOtherCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedOtherItems.push(id);
    } else {
      this.selectedOtherItems = this.selectedOtherItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.farmhousechangeLabel();
  }

  plotshandleCommercialCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedCommercialItems.push(id);
    } else {
      this.selectedCommercialItems = this.selectedCommercialItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.plotschangeLabel();
  }

  plotshandleOtherCheckboxChange(event: any, id: number, type: any) {
    if (event.target.checked) {
      this.selectedOtherItems.push(id);
    } else {
      this.selectedOtherItems = this.selectedOtherItems.filter(
        (item) => item !== id
      );
    }
    this.type = type;
    this.plotschangeLabel();
  }

  getvaluemin(minval: any, type: any) {
    if (type == 'rent') {
      this.minBudget = minval;
      $('#maxBudjetrent').click();
    } else if (type == 'buy') {
      this.minBudget = minval;
      $('#budgetMax').click();
    } else if (type == 'farm') {
      this.minBudget = minval;
      $('#maxBudjetfarm').click();
    } else if (type == 'plot') {
      this.minBudget = minval;
      $('#maxBudjetplot').click();
    } else if (type == 'pg') {
      this.minBudget = minval;
      $('#maxBudjetpg').click();
    } else if (type == 'hostel') {
      this.minBudget = minval;
      $('#maxBudjethostel').click();
    }
  }

  getvaluemax(maxval: any, type: any) {
    this.maxBudget = maxval;
    this.toggleBudget();
  }
}
