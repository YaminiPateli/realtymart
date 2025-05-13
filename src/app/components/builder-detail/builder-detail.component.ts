import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BuilderdetailsService } from '../service/builderdetails.service';
import { AllcitiesService } from '../service/allcities.service';
import { AllpropertytypeService } from '../service/allpropertytype.service';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { FormGroup, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Fancybox } from "@fancyapps/ui";
import { TopbuildersService } from '../service/topbuilders.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Title,Meta } from '@angular/platform-browser';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { GeolocationService } from '../service/geolocation.service';
declare var bootstrap: any;

interface City {
  cid: number;
  cname: string;
}
@Component({
  selector: 'app-builder-detail',
  templateUrl: './builder-detail.component.html',
  styleUrls: ['./builder-detail.component.css']
})
export class BuilderDetailComponent implements OnInit {
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;
  activeTab: string = 'ongoing';
  private apiUrl: string = environment.apiUrl;
  running_projectsData:any;
  allbuildersData: any;
  allbuilders: any;
  listbuilder: any = {};
  allcitiesData: any;
  allcities: any;
  allpropertytypeData: any;
  allpropertytype: any;
  completedproject: any;
  completedprojectData: any;
  builderprojectData:any;
  builderproject: any;
  searchpricetrendsdata: any;
  builderDetail:any;
  locationCookie: any;
  topbuilderData: any;
  topbuilders: any;
  dates: any;
  prices: any;
  nameContactError:boolean=false;
  emailContactError:boolean=false;
  phoneContactError:boolean=false;
  termsContactError:boolean=false;
  otpError: boolean = false;
  isResendEnabled = false;
  isMobileNumberDisabled: boolean = false; 
  isSubmitting = false;
  remainingTime: number = 60;
  private timer: any;
  public chart: any;
  completed_project:any;
  filteredRunningProjects: any[] = [];
  filteredCompletedProjects: any[] = [];
  myForm!: FormGroup;
  formData = {
    city: 'All Cities',
    projecttype: 'Project Type',
    status: 'Status',
    builderid: this.route.snapshot.paramMap.get('id'),
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
  city: any;
  city1:City[]=[];
  validcityforselected:any;

  cmprj = {
    city: 'All Cities',
    projecttype: 'Project Type',
    builderid: this.route.snapshot.paramMap.get('id'),
  };

  pricetrend = {
    city: 'All Cities',
    projectsname: 'Projects',
    builderid: this.route.snapshot.paramMap.get('id'),
  };

  is_token:boolean=false;
  checkToken:any;

  activeSection: string | undefined ='overview';
  constructor(
    public http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    private topbuildersService: TopbuildersService,
    private builderDetailService: BuilderdetailsService,
    private allcityService: AllcitiesService,
    private allpropertytypeService: AllpropertytypeService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activityTrackerService: ActivityTrackerService,
     private geolocationService: GeolocationService,
    // private modalElement: HTMLElement | null = null;
  ) {
    const builderId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.locationCookie = localStorage.getItem('location');
    this.fetchBuilderDetail();
    this.loadAllCities();
    this.loadAllPropertyType();
    this.loadTopBuilders();
    const modalElement = document.getElementById('get-builder');
  if (modalElement) {
    modalElement.addEventListener('hide.bs.modal', () => {
      this.resetContactForm();
    });
  }
  const token = localStorage.getItem('myrealtylogintoken');
  if (token) {
    this.is_token = true;
    this.formDataphone.contactusername = localStorage.getItem('name') || '';
    this.formDataphone.contactuseremail = localStorage.getItem('email') || '';
    this.formDataphone.contactcontact_no = localStorage.getItem('contact_no') || '';
    this.formDataphone.termsContactAccepted = true;
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
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.filterProjects();
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

  fetchBuilderDetail(): void {
    const builderDetailsId = this.route.snapshot.paramMap.get('id');
    // const builderDetailName = this.route.snapshot.paramMap.get('name');
    if (builderDetailsId) {
    this.builderDetailService.getsinglebuilderdetail(builderDetailsId).subscribe(
      (res:any) => {
        this.builderDetail = res.data;
        this.setMetaTags(this.builderDetail.meta_title, this.builderDetail.meta_description , this.builderDetail.builder_logo);
        this.filteredRunningProjects = [...this.builderDetail.runningproject];
        this.filteredCompletedProjects = [...this.builderDetail.completedproject];
      },
      (error: any) => {
        console.error('Error fetching all builders:', error);
      }
    );
  }
  }

  onSearch(): void {
    this.filterProjects();
  }

  // Filter projects based on city and project type
  filterProjects(): void {
    const { city, projecttype } = this.formData;

    if (this.builderDetail) {
      this.filteredRunningProjects = this.builderDetail.runningproject.filter(
        (project:any) =>
          (city === 'All Cities' || project.project_city === city) &&
          (projecttype === 'Project Type' || project.project_type.includes(projecttype))
      );

      this.filteredCompletedProjects = this.builderDetail.completedproject.filter(
        (project:any) => 
           (city === 'All Cities' || project.project_city === city) &&
        (projecttype === 'Project Type' || project.project_type.includes(projecttype))
        
        );
    }
  }

  loadAllCities() : void{
    this.allcityService.getallcities()?.subscribe((data:any) => {
      this.allcitiesData = data;
      this.allcities = this.allcitiesData?.responseData?.allcities;
    });
  }

  loadAllPropertyType() : void{
    this.allpropertytypeService.getallpropertytype()?.subscribe((data:any) => {
      this.allpropertytypeData = data;
      this.allpropertytype = this.allpropertytypeData?.responseData?.allPropertytype;
    });
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
    contact_no:this.formDataphone.contactcontact_no,
    builder_id:this.builderDetail.id,
    username:this.formDataphone.contactusername,
    useremail:this.formDataphone.contactuseremail,
    leads_type:'builder',
    // leads_for:'',
    receiver_user_id:this.builderDetail.user_id,
    location:this.city,
      // contact_no :this.formDataphone.contactcontact_no,
      // useremail:this.formDataphone.contactuseremail,
      // username:this.formDataphone.contactusername
    }
   const token = localStorage.getItem('myrealtylogintoken');
      
         const headers = new HttpHeaders()
           .set('Authorization', `Bearer ${token}`)
           .set('Accept', 'application/json');
    this.http.post(`${this.apiUrl}storeinquiry`,payload,{headers})
      .subscribe((response: any) => {
        if (response.status === true) {
          this.activityTrackerService.logActivity('Inquiry stored for Builder','');
        this.toastr.success('Inquiry Addeded successfully!');
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

  onTermsContactChange(event: Event) {
    this.termsContactError = !(event.target as HTMLInputElement).checked;
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
    if (this.phoneContactError) {
      return; 
    }
    this.sendOTPContactToMobile(); 

    let contactModal = document.getElementById('get-builder');
    let otpModal = document.getElementById('#otpContactModel');

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

  resendContactOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }

  sendOTPContactToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formDataphone.contactcontact_no,
      })
      .subscribe(
        (response: any) => {
          if(response.data =='ok') {
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
          this.phoneContactError= true;
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
            this.toastr.success('OTP verified successfully.');
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
  
    fetchCities() {
      this.http.get<{ data: { id: number; name: string }[] }>(`${environment.apiUrl}cities`).subscribe(
        (response: any) => {
          this.city1 = response.responseData.map((city: any) => ({
            cid: city.id,
            cname: city.name
          }));
          this.validcityforselected = response.validCities;
          const defaultCity = this.city1.find(city => city.cname === this.city);
        },
        (error: any) => {
          console.error('API Error:', error);
        }
      );
    }

  isValidCity(city: string): boolean {
    return this.validcityforselected.includes(city);
  }

  updateCity(city: string) {
    this.city = city;
    localStorage.setItem('location', city);
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

  pricetrends() {
    this.http.post(`${this.apiUrl}searchpricetrendsbuilderprofile`, this.pricetrend)
      .subscribe((response: any) => {
        this.searchpricetrendsdata = response;
        this.dates = this.searchpricetrendsdata?.responseData?.dates;
        this.prices = this.searchpricetrendsdata?.responseData?.prices;

        // Update the chart data
        this.chart.data.labels = this.dates.split(', '); // Split dates into an array
        this.chart.data.datasets[0].data = this.prices.split(', '); // Split prices into an array
        this.chart.update(); // Update the chart
      }, (error: any) => {
        console.error('Error sending data', error);
      });
  }

  // createChart() {
  //   this.chart = new Chart("MyChart", {
  //     type: 'line',
  //     data: {
  //       labels: [], // Initially empty
  //       datasets: [
  //         {
  //           label: "Price Trends",
  //           data: [],
  //           backgroundColor: 'blue'
  //         }
  //       ]
  //     },
  //     options: {
  //       aspectRatio: 1.7
  //     }
  //   });
  // }


  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
  };

  // Awards slider 

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
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };
// project slider
  slideConfig3 = {
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,

   
    responsive: [
      {
        breakpoint: 520,  // Max width 1024px
        settings: {
          slidesToShow: 1,
        }
      },
    ],
  };

  slideConfig5 = {
    slidesToShow: 2,
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
  ngAfterViewInit() {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // Custom options if needed
    });
  }

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
}
