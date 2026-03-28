import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { ProjectApproveDetailsService } from '../service/projectapprovedetail.service';
import { ProjectdetailsService } from '../service/projectdetails.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
// import { DatePipe } from '@angular/common';
import { ToastrModule,ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Fancybox } from "@fancyapps/ui";
import { Title, Meta } from '@angular/platform-browser';
import { error } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { IssponsoredService } from '../service/issponsored.service';
import { IsverifiedService } from '../service/isverified.service';
import { ActivityTrackerService } from '../service/activitytracker.service';
declare var bootstrap: any;
@Component({
  selector: 'app-project-approve-detail',
  templateUrl: './project-approve-detail.component.html',
  styleUrls: ['./project-approve-detail.component.css']
})
export class ProjectApproveDetailComponent implements OnInit, AfterViewInit, OnDestroy  {
  @ViewChild('otpModel') otpModel!: ElementRef;
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  @ViewChild('descriptionElem') descriptionElem!: ElementRef;
  @Input() item: any;
  @Input() latitude!: any;
  @Input() longitude!: any;
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
  nameError:boolean=false;
  emailError:boolean=false;
  phoneError:boolean=false;
  nameContactError:boolean=false;
  emailContactError:boolean=false;
  phoneContactError:boolean=false;
  termsError:boolean=false;
  termsContactError:boolean=false;
  isMobileNumberDisabled: boolean = false;
  isSubmitting = false;
  checkToken:any;
  is_token:boolean=false;
  formData : any = {
    username: '', // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    countrycode: 'IN +91', // Initialize with an empty string
    contact_no: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string,
    otp: '',
    termsAccepted: false
  };
  formDataphone: any = {
    contactusername: '',
    contactuseremail: '',
    contactcountrycode: 'IN +91',
    contactcontact_no: null,
    contactproperty_for: '', // Initialize with an empty string,
    contactotp: '',
    termsContactAccepted: false
  };
  otpError: boolean = false;
  isResendEnabled = false;
  openModel = 0;
  remainingTime: number = 60;
  private timer: any;
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private _lightbox: Lightbox,
    private route: ActivatedRoute,
    private projectApproveDetailService: ProjectApproveDetailsService,
    private projectdetailsService: ProjectdetailsService,
    private http: HttpClient,
    private sponsorservice: IssponsoredService,
    private verifyservice: IsverifiedService,
    private location: Location,
    // private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activityTrackerService: ActivityTrackerService
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
    Fancybox.bind('[data-fancybox="gallery"]', {

    });
}


  getFormattedDate(dateString: string) {
    // return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  openLightbox(index: number = 0): void {
    this._lightbox.open(this._album, index);
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
        breakpoint: 768,  // Max width 1024px
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
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
    // autoplay: true,
    prevArrow:
      "<img class='a-left control-c prev slick-prev' src='../assets/images/prev.svg'>",
    nextArrow:
      "<img class='a-right control-c next slick-next' src='../assets/images/next.svg'>",
    responsive: [
      {
        breakpoint: 768,  // Max width 1024px
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 480,  // Max width 1024px
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
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

  // ===== Brochure Form =====
  brochureMode: string = 'brochure'; // 'brochure' | 'payment'
  brochureFormData: any = { name: '', email: '', mobile: '', termsAccepted: false };
  brochureNameError: boolean = false;
  brochureEmailError: boolean = false;
  brochureMobileError: boolean = false;
  brochureTermsError: boolean = false;
  brochureOtpVisible: boolean = false;
  brochureOtp: string = '';
  brochureOtpError: boolean = false;

  // Download Brochure otp
  showOTP: boolean = false;
  otp: string = '';

  // ===== Gallery =====
  photoAlbum: any[] = [];
  layoutAlbum: any[] = [];
  videoAlbum: any[] = [];
  galleryVisible: boolean = false;
  galleryActiveTab: string = 'photos';
  galleryActiveIndex: number = 0;
  galleryZoom: number = 1;
  galleryFormType: string = ''; // 'contact' | 'brochure' | 'payment' | ''

  // ===== Gallery Inline Contact Form =====
  galleryContactData: any = { name: '', email: '', mobile: '', termsAccepted: false };
  galleryContactNameErr: boolean = false;
  galleryContactEmailErr: boolean = false;
  galleryContactMobileErr: boolean = false;
  galleryContactTermsErr: boolean = false;
  galleryContactOtpVisible: boolean = false;
  galleryContactOtp: string = '';
  galleryContactOtpErr: boolean = false;

  get currentAlbum(): any[] {
    if (this.galleryActiveTab === 'layout') return this.layoutAlbum;
    if (this.galleryActiveTab === 'video') return this.videoAlbum;
    return this.photoAlbum;
  }

  // ===== Reviews =====
  projectReviews: any[] = [];
  reviewFormData: any = { name: '', review: '', rating: 0 };
  reviewNameError: boolean = false;
  reviewTextError: boolean = false;
  reviewRatingError: boolean = false;
  hoveredReviewRating: number = 0;

  get averageRating(): number {
    if (!this.projectReviews.length) return 0;
    const sum = this.projectReviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
    return parseFloat((sum / this.projectReviews.length).toFixed(1));
  }



  center!: google.maps.LatLngLiteral;
  zoom = 15;

  ngOnInit(): void {
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
      this.formDataphone.contactusername = localStorage.getItem('name') || '';
      this.formDataphone.contactuseremail = localStorage.getItem('email') || '';
      this.formDataphone.contactcontact_no = localStorage.getItem('contact_no') || '';
      this.formDataphone.termsContactAccepted = true;
    }
    this.observeSections();
    this.detectActiveSectionOnScroll();
    this.fetchProjectApproveDetails();
    // this.loadissponsored();
    // this.loadisverified();
    this.center = {
      lat: this.singleproject?.latitude,
      lng: this.singleproject?.longitude,
    };
    window.onscroll = () => this.checkScroll();
      this.route.fragment.subscribe(fragment => {
        this.currentSection = fragment;
      });
      const modalElement = document.getElementById('get-builder');
      if (modalElement) {
        modalElement.addEventListener('hide.bs.modal', () => {
          this.resetContactForm();
        });
      }
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

  submitEnquiry(){
    // this.nameError = false;
    // this.phoneError = false;
    // this.emailError = false;
    // this.termsError = false;

    // if(!this.formData.username) {
    //   this.nameError=true;
    // }
    // if(!this.formData.useremail)
    // {
    //   this.emailError=true;
    // }
    // if(!this.formData.contact_no)
    // {
    //   this.phoneError=true;
    // }
    // if (!this.formData.termsAccepted) {
    //   this.termsError = true;
    // }

    // if(this.nameError || this.phoneError || this.emailError || this.termsError)
    // {
    //   return;
    // }
    this.spinner.show();
    const payload = {
      contact_no :this.formData.contact_no,
      useremail:this.formData.useremail,
      username:this.formData.username,
      project_Id:this.singleproject.id,
      builder_id:'',
      leads_type:'Project',
      leads_for:this.singleproject.property_for,
      receiver_user_id:this.singleproject.user_id,
      countrycode:'',
      request_price:0,
    }
    this.http.post(`${this.apiUrl}storeinquiry`,payload).subscribe((response:any)=> {
      if (response.status === true) {
        this.activityTrackerService.logActivity('Inquiry stored for project','');
        this.toastr.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
        this.resetForm();
        }
    },
  (error)=> {
    console.log('Error sending data',error)
  });
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
    this.nameError = false;
    this.phoneError = false;
    this.emailError = false;
    this.termsError = false;

    if(!this.formData.username) {
      this.nameError=true;
    }
    if(!this.formData.useremail)
    {
      this.emailError=true;
    }
    if(!this.formData.contact_no)
    {
      this.phoneError=true;
    }
    if (!this.formData.termsAccepted) {
      this.termsError = true;
    }

    if(this.nameError || this.phoneError || this.emailError || this.termsError)
    {
      return;
    }
    this.sendOTPToMobile(); // Call this to send OTP to mobile
  }

  openContactOTPModal() {
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;

    if(!this.formDataphone.contactusername) {
      this.nameContactError=true;
    }
    if(!this.formDataphone.contactuseremail)
    {
      this.emailContactError=true;
    }
    if(!this.formDataphone.contactcontact_no)
    {
      this.phoneContactError=true;
    }
    if (!this.formDataphone.termsContactAccepted) {
      this.termsContactError = true;
    }
    if(this.nameContactError || this.phoneContactError || this.emailContactError || this.termsContactError)
    {
      return;
    }
    this.sendOTPContactToMobile(); // Call this to send OTP to mobile
  }

  verifyContactOTP() {
    if(this.formDataphone.contactotp == ''){
      this.toastr.error('Please Enter OTP');
      return
    }
    let payload  = {
      contact_no:this.formDataphone.contactcontact_no,
      otp:this.formDataphone.contactotp,
    }
    this.http
      .post(
        `${this.apiUrl}verifyinquiryotp`,
        payload
      )
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            // this.toastr.success('OTP verified successfully.');
            const modalElement = this.otpContactModel.nativeElement;
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            } else {
              const newModal = new bootstrap.Modal(modalElement);
              newModal.hide();
            }
            this.submitFormPhone();
            this.isResendEnabled = false;
            this.isMobileNumberDisabled = true;

            // Optional: Delay for user feedback before hiding
            setTimeout(() => {
              this.spinner.hide();
            }, 1000); // Adjust the delay as needed
            // if (
            //   this.nameContactError||
            //   this.phoneContactError ||
            //   this.emailContactError
            // ) {
            //   return;
            // }
            // else {
            //   this.submitFormPhone();
            // }

            this.spinner.hide();
          } else {
            this.toastr.error('Wrong OTP entered. Please try again.');
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

  verifyOTP() {
    if(this.formData.otp == ''){
      this.toastr.error('Please Enter OTP');
      return
    }

    this.http
      .post(
        `${this.apiUrl}verifyinquiryotp`,
        this.formData
      )
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            // this.toastr.success('OTP verified successfully.');
            const modalElement = this.otpModel.nativeElement;
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            } else {
              const newModal = new bootstrap.Modal(modalElement);
              newModal.hide();
            }
            this.submitEnquiry();
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
            //   this.submitEnquiry();
            // }

            this.spinner.hide();
          } else {
            this.toastr.error('Wrong OTP entered. Please try again.');
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

  sendOTPToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formData.contact_no,
      })
      .subscribe(
        (response: any) => {
          if(response.data=='ok')
            {
          this.startTimer();
          if (response.status === true) {
            // this.sendOTPToMobile();
            const modalElement = this.otpModel.nativeElement;
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            this.toastr.success('OTP Sent Successfully.');
          }
          if (response.code === 101) {
            this.toastr.warning(response.message);
          }
        }
        else {
          this.phoneError = true;
        }
          this.spinner.hide();
        },
        (error) => {
          this.toastr.error('Failed to send OTP.');
          console.error('Error sending OTP', error);
          this.spinner.hide();
        }
      );
  }
  sendOTPContactToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formDataphone.contactcontact_no,
      })
      .subscribe(
        (response: any) => {
          if(response.data=='ok')
            {
          this.startTimer();
          if (response.status === true) {
            // this.sendOTPToMobile();
            const modalElement = this.otpContactModel.nativeElement;
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            this.toastr.success('OTP Sent Successfully.');
          }
          if (response.code === 101) {
            this.toastr.warning(response.message);
          }
        }
        else {
          this.phoneContactError = true;
        }
          this.spinner.hide();
        },
        (error) => {
          this.toastr.error('Failed to send OTP.');
          console.error('Error sending OTP', error);
          this.spinner.hide();
        }
      );
  }
  resendOTP() {
    if (this.isResendEnabled) {
      this.sendOTPToMobile(); // Logic to send OTP
      this.startTimer(); // Restart the timer after resending OTP
    }
  }

  resendContactOTP() {
    clearInterval(this.timer);
    this.startTimer();
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
  observeSections() {
    const sections = document.querySelectorAll('#overview,#properties,#aboutProject, #amenities,#project-detail,#locality,#developer');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Section is considered active if 50% is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, observerOptions);
    sections.forEach((section) => {
      return observer.observe(section)});
  }


  scrollToSection(sectionId: string): void {
    // Clear any Bootstrap modal overflow-hidden left on body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    // Remove any lingering Bootstrap modal backdrop
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    const section = document.getElementById(sectionId);
    const navbar = document.getElementById('navbar');

    if (section && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
      const scrollMargin = 130;
      // const scrollToPosition = sectionPosition - navbarHeight ;
      const scrollToPosition = sectionPosition - navbarHeight - scrollMargin;

      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
      });
      this.activeSection = sectionId;
    }
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.checkScroll()
    this.detectActiveSectionOnScroll();
  }
  checkScroll() {
    const navbar = document.getElementById("navbar");
    const sticky = navbar?.offsetTop;

    if (window.pageYOffset > sticky!) {
      navbar?.classList.add("sticky");
    } else {
      navbar?.classList.remove("sticky");
    }
  }
  detectActiveSectionOnScroll(): void {
    const sections = [
      { id: 'overview', element: document.getElementById('overview') },
      { id: 'properties', element: document.getElementById('properties') },
      { id: 'aboutProject', element: document.getElementById('aboutProject') },
      { id: 'amenities', element: document.getElementById('amenities') },
      { id: 'project-detail', element: document.getElementById('project-detail') },
      { id: 'locality', element: document.getElementById('locality') },
      { id: 'developer', element: document.getElementById('developer') },
    ];

    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    for (const section of sections) {
      if (section.element) {
        const rect = section.element.getBoundingClientRect();
        const offset = rect.top - navbarHeight - 150; // Adjust this margin as needed

        if (offset <= 0 && rect.bottom > navbarHeight) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }



  validateContactCharInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode !== 32 && charCode < 65 && charCode > 57) ||
      (charCode > 90 && charCode < 97) ||
      charCode > 122
    ) {
      event.preventDefault();
    }
  }

  validateContactNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow numeric characters (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateContactName(event:any)
  {
    const inputValue = event.target.value;
    const companyPattern = /^[a-zA-Z\s]+$/;
    this.nameContactError = !companyPattern.test(inputValue);
  }

  validateContactEmail(event: any) {
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.emailContactError = !emailPattern.test(inputValue);
  }
  validateContactPhoneNumber(event: any) {
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
      this.phoneContactError =true;
    } else {
      this.phoneContactError= false;
      // this.sendOTPToMobile();
    }
  }

  fetchProjectApproveDetails() {
    const projectName : any= this.route.snapshot.paramMap.get('name');
    const projectId : any= this.route.snapshot.paramMap.get('id');

    if (projectName && projectId) {
      this.projectdetailsService
        .getprojectdetail1(projectName,projectId)
        .subscribe(
          (projectData: any) => {
            this.singleprojectData = projectData;
            this.singleproject = this.singleprojectData?.data;
            console.log('singleproject', this.singleproject);

            // Populate gallery albums
            const imageBaseUrl = 'https://realtymart.com/backend/public/images/';

            // Project Photos tab: from 3d_project_images (comma-separated filenames)
            const raw3dImages = this.singleproject?.['3d_project_images'];
            if (typeof raw3dImages === 'string' && raw3dImages.trim()) {
              this.photoAlbum = raw3dImages.split(',').map((f: string) => imageBaseUrl + '3d_project_images/' + f.trim()).filter((u: string) => u !== imageBaseUrl + '3d_project_images/');
            } else if (Array.isArray(raw3dImages)) {
              this.photoAlbum = raw3dImages;
            } else {
              this.photoAlbum = [];
            }

            // Layout Photos tab: from project_floor_plan_3d (already full URLs array)
            const rawFloor3d = this.singleproject?.project_floor_plan_3d;
            this.layoutAlbum = Array.isArray(rawFloor3d) ? rawFloor3d : [];

            // Videos tab
            this.videoAlbum = Array.isArray(this.singleproject?.project_video)
              ? this.singleproject.project_video
              : (this.singleproject?.project_video ? [this.singleproject.project_video] : []);

            // Auto-select first tab that has content
            if (this.photoAlbum.length > 0) this.galleryActiveTab = 'photos';
            else if (this.layoutAlbum.length > 0) this.galleryActiveTab = 'layout';
            else if (this.videoAlbum.length > 0) this.galleryActiveTab = 'video';

            // Populate reviews
            this.projectReviews = Array.isArray(this.singleproject?.project_reviews) ? this.singleproject.project_reviews : [];

            // Set meta tags and title
            this.setMetaTags(this.singleproject.project_meta_title, this.singleproject.project_meta_description, this.singleproject.image);
          },
          (error: any) => {
            console.error('Error fetching project details:', error);
          }
        );
    }
  }
  // meta title
  setMetaTags(title: string, description: string, image: string) {
    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }

  submitFormPhone() {
    // this.nameContactError = false;
    // this.phoneContactError = false;
    // this.emailContactError = false;
    // this.termsContactError = false;

    // if(!this.formDataphone.contactusername) {
    //   this.nameContactError=true;
    // }
    // if(!this.formDataphone.contactuseremail)
    // {
    //   this.emailContactError=true;
    // }
    // if(!this.formDataphone.contactcontact_no)
    // {
    //   this.phoneContactError=true;
    // }
    // if (!this.formDataphone.termsContactAccepted) {
    //   this.termsContactError = true;
    // }
    // if(this.nameContactError || this.phoneContactError || this.emailContactError || this.termsContactError)
    // {
    //   return;
    // }
    this.spinner.show();
    const payload = {
      contact_no :this.formDataphone.contactcontact_no,
      useremail:this.formDataphone.contactuseremail,
      username:this.formDataphone.contactusername,
      project_Id:this.singleproject.id,
      builder_id:'',
      leads_type:'Project',
      leads_for:this.singleproject.property_for,
      receiver_user_id:this.singleproject.user_id,
      countrycode:'',
      request_price:0,
    }
    const token = localStorage.getItem('myrealtylogintoken');
           const headers = new HttpHeaders()
              .set('Authorization', `Bearer ${token}`)
              .set('Accept', 'application/json');
    this.http.post(`${this.apiUrl}storeinquiry`,payload,{headers})
      .subscribe((response: any) => {
        if (response.status === true) {
          this.activityTrackerService.logActivity('Inquiry stored for project','');
        this.toastr.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
        const modalElement = document.getElementById('get-builder');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }
        this.resetContactForm();
      }
      }, (error) => {
        console.error('Error sending data', error);
      });
  }

  resetContactForm() {
    this.formDataphone = {
      contactusername: '',
      contactuseremail: '',
      contactcontact_no: '',
    };
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;
  }

  onTermsChange(event: Event) {
     this.termsError = !(event.target as HTMLInputElement).checked;
  }
  onTermsContactChange(event: Event) {
    this.termsContactError = !(event.target as HTMLInputElement).checked;
  }

  // objectKeys(obj: any): string[] {
  //   return Object.keys(obj);
  // }

  // loadissponsored(): void {
  //   this.sponsorservice.sponsorget()?.subscribe((sponsorData: any) => {
  //     this.sponsorData = sponsorData;
  //     this.sponsor = this.sponsorData?.responseData?.issponsored;
  //   });
  // }

  // loadisverified(): void {
  //   this.verifyservice.verifiedget()?.subscribe((verifyData: any) => {
  //     this.verifyData = verifyData;
  //     this.verify = this.verifyData?.responseData?.isverified;
  //   });
  // }

  submitForm(form: any) {
    this.showOTP = true;
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

  // ===== Brochure Form Methods =====
  sendBrochureOTP() {
    this.brochureNameError = !this.brochureFormData.name?.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.brochureEmailError = !emailPattern.test(this.brochureFormData.email);
    const mobilePattern = /^[0-9]{10}$/;
    this.brochureMobileError = !mobilePattern.test(this.brochureFormData.mobile);
    this.brochureTermsError = !this.brochureFormData.termsAccepted;

    if (this.brochureNameError || this.brochureEmailError || this.brochureMobileError || this.brochureTermsError) return;

    this.spinner.show();
    this.http.post(`${this.apiUrl}genrateinquiryotp`, { contact_no: this.brochureFormData.mobile })
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response.data === 'ok' && response.status === true) {
          this.brochureOtpVisible = true;
          this.toastr.success('OTP sent successfully.');
        } else {
          this.toastr.error('Failed to send OTP.');
        }
      }, () => { this.spinner.hide(); this.toastr.error('Failed to send OTP.'); });
  }

  submitBrochure() {
    if (!this.brochureOtp) { this.brochureOtpError = true; return; }
    this.brochureOtpError = false;
    this.http.post(`${this.apiUrl}verifyinquiryotp`, { contact_no: this.brochureFormData.mobile, otp: this.brochureOtp })
      .subscribe((response: any) => {
        if (response.status === true) {
          const modalEl = document.getElementById('Brochure');
          if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
          this.galleryFormType = ''; // close gallery panel if open
          const pdfUrl = this.singleproject?.project_brochure;
          if (pdfUrl) {
            window.open(pdfUrl, '_blank');
          } else {
            this.toastr.info('Brochure is not available.');
          }
          this.resetBrochureForm();
        } else {
          this.toastr.error('Wrong OTP. Please try again.');
        }
      });
  }

  resetBrochureForm() {
    this.brochureFormData = { name: '', email: '', mobile: '', termsAccepted: false };
    this.brochureOtp = '';
    this.brochureOtpVisible = false;
    this.brochureNameError = false;
    this.brochureEmailError = false;
    this.brochureMobileError = false;
    this.brochureTermsError = false;
    this.brochureOtpError = false;
  }

  // ===== Gallery Inline Contact Form Methods =====
  openGalleryForm(type: string) {
    this.galleryFormType = type;
    if (type === 'contact') {
      this.resetGalleryContactForm();
    } else {
      this.brochureMode = type; // 'brochure' or 'payment'
      this.resetBrochureForm();
    }
  }

  closeGalleryForm() {
    this.galleryFormType = '';
    this.resetGalleryContactForm();
  }

  resetGalleryContactForm() {
    this.galleryContactData = { name: '', email: '', mobile: '', termsAccepted: false };
    this.galleryContactNameErr = false;
    this.galleryContactEmailErr = false;
    this.galleryContactMobileErr = false;
    this.galleryContactTermsErr = false;
    this.galleryContactOtpVisible = false;
    this.galleryContactOtp = '';
    this.galleryContactOtpErr = false;
  }

  sendGalleryContactOTP() {
    this.galleryContactNameErr = !this.galleryContactData.name?.trim();
    const emailPat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.galleryContactEmailErr = !emailPat.test(this.galleryContactData.email);
    const mobilePat = /^[0-9]{10}$/;
    this.galleryContactMobileErr = !mobilePat.test(this.galleryContactData.mobile);
    this.galleryContactTermsErr = !this.galleryContactData.termsAccepted;

    if (this.galleryContactNameErr || this.galleryContactEmailErr || this.galleryContactMobileErr || this.galleryContactTermsErr) return;

    this.spinner.show();
    this.http.post(`${this.apiUrl}genrateinquiryotp`, { contact_no: this.galleryContactData.mobile })
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res?.data === 'ok' && res?.status === true) {
          this.galleryContactOtpVisible = true;
          this.toastr.success('OTP sent successfully.');
        } else {
          this.toastr.error('Failed to send OTP. Please try again.');
        }
      }, () => { this.spinner.hide(); this.toastr.error('Failed to send OTP.'); });
  }

  submitGalleryContact() {
    if (!this.galleryContactOtp?.trim()) { this.galleryContactOtpErr = true; return; }
    this.galleryContactOtpErr = false;

    this.spinner.show();
    this.http.post(`${this.apiUrl}verifyinquiryotp`, { contact_no: this.galleryContactData.mobile, otp: this.galleryContactOtp })
      .subscribe((res: any) => {
        if (res?.status === true) {
          const token = localStorage.getItem('myrealtylogintoken');
          const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json');
          const payload = {
            contact_no: this.galleryContactData.mobile,
            useremail: this.galleryContactData.email,
            username: this.galleryContactData.name,
            project_Id: this.singleproject?.id,
            builder_id: '',
            leads_type: 'Project',
            leads_for: this.singleproject?.property_for,
            receiver_user_id: this.singleproject?.user_id,
            countrycode: '',
            request_price: 0,
          };
          this.http.post(`${this.apiUrl}storeinquiry`, payload, { headers })
            .subscribe((r: any) => {
              this.spinner.hide();
              if (r?.status === true) {
                this.toastr.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
              }
              this.galleryFormType = '';
              this.resetGalleryContactForm();
            }, () => { this.spinner.hide(); this.galleryFormType = ''; this.resetGalleryContactForm(); });
        } else {
          this.spinner.hide();
          this.toastr.error('Wrong OTP. Please try again.');
        }
      }, () => { this.spinner.hide(); this.toastr.error('Something went wrong.'); });
  }

  // ===== Gallery Methods =====
  openGallery(tab: string = 'photos', index: number = 0) {
    // default to first available tab
    if (tab === 'photos' && this.photoAlbum.length === 0) {
      if (this.layoutAlbum.length > 0) tab = 'layout';
      else if (this.videoAlbum.length > 0) tab = 'video';
    }
    this.galleryActiveTab = tab;
    this.galleryActiveIndex = index;
    this.galleryZoom = 1;
    this.galleryFormType = '';
    this.galleryVisible = true;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('gallery-open');
  }

  closeGallery() {
    this.galleryVisible = false;
    this.galleryFormType = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
    document.body.classList.remove('gallery-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }

  setGalleryTab(tab: string) {
    this.galleryActiveTab = tab;
    this.galleryActiveIndex = 0;
    this.galleryZoom = 1;
  }

  setGalleryImage(index: number) {
    this.galleryActiveIndex = index;
    this.galleryZoom = 1;
  }

  nextGalleryImage() {
    if (this.currentAlbum.length === 0) return;
    if (this.galleryActiveIndex < this.currentAlbum.length - 1) {
      this.galleryActiveIndex++;
    } else {
      // auto advance to next tab
      const tabs = this.availableTabs;
      const currentTabIdx = tabs.indexOf(this.galleryActiveTab);
      if (currentTabIdx < tabs.length - 1) {
        this.galleryActiveTab = tabs[currentTabIdx + 1];
        this.galleryActiveIndex = 0;
      } else {
        // wrap to first tab first image
        this.galleryActiveTab = tabs[0];
        this.galleryActiveIndex = 0;
      }
    }
    this.galleryZoom = 1;
  }

  prevGalleryImage() {
    if (this.currentAlbum.length === 0) return;
    if (this.galleryActiveIndex > 0) {
      this.galleryActiveIndex--;
    } else {
      // auto go to previous tab last image
      const tabs = this.availableTabs;
      const currentTabIdx = tabs.indexOf(this.galleryActiveTab);
      if (currentTabIdx > 0) {
        this.galleryActiveTab = tabs[currentTabIdx - 1];
        this.galleryActiveIndex = this.currentAlbum.length - 1;
      } else {
        // wrap to last tab last image
        this.galleryActiveTab = tabs[tabs.length - 1];
        this.galleryActiveIndex = this.currentAlbum.length - 1;
      }
    }
    this.galleryZoom = 1;
  }

  get availableTabs(): string[] {
    const tabs: string[] = [];
    if (this.photoAlbum.length > 0) tabs.push('photos');
    if (this.layoutAlbum.length > 0) tabs.push('layout');
    if (this.videoAlbum.length > 0) tabs.push('video');
    return tabs;
  }

  zoomIn() {
    if (this.galleryZoom < 3) this.galleryZoom = parseFloat((this.galleryZoom + 0.5).toFixed(1));
  }

  zoomOut() {
    if (this.galleryZoom > 1) this.galleryZoom = parseFloat((this.galleryZoom - 0.5).toFixed(1));
  }

  // ===== Review Methods =====
  openReviewModal() {
    const modal = new bootstrap.Modal(document.getElementById('WriteReview'));
    modal.show();
  }

  setReviewRating(n: number) {
    this.reviewFormData.rating = n;
    this.reviewRatingError = false;
  }

  submitReview() {
    this.reviewNameError = !this.reviewFormData.name;
    this.reviewTextError = !this.reviewFormData.review;
    this.reviewRatingError = this.reviewFormData.rating === 0;
    if (this.reviewNameError || this.reviewTextError || this.reviewRatingError) return;

    const payload = {
      project_id: this.singleproject.id,
      name: this.reviewFormData.name,
      review: this.reviewFormData.review,
      rating: this.reviewFormData.rating,
    };
    this.http.post(`${this.apiUrl}storereview`, payload).subscribe(
      (response: any) => {
        if (response.status === true) {
          this.toastr.success('Review submitted successfully!');
          const modalEl = document.getElementById('WriteReview');
          if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
          this.projectReviews.unshift({ ...payload, created_at: new Date().toISOString() });
          this.resetReviewForm();
        }
      },
      (error) => { console.error('Error submitting review', error); }
    );
  }

  resetReviewForm() {
    this.reviewFormData = { name: '', review: '', rating: 0 };
    this.reviewNameError = false;
    this.reviewTextError = false;
    this.reviewRatingError = false;
    this.hoveredReviewRating = 0;
  }
  // toggleShowMore(category: string): void {
  //   this.showMore[category] = !this.showMore[category];
  // }
}
