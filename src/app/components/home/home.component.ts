import {
  AfterViewInit,
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { Title, Meta } from '@angular/platform-browser';
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
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivityTrackerService } from '../service/activitytracker.service';
declare var bootstrap: any;
interface City {
  cid: number;
  cname: string;
}
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
  @ViewChild('otpModel') otpModel!: ElementRef;
  selectedResidentialItems: number[] = [];
  selectedCommercialItems: number[] = [];
  selectedGenders: string[] = [];
  selectedLookingFor: string[] = [];
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
  city1:City[]=[];
  contact:any;
  contactData:any;
  formData: any = {
    username: '',
    useremail: '',
    countrycode: 'IN +91',
    contact_no: null,
    property_for: '',
    otp: '',
    termsAccepted: false};
    propertyLabel: string = 'Select Property Type';
    selectedItemsOrder: any[] = [];
    selectedItemsPg: Array<{ id: number, name: string }> = [];
    selectedItemsHostel: Array<{ id: number, name: string }> = [];
    propertyServices:any;
    genderOptions = [
      { id: 1, name: 'Boys' },
      { id: 2, name: 'Girls' }
    ];

    genderHostelOptions = [
      { id: 1, name: 'Boys' },
      { id: 2, name: 'Girls' }
    ];

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

    nameError:boolean=false;
    emailError:boolean=false;
    phoneError:boolean=false;
    otpError: boolean = false;
    isResendEnabled = false;
    termsError:boolean=false;
    isMobileNumberDisabled: boolean = false;
    openModel = 0;
    remainingTime: number = 60;
    private timer: any;
    isSubmitting = false;
    proj_id:string='';
    singleProp:any;
    checkToken:any;
    is_token:boolean=false;

  constructor(
    public http: HttpClient,
    private activityTrackerService: ActivityTrackerService,
    private titleService: Title, private metaService: Meta,
    private spinner: NgxSpinnerService,
    private tost: ToastrService,
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
      selectcitysearch: new FormControl(null),
      propertytype: new FormControl(''),
      searchtype: new FormControl(''),
    });
    this.myForm = this.fb.group({
      selectcitysearch: [null, Validators.required],
      // searchtype: [''],
    });

    // Initialize error messages
    this.errorMessages = {
      selectcitysearch: [{ type: 'required', message: 'City is required.' }],
    };
  }
  handleTabClick(tabName: string): void {
    this.activeTab = tabName;
    this.loadpropertyresidential();
  }
  ngOnInit() {
    this.locationCookie = localStorage.getItem('location');
    this.fetchCities();
    this.checkLoggedIn();
    this.propertyServicesHomePage()
    this.loadpropertyresidential();
    this.titleService.setTitle('Real Estate Property Portal | Real Estate Services | Buy, Sell, Rent Properties | realtymart.Com');
    this.metaService.addTag({
      name: 'description',
      content: 'Find the best real estate services. Buy, sell, and rent properties with ease at realtymart.Com. Your one-stop property portal!'
    });
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
    }
  }

  ngAfterViewInit() {
    // this.loadHomeBanner();
  }


  checkLoggedIn() {
    this.checkToken = localStorage.getItem('myrealtylogintoken');
    if(this.checkToken){
      this.is_token= true;
    }
    else {
      this.is_token= false;
    }
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
                  // this.loadHotDeals();
                  // this.loadFeaturedResidentalProjects();
                  // this.loadFeaturedCommercialProjects();
                  // this.loadFeaturedBunglowsProjects();
                  // this.loadFarmHouseProjects();
                  // this.loadFeaturedPlotsProjects();
                  // this.loadTopBuilders();
                  // this.loadHomeBanner();
                } else {
                  this.updateCity('Ahmedabad');
                  // this.loadHotDeals();
                  // this.loadFeaturedResidentalProjects();
                  // this.loadFeaturedCommercialProjects();
                  // this.loadFeaturedBunglowsProjects();
                  // this.loadFarmHouseProjects();
                  // this.loadFeaturedPlotsProjects();
                  // this.loadTopBuilders();
                  // this.loadHomeBanner();
                }
              })
              .catch((error: any) => {
                console.error('Error getting city from coordinates:', error);
                this.updateCity('Ahmedabad');
                // this.loadHotDeals();
                // this.loadFeaturedResidentalProjects();
                // this.loadFeaturedCommercialProjects();
                // this.loadFeaturedBunglowsProjects();
                // this.loadFarmHouseProjects();
                // this.loadFeaturedPlotsProjects();
                // this.loadTopBuilders();
                // this.loadHomeBanner();
              });
          },
          (error) => {
            console.error('Error getting location', error);
            this.updateCity('Ahmedabad');
            // this.loadHotDeals();
            // this.loadFeaturedResidentalProjects();
            // this.loadFeaturedCommercialProjects();
            // this.loadFeaturedBunglowsProjects();
            // this.loadFarmHouseProjects();
            // this.loadFeaturedPlotsProjects();
            // this.loadTopBuilders();
            // this.loadHomeBanner();
          }
        );
      } else {
        console.error('Geolocation not supported by this browser.');
        this.updateCity('Ahmedabad');
        // this.loadHotDeals();
        // this.loadFeaturedResidentalProjects();
        // this.loadFeaturedCommercialProjects();
        // this.loadFeaturedBunglowsProjects();
        // this.loadFarmHouseProjects();
        // this.loadFeaturedPlotsProjects();
        // this.loadTopBuilders();
        // this.loadHomeBanner();
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
      this.bannerservice.homepagebannerget(this.city)?.subscribe((bannerData: any)=> {
        this.bannerData = bannerData;
        this.bannerbuilder = this.bannerData?.data;
      })
    }

  propertyServicesHomePage() {
    this.http.get(`${environment.apiUrl}propertyserviceshomepage`)
    .subscribe((response: any) => {
      this.propertyServices = response.data;
    }, (error: any) => {
      console.error('Error sending data', error);
    });
  }

  contactowner(propertyid:any){
    this.proj_id=propertyid;
    this.http
    .get(`${environment.apiUrl}contactowner/${propertyid}`)
    .subscribe(
      (contactData: any) => {
        this.contactData = contactData;
        this.contact = this.contactData?.data;
      },
      (error: any) => {
        // Handle the error as needed
      }
    );
    }

    trackCustomActivity() {
      this.router.navigate(['property-details/:name/:id']);
      this.router.navigate(['project-details/:name/:id']);
      this.router.navigate(['builder-details/:id']);
    }


  loadHotDeals() {
    this.hotdealsService.hotdealget(this.city)?.subscribe((hotdealData) => {
        this.hotdealData = hotdealData;
        this.hotdeals = this.hotdealData?.data;
    });
  }

  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  loadFeaturedResidentalProjects() {
    this.featureresidentalService.futureresidentalget(this.city)?.subscribe((featureResidentalData: any) => {
        this.featureResidentalData = featureResidentalData;
        this.featuredResidentals = this.featureResidentalData?.data;
    });
  }

  loadFeaturedCommercialProjects() {
    this.featurecommercialService.featurecommercialget(this.city)?.subscribe((featuredcommercialData: any) => {
        this.featureCommercialData = featuredcommercialData;
        this.featuredcommercials = this.featureCommercialData?.data;
    });
  }

  loadFeaturedBunglowsProjects() {
    this.featurebunglowsService.featurebunglowsvillasget(this.city)?.subscribe((featureBunglowsData: any) => {
        this.featureBunglowsData = featureBunglowsData;
        this.featuredBunglowss = this.featureBunglowsData?.data;
    });
  }

  loadFarmHouseProjects() {
    this.farmHouseProjects.featurefarmhouseget(this.city)?.subscribe((featureFarmData: any) => {
        this.featureFarmData = featureFarmData;
        this.featurefarmhouse = this.featureFarmData?.data;
    });
  }

  loadFeaturedPlotsProjects() {
    this.featureplotsService.featuredplotsget(this.city)?.subscribe((featurePlotsData: any) => {
        this.featurePlotsData = featurePlotsData;
        this.featurePlotss = this.featurePlotsData?.data;
    });
  }

  loadTopBuilders() {
    this.topbuildersService.topbuilderget(this.city)?.subscribe((data) => {
        this.topbuilderData = data;
        this.topbuilders = this.topbuilderData?.responseData;
    });
  }

  loadpropertyresidential(): void {
    this.propertyresidentialservice.getpropertytyperesidential()?.subscribe((propertyresidentialData: any) => {
        this.propertyresidentialData = propertyresidentialData;
        this.propertyresidential =
          this.propertyresidentialData?.responseData?.propertytyperesidential;

          if (this.activeTab != 'pg' && this.activeTab != 'hostel') {
            const defaultSelections = ['Flat', 'Villa'];
            this.selectedResidentialItems = this.propertyresidential
            ?.filter((item: any) => defaultSelections.includes(item.name))
            .map((item: any) => item.id);
            this.selectedItemsOrder = this.propertyresidential?.filter(
              (item: any) => defaultSelections.includes(item.name)
            );
            //     const defaultSelections = ['Flat', 'Villa'];
            //     this.selectedResidentialItems = this.propertyresidential
            //   ?.filter((item: any) => defaultSelections.includes(item.name))
            //   .map((item: any) => item.id);
            // this.selectedItemsOrder = this.propertyresidential?.filter(
              //   (item: any) => defaultSelections.includes(item.name)
              // );
      }
      else {
        this.selectedResidentialItems = [];
        this.selectedItemsOrder = [];
      }

      if (this.selectedResidentialItems.length > 0) {
        this.Residencialvisible = true;
      } else {
        this.Residencialvisible = false;
      }

      // Update the label with default selected items
      this.updatePropertyLabel();
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

    if(!clickedElement.closest('.budget-inner'))
    {
      this.togglebudget = false;
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

  // city1 = [
  //   { cid: 0, cname: 'Ahmedabad' },
  //   { cid: 1, cname: 'Rajkot' },
  //   { cid: 2, cname: 'Surat' },
  //   { cid: 3, cname: 'Vadodara' }
  // ];

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

  // toggleDisabled() {
  //   const car: any = this.city[11];
  //   car.disabled = !car.disabled;
  // }
  //-------------------------------//
  // Hot Deals Slider //
  //-------------------------------//
  slideConfig2 = {
    slidesToShow: 4,
    slidesToScroll: 3,
    dots: true,
    arrows: false,
    infinite: true,
    "autoplay":true,
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
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows:true
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
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows:true
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
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
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
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows:true
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
          dots: false,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: false,
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
          slidesToShow: 3,
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
    // autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
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
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows:true
        },
      },
    ],
  };
  fetchCities() {
    this.http.get<{ data: { id: number; name: string }[] }>(`${environment.apiUrl}cities`).subscribe(
      (response: any) => {
        this.city1 = response.responseData.map((city: any) => ({
          cid: city.id,
          cname: city.name
        }));
        const defaultCity = this.city1.find(city => city.cname === this.city);
        if (defaultCity) {
          this.myForm.get('selectcitysearch')?.setValue(defaultCity.cid);
        }
      },
      (error: any) => {
        console.error('API Error:', error);
      }
    );
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.searchError = true;  // This will trigger error messages in the form
      return;
    }
      this.searchError = false;

      const ResidentialItems = this.selectedItemsOrder.filter(
        (item) => item.type === 'RESIDENTIAL'
      ).map((item) => item.id);;
      const CommercialItems = this.selectedItemsOrder.filter(
        (item) => item.type === 'COMMERCIAL'
      ).map((item) => item.id);;
      const OtherItems = this.selectedItemsOrder.filter(
        (item) => item.type !== 'RESIDENTIAL' && item.type !== 'COMMERCIAL'
      ).map((item) => item.id);

      const selectedCityId = this.myForm.get('selectcitysearch')?.value;
      const selectedCity = this.city1.find(city => city.cid === selectedCityId);
      const location = selectedCity?.cname || this.city;

      let searchData: any = {
        location: location,
        minPrice: this.minBudget,
        maxPrice: this.maxBudget,
        propertyfor: this.activeTab,
      };

      if (this.activeTab == 'pg' || this.activeTab == 'hostel') {
        searchData.gender = this.selectedGenders;
        searchData.lookingFor = this.selectedLookingFor;
      } else {
        searchData.residentialItems = ResidentialItems;
        searchData.commercialItems = CommercialItems;
        searchData.otherItems = OtherItems;
      }

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
  }

  updateSelectedItems(event: any, id: number, selectedItems: number[], itemsList: any[]): void {
    const selectedItem = itemsList.find(i => i.id === id);

    if (event.target.checked) {
      this.selectedItemsOrder.push(selectedItem);
    }
     else {
      // this.selectedItemsOrder = this.selectedItemsOrder.filter(i => i.id !== id);
      selectedItems = selectedItems.filter(itemId => itemId !== selectedItem.id);
      this.selectedItemsOrder = this.selectedItemsOrder.filter(item => item.id !== selectedItem.id);
    }
    this.selectedResidentialItems = [...selectedItems];
    this.updatePropertyLabel();
  }

  handleResidentialCheckboxChange(event: any, id: number) {
    this.updateSelectedItems(event, id, this.selectedResidentialItems, this.propertyresidential);
  }

  rentCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedResidentialItems, this.propertyresidential);
  }

  farmhouseCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedResidentialItems, this.propertyresidential);
  }

  plotsCheckboxChange(event: any, id: number, type: any) {
    // if (event.target.checked) {
    //   this.selectedResidentialItems.push(id);
    // } else {
    //   this.selectedResidentialItems = this.selectedResidentialItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.type = type;
    // this.plotschangeLabel();
    this.updateSelectedItems(event, id, this.selectedResidentialItems, this.propertyresidential);
  }

  pgCheckboxChange(event: any, id: any, name: string) {

    if (event.target.checked) {
      this.selectedItemsPg.push({ id, name });
  } else {
      this.selectedItemsPg = this.selectedItemsPg.filter(item => item.id !== id);
  }
  this.pgChangeLabel();

  if (this.activeTab === 'pg' || this.activeTab === 'hostel') {
    if (name === 'Boys' || name === 'Girls') {
      // Handle Gender selection
      if (event.target.checked) {
        this.selectedGenders.push(name);
      } else {
        this.selectedGenders = this.selectedGenders.filter(gender => gender !== name);
      }
    } else {
      // Handle Looking For selection
      if (event.target.checked) {
        this.selectedLookingFor.push(name);
      } else {
        this.selectedLookingFor = this.selectedLookingFor.filter(lookingFor => lookingFor !== name);
      }
    }
  }
  }

  pgChangeLabel() {
    const selectedCount = this.selectedItemsPg.length;

    if (selectedCount === 0) {
      this.propertyLabel = 'Select Property Type';  // Default label when nothing is selected
    } else if (selectedCount === 1) {
      // Display the name of the first selected item
      // const selectedItem = this.propertypg.find(
      //   (item:any) => item.id === this.selectedResidentialItems[0]
      // );
      this.propertyLabel = this.selectedItemsPg[0].name;
    } else {
      // Display the first selected item and count of others
      this.propertyLabel = `${this.selectedItemsPg[0].name} + ${selectedCount - 1}`;
      // const firstItem = this.propertypg.find(
      //   (item:any) => item.id === this.selectedResidentialItems[0]
      // );
      // this.propertyLabel = `${firstItem ? firstItem.name : 'Item'} + ${selectedCount - 1}`;
    }
    // const label = document.querySelector('#property_tabs_pg');

  }

  hostelCheckboxChange(event: any, id: any, name: string) {
    if (event.target.checked) {
      // Add item if checked
      this.selectedItemsHostel.push({ id, name });
    } else {
      // Remove item if unchecked
      this.selectedItemsHostel = this.selectedItemsHostel.filter(item => item.id !== id);
    }
    this.hostelChangeLabel();


  if (this.activeTab === 'pg' || this.activeTab === 'hostel') {
    if (name === 'Boys' || name === 'Girls') {
      // Handle Gender selection
      if (event.target.checked) {
        this.selectedGenders.push(name);
      } else {
        this.selectedGenders = this.selectedGenders.filter(gender => gender !== name);
      }
    } else {
      // Handle Looking For selection
      if (event.target.checked) {
        this.selectedLookingFor.push(name);
      } else {
        this.selectedLookingFor = this.selectedLookingFor.filter(lookingFor => lookingFor !== name);
      }
    }
  }
  }

  hostelChangeLabel() {
    const selectedCount = this.selectedItemsHostel.length;

    if (selectedCount === 0) {
      this.propertyLabel = 'Select Property Type'; // Default label when nothing is selected
    } else if (selectedCount === 1) {
      this.propertyLabel = this.selectedItemsHostel[0].name;
    } else {
      this.propertyLabel = `${this.selectedItemsHostel[0].name} + ${selectedCount - 1}`;
    }
  }

    handleCommercialCheckboxChange(event: any, id: number) {
      this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);
    // this.updatePropertyLabel(this.selectedCommercialItems, this.propertycommercial);
      // if (event.target.checked) {
      //   this.selectedCommercialItems.push(id);
      // } else {handleOtherCheckboxChange
      //   this.selectedCommercialItems = this.selectedCommercialItems.filter(
      //     (item) => item !== id
      //   );
      // }
      // this.changeLabel();
    }

  handleOtherCheckboxChange(event: any, id: number) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);
    // this.updatePropertyLabel(this.selectedOtherItems, this.propertyother);

    // if (event.target.checked) {
    //   this.selectedOtherItems.push(id);
    // } else {
    //   this.selectedOtherItems = this.selectedOtherItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.changeLabel();
  }

  updatePropertyLabel(): void {
    const totalSelectedCount = this.selectedItemsOrder.length;

    if (totalSelectedCount > 0) {
      const firstSelectedText = this.selectedItemsOrder[0].name;
      const additionalCount = totalSelectedCount - 1;

      // Set label to display the first selected item, followed by the count of additional selected items
      this.propertyLabel = additionalCount > 0
        ? `${firstSelectedText} +${additionalCount}`
        : firstSelectedText;
    } else {
      this.propertyLabel = 'Select Property Type';  // Default label when no item is selected
    }
  }

  getSelectedText(selectedItems: number[], itemsList: any[]): string {
    if (!selectedItems.length) return '';

  const firstItem = itemsList.find(item => item.id === selectedItems[0]);
  return firstItem ? firstItem.name : '';
  }

  renthandleCommercialCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);
    this.updatePropertyLabel();
    // if (event.target.checked) {
    //   this.selectedCommercialItems.push(id);
    // } else {
    //   this.selectedCommercialItems = this.selectedCommercialItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.type = type;
    // this.rentchangeLabel();
  }

  renthandleOtherCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);
    this.updatePropertyLabel();
    // if (event.target.checked) {
    //   this.selectedOtherItems.push(id);
    // } else {
    //   this.selectedOtherItems = this.selectedOtherItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.type = type;
    // this.rentchangeLabel();
  }

  farmhousehandleCommercialCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);
    // if (event.target.checked) {
    //   this.selectedCommercialItems.push(id);
    // } else {
    //   this.selectedCommercialItems = this.selectedCommercialItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.type = type;
    // this.farmhousechangeLabel();
  }

  farmhousehandleOtherCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);
    // if (event.target.checked) {
    //   this.selectedOtherItems.push(id);
    // } else {
    //   this.selectedOtherItems = this.selectedOtherItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.type = type;
    // this.farmhousechangeLabel();
  }

  plotshandleCommercialCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedCommercialItems, this.propertycommercial);
    // if (event.target.checked) {
    //   this.selectedCommercialItems.push(id);
    // } else {
    //   this.selectedCommercialItems = this.selectedCommercialItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.type = type;
    // this.plotschangeLabel();
  }

  plotshandleOtherCheckboxChange(event: any, id: number, type: any) {
    this.updateSelectedItems(event, id, this.selectedOtherItems, this.propertyother);
    // if (event.target.checked) {
    //   this.selectedOtherItems.push(id);
    // } else {
    //   this.selectedOtherItems = this.selectedOtherItems.filter(
    //     (item) => item !== id
    //   );
    // }
    // this.type = type;
    // this.plotschangeLabel();
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

  submitForm() {
  this.spinner.show();

    const payload = this.contact.property ? {

      contact_no :this.formData.contact_no,
      useremail:this.formData.useremail,
      username:this.formData.username,
      project_Id:this.contact?.property?.project_id,
      property_id:this.contact?.property?.property_id,
      builder_id:this.contact?.property?.builder_id,
      agent_id:this.contact?.property?.agent_id,
      receiver_user_id:this.contact?.property?.user_id,
      leads_type:'Call for Price',
      leads_for:'Property',
      location:this.city
    } : {
      contact_no :this.formData.contact_no,
      useremail:this.formData.useremail,
      username:this.formData.username,
      project_Id:this.contact?.project?.project_id,
      builder_id:this.contact?.project?.builder_id,
      agent_id:this.contact?.project?.agent_id,
      receiver_user_id:this.contact?.project?.user_id,
      leads_type:'Call for Price',
      leads_for:'Project',
      location:this.city
    }
      // contact_no :this.formData.contact_no,

    // project_Id:this.proj_id,
    // propertyid:'',
    // builder_id:'',
    // agent_id:'',
    // useremail:this.formData.useremail,
    // username:this.formData.username,
    // leads_type:'Call for Price',
    // leads_for:'',
    // receiver_user_id:'',
    // countrycode:'',
    // request_price:0,
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json');

    this.http.post(`${environment.apiUrl}storeinquiry`,payload,{headers})
      .subscribe((response: any) => {
        if (response.status === true) {
          this.activityTrackerService.logActivity(`Inquiry stored for ${this.contact.property ? 'property' : 'project'}`,'');
          this.tost.success('Inquiry Addeded successfully!');
          const modalElement = document.getElementById('contact-owner');
          const modalElementProp = document.getElementById('contact-owner-prop');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
      if (modalElementProp) {
        const modalInstance = bootstrap.Modal.getInstance(modalElementProp);
        modalInstance?.hide();
      }
          this.resetForm();
        }
      }, (error) => {
        console.error('Error sending data', error);
      });
  }


  fetchProperty(property:any){
    this.singleProp= property;
  }

  validateCharInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputElement = event.target as HTMLInputElement;

    // Prevent space as the first character
    if (charCode === 32 && inputElement.value.length === 0) {
      event.preventDefault();
    }

    // Allow only alphabets (A-Z, a-z) and spaces (except first character)
    if (
      (charCode < 65 || (charCode > 90 && charCode < 97) || charCode > 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }


  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow numeric characters (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateName(event:any)
  {
    const inputValue = event.target.value;
    const companyPattern = /^[a-zA-Z\s]+$/;
    this.nameError = !companyPattern.test(inputValue);
  }

  validateEmail(event: any) {
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.emailError = !emailPattern.test(inputValue);
  }

  validatePhoneNumber(event: any) {
    const inputValue = event.target.value;

    const validFormatPattern = /^[0-9]{10}$/;
    const allIdenticalPattern = /^(?!([0-9])\1{9})[0-9]{10}$/;
    const sequentialPattern = /^(0123456789|9876543210|1234567890|0987654321)$/;
    const mirroredPattern = /^(.)(.)(.)(.)(.).?\5\4\3\2\1$/;

    if (
      !validFormatPattern.test(inputValue) ||        // Check if it's 10 digits
      !allIdenticalPattern.test(inputValue) ||       // Reject if all identical digits
      sequentialPattern.test(inputValue) ||          // Reject if sequential
      mirroredPattern.test(inputValue)               // Reject if mirrored/palindromic
    ) {
      this.phoneError = true; // Display error
    } else {
      this.phoneError = false; // Valid number
      // this.sendOTPToMobile();
    }
  }

  resendOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }

    verifyOTP() {

      if(this.formData.otp == ''){
        this.tost.error('Please Enter OTP');
        return
      }
      let payload  = {
        contact_no:this.formData.contact_no,
        otp:this.formData.otp,
      }

      this.http
        .post(
          `${environment.apiUrl}verifyinquiryotp`,
          payload
        )
        .subscribe(
          (response: any) => {
            if (response.status == true) {
              this.tost.success('OTP verified successfully.');
              const modalElement = this.otpModel.nativeElement;
              const modal = bootstrap.Modal.getInstance(modalElement);
              if (modal) {
                modal.hide();
              } else {
                const newModal = new bootstrap.Modal(modalElement);
                newModal.hide();
              }
              this.submitForm();
              this.isResendEnabled = false;
              this.isMobileNumberDisabled = true;

              // Optional: Delay for user feedback before hiding
              setTimeout(() => {
                this.spinner.hide();
              }, 1000); // Adjust the delay as needed
              // if (
              //   this.nameError||
              //   this.phoneError ||
              //   this.emailError
              // ) {
              //   return;
              // }
              // else{
              // }

              this.spinner.hide();
            } else {
              this.tost.error('Wrong OTP entered. Please try again.');
              this.isResendEnabled = true;
              this.isSubmitting = false; // Reset submission flag if failed
            }
          },
          (error) => {
            console.error('Wrong OTP entered. Please try again.', error);
            this.isResendEnabled = true;
            this.isSubmitting = false; // Reset submission flag on error
          }
        );
    }

    startTimer() {
      this.isResendEnabled = false;
      this.remainingTime = 60;
      clearInterval(this.timer);

      this.timer = setInterval(() => {
        this.remainingTime--;

        if (this.remainingTime <= 0) {
          clearInterval(this.timer);
          this.isResendEnabled = true;
        }
      }, 1000);
    }
    onTermsChange(event: Event) {
      this.termsError = !(event.target as HTMLInputElement).checked;
   }

    sendOTPToMobile() {
      this.spinner.show();
      this.http
        .post(`${environment.apiUrl}genrateinquiryotp`, {
          contact_no: this.formData.contact_no,
        })
        .subscribe(
          (response: any) => {
            if(response.data =='ok') {
            this.startTimer();
            if (response.status === true) {
              // this.sendOTPToMobile();
              const modalElement = this.otpModel.nativeElement;
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
              this.tost.success('OTP Sent Successfully.');
            }
            if (response.code === 101) {
              this.tost.warning(response.message);
            }
          }
            else {
              this.phoneError = true;
            }
            this.spinner.hide();
          },
          (error) => {
            this.tost.error('Failed to send OTP.');
            console.error('Error sending OTP', error);
            this.spinner.hide();
          }
        );
    }
    resetForm() {
      this.formData = {
        username: '',
        useremail: '',
        contact_no: ''
      };
      this.nameError = false;
      this.phoneError = false;
      this.emailError = false;
      this.termsError = false;
    }

    openOTPModal() {
      // Reset errors
      this.nameError = false;
      this.phoneError = false;
      this.emailError = false;
      this.termsError = false;

      // Validation checks
      if (!this.formData.username) {
        this.nameError = true;
      }
      if (!this.formData.useremail) {
        this.emailError = true;
      }
      if (!this.formData.contact_no) {
        this.phoneError = true;
      }
      if (!this.formData.termsAccepted) {
        this.termsError = true;
      }

      // Stop function execution if any error exists
      if (this.nameError || this.phoneError || this.emailError || this.termsError) {
        return;
      }

      this.sendOTPToMobile();

      let contactModal = document.getElementById('contact-owner-prop');
      let otpModal = document.getElementById('otpModel');

      if (contactModal) {
        let bsModal = bootstrap.Modal.getInstance(contactModal);
        bsModal?.hide();
      }

      // Show the OTP modal
      if (otpModal) {
        let otpModalInstance = new bootstrap.Modal(otpModal);
        otpModalInstance.show();
      }
    }
}
