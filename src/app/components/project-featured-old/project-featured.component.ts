import { AfterViewInit, Component, ElementRef, HostListener, Input,OnInit, ViewChild  } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { ProjectdetailsService } from '../service/projectdetails.service';
import { IssponsoredService } from '../service/issponsored.service';
import { IsverifiedService } from '../service/isverified.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ToastrModule,ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-project-featured',
  templateUrl: './project-featured.component.html',
  styleUrls: ['./project-featured.component.css'],
  providers: [DatePipe]
})
export class ProjectFeaturedComponent implements OnInit,AfterViewInit  {
  private apiUrl: string = environment.apiUrl;
  formDataphone: any = {countrycode: '+91',};
  @ViewChild('descriptionElem') descriptionElem!: ElementRef;
  @Input() item: any;
  @Input() latitude!: number;
  @Input() longitude!: number;
  private _album: any[] = [];
  singleproject: any;
  singleprojectData: any;
  sponsorData: any;
  sponsor: any;
  verifyData: any;
  verify: any;
  currentSection: any;
  showMore: any;
  activeSection:any='overview';
  formData = {
    username: '', // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    countrycode: 'IN +91', // Initialize with an empty string
    phone_number: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string
  };

  mapUrl!: SafeResourceUrl;
  constructor(
    private _lightbox: Lightbox,
    private route: ActivatedRoute,
    private projectDetailService: ProjectdetailsService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private sponsorservice: IssponsoredService,
    private verifyservice: IsverifiedService,
    private location: Location,
    private toastr: ToastrModule,
    private tost:ToastrService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {
    this._album.push({
      src: 'assets/images/advertisement.png',
      caption: 'Image 1',
    });
  }

  categoryDisplayNames: { [key: string]: string } = {
    educationalinstitute: 'Educational Institute',
    shoppingcentre: 'Shopping Centre',
    hospital: 'Hospital',
    commercialhub: 'Commercial Hub'
  };

  hasKeysOrValues(obj: any): boolean {
    return Object.keys(obj).some(
      key => obj[key] && obj[key].length > 0
    );
  }

  showReadMore: boolean = false;
  isReadMore: boolean = false;
  charLimit: number = 20;

  ngAfterViewInit(): void {
    this.checkDescriptionHeight();
  }


  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  openLightbox(index: number = 0): void {
    console.log('Album content:', this._album);
    this._lightbox.open(this._album, index);
    console.log('Opening Lightbox');
  }

  activeButton: string = 'buy';

  setActiveButton(button: string) {
    this.activeButton = button;
  }

  // Properties  slider

  slideConfig1 = {
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
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };

  // Properties  slider

  // units_featured slider

  slideConfig2 = {
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
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };

  // units_featured slider

  // gallery slider

  slideConfig3 = {
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
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };

  // gallery slider

  // Properties  slider

  slideConfig4 = {
    slidesToShow: 4,
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
      {
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };

  // Properties  slider

  // Download Brochure otp

  showOTP: boolean = false;
  otp: string = '';



  center!: google.maps.LatLngLiteral;
  zoom = 15; // You can adjust the zoom level

  ngOnInit(): void {
    this.fetchPropertyDetails();
    this.loadissponsored();
    // this.loadisverified();
    this.center = {
      // lat: this.singleproject.latitude,
      // lng: this.singleproject.longitude,
      lat: this.singleproject.latitude,
      lng: this.singleproject.longitude,
    };
     const url =
    `https://www.google.com/maps?q=${this.singleproject?.latitude},${this.singleproject?.longitude}&output=embed`;
 
  this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    window.onscroll = () => this.checkScroll();
      this.route.fragment.subscribe(fragment => {
        this.currentSection = fragment;
      });
  }

  // scrollToSection(sectionId: string): void {
  //   const section = document.getElementById(sectionId);
  //   if (section) {
  //     section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // }
  checkDescriptionHeight(): void {
//     const descriptionText = this.item.property_description || '';
// console.log(descriptionText)
//     if (descriptionText.length > this.charLimit) {
//       this.showReadMore = true;
//     } else {
//       this.showReadMore = false;
//     }
  }

  // hasKeysOrValues(obj: any): boolean {
  //   return Object.keys(obj).length > 0 &&
  //          !Object.values(obj).every(value => value === null || value === undefined || value === '');
  // }

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

  fetchPropertyDetails() {
    const projectName = this.route.snapshot.paramMap.get('name');
    const projectId = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');
    if (projectName && projectId && type) {
      this.projectDetailService
        .getprojectdetail(projectName, parseInt(projectId), parseInt(type))
        .subscribe(
          (projectData: any) => {
            this.singleprojectData = projectData;
            this.singleproject = this.singleprojectData?.data;
            // let a = this.singleproject.landmarksnearproject.map((item:any)=> item)
          },
          (error: any) => {
            console.error('Error fetching project details:', error);
          }
        );
    }
  }

  submitFormPhone() {
    this.http.post(`${this.apiUrl}storenquiry`, this.formData)
      .subscribe((response: any) => {
        if (response.isSuccess === true) {
          const elementToClick = this.elementRef.nativeElement.querySelector('#getphoneno');
          if (elementToClick) {
            elementToClick.click();
          }
        this.tost.success('Inquiry Addeded successfully!');

        } else {
          // Handle the case when isSuccess is not true
        }
      }, (error) => {
        console.error('Error sending data', error);
      });
  }

  loadissponsored(): void {
    this.sponsorservice.sponsorget()?.subscribe((sponsorData: any) => {
      this.sponsorData = sponsorData;
      this.sponsor = this.sponsorData?.responseData?.issponsored;
    });
  }

  // loadisverified(): void {
  //   this.verifyservice.verifiedget()?.subscribe((verifyData: any) => {
  //     this.verifyData = verifyData;
  //     this.verify = this.verifyData?.responseData?.isverified;
  //   });
  // }


  // objectKeys(obj: any): string[] {
  //   return Object.keys(obj);
  // }

  submitForm(form: any) {
    this.showOTP = true;
  }

  verifyOTP() {
    console.log('OTP Verified:', this.otp);
  }
  getLandmarkCategories(): any[] {
    return Object.entries(this.singleproject.landmarksnearproject).map(([key, value]) => ({
      category: key,
      landmarks: value
    }));
  }

  getLandmarkEntries() {
    return Object.entries(this.singleproject.landmarksnearproject);
  }

  // toggleShowMore(category: string): void {
  //   this.showMore[category] = !this.showMore[category];
  // }
}
