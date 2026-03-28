import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Fancybox } from '@fancyapps/ui';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { Router,NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
declare var bootstrap: any;
import { filter } from 'rxjs/operators';

interface City {
  cid: number;
  cname: string;
}

@Component({
  selector: 'app-ownerproperty',
  templateUrl: './ownerproperty.component.html',
  styleUrls: ['./ownerproperty.component.css'],
})
export class OwnerpropertyComponent {
  tooltipVisible = false;
  tooltipPosition = { top: '0px', left: '0px' };
  @ViewChild('otpModel') otpModel!: ElementRef;
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  cityss: any;
  currentPage: number = 1;
  lastPage: number = 1;
  isLoading: boolean = false;
  scrollTimeout: any;
  formData: any = {
    username: '', // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    countrycode: 'IN +91', // Initialize with an empty string
    contact_no: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string,
    otp: '',
    termsAccepted: false,
  };
  formDataphone: any = {
    contactusername: '',
    contactuseremail: '',
    contactcontact_no: null,
    contactproperty_for: '',
    contactotp: '',
    termsContactAccepted: false,
  };
  nameContactError: boolean = false;
  emailContactError: boolean = false;
  phoneContactError: boolean = false;
  termsContactError: boolean = false;
  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  otpError: boolean = false;
  isResendEnabled = false;
  termsError: boolean = false;
  isMobileNumberDisabled: boolean = false;
  openModel = 0;
  remainingTime: number = 60;
  private timer: any;
  ownerPropertyData: any;
  ownerlauchedproperty: any;
  ownerlauchedpropertycount: any;
  contactData: any;
  contact: any;
  paginatedData: any[] = []; // Data for the current page
  // currentPage: number = 1; // Current page number
  pageSize: number = 5; // Items per page
  totalItems: number = 0; // Total number of items
  itemsPerPage = 5;
  visiblePageStart: number = 1;
  visiblePageCount: number = 5;

  isSubmitting = false;
  url: any;
  dynamicUrl: any;
  singleProp: any;
  initialListCount = 10;
  propertyToLoad = 10;
  loading: boolean = false;
  checkDescriptionHeight: any;
  images: any;
  checkToken: any;
  is_token: boolean = false;
  city: any;
  city1: City[] = [];
  validcityforselected: any;
    breadcrumbs: { label: string, url: string }[] = [];


  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private elementRef: ElementRef,
    private tost: ToastrService,
    private spinner: NgxSpinnerService,
    private activityTrackerService: ActivityTrackerService,
    private router: Router
  ) {
    setTimeout(() => {
      this.loadProperties();
    }, 1000);
  }

  trackCustomActivity() {
    this.router.navigate(['property-details/:name/:id']);
  }

  loadProperties() {
    this.cityss = localStorage.getItem('location');
    if (this.isLoading || this.currentPage > this.lastPage) return;

    this.isLoading = true;
    this.loading = true;

    const lastElement = document.querySelectorAll('.maching-myproperties');
    const lastItem = lastElement[lastElement.length - 1];
    const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

    this.http
      .get<any>(
        `${environment.apiUrl}isownerproperty/sell/${this.cityss}?page=${this.currentPage}`
      )
      .subscribe(
        (response) => {
          const oldScrollY = window.scrollY;

          this.ownerlauchedproperty = this.ownerlauchedproperty || [];
          this.ownerlauchedproperty = [
            ...this.ownerlauchedproperty,
            ...(response.responseData.isownerproperty?.data || []),
          ];
          this.setMetaTags(
            response.responseData.meta.title,
            response.responseData.meta.description
          );

          this.lastPage = response.responseData?.isownerproperty?.last_page;

          this.currentPage++;
          this.isLoading = false;
          this.loading = false;

          setTimeout(() => {
            if (lastItem) {
              const newOffset = lastItem.getBoundingClientRect().top;
              window.scrollTo(0, oldScrollY + (newOffset - lastItemOffset));
            }
          }, 100);
        },
        (error) => {
          console.error('Error fetching properties:', error);
          this.isLoading = false;
          this.loading = false;
        }
      );
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    const items = document.querySelectorAll('.maching-myproperties');
    if (items.length < 20) return;

    const lastVisibleItem = items[items.length - 2];
    if (!lastVisibleItem) return;

    const rect = lastVisibleItem.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && !this.isLoading) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.loadProperties();
      }, 200);
    }
  }

  openGallery(images: string[], event: Event) {
    event.preventDefault(); // Prevents default anchor behavior

    Fancybox.show(
      images.map((img) => ({
        src: img,
        type: 'image',
      })),
      {
        // loop: true, // Enable looping
        // toolbar: true // Show toolbar
      }
    );
  }

  ngOnInit() {
   this.generateBreadcrumbs(this.router.url);
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
      this.formDataphone.contactusername = localStorage.getItem('name') || '';
      this.formDataphone.contactuseremail = localStorage.getItem('email') || '';
      this.formDataphone.contactcontact_no =
        localStorage.getItem('contact_no') || '';
      this.formDataphone.termsContactAccepted = true;
    }
  }
  generateBreadcrumbs(url: string) {
  console.log("Current URL:", url);

  const cleanUrl = url.split('?')[0];
  const urlSegments = cleanUrl.split('/').filter(segment => segment);

  let accumulatedUrl = '';
  this.breadcrumbs = urlSegments.map(segment => {
    accumulatedUrl += '/' + segment;
    return {
      label: this.formatLabel(segment),
      url: accumulatedUrl
    };
  });
}
  scrollToElement(element: Element) {
    const elementRect = element.getBoundingClientRect(); // Element's position relative to the viewport
    const absoluteElementTop = elementRect.top + window.scrollY; // Element's absolute position in the document
    const offset = 100; // Add an optional offset (e.g., for sticky headers)

    window.scrollTo({
      top: absoluteElementTop - offset,
      behavior: 'smooth',
    });
  }

  checkLoggedIn() {
    this.checkToken = localStorage.getItem('myrealtylogintoken');
    if (this.checkToken) {
      this.is_token = true;
    } else {
      this.is_token = false;
    }
  }
 
  contactowner(propertyid: any) {
    this.http.get(`${this.apiUrl}contactowner/${propertyid}`).subscribe(
      (contactData: any) => {
        this.contactData = contactData;
        this.contact = this.contactData?.data;
      },
      (error: any) => {}
    );
  }
  submitForm() {
    
    this.spinner.show();
    const payload = {
      contact_no: this.formData.contact_no,
      useremail: this.formData.useremail,
      username: this.formData.username,
      project_Id: this.contact?.property?.project_id,
      property_id: this.contact?.property?.property_id,
      builder_id: this.contact?.property?.builder_id,
      agent_id: this.contact?.property?.agent_id,
      receiver_user_id: this.contact?.property?.user_id,
      leads_type: 'contact-owner',
      leads_for: 'Property',
      location: this.city,
    
    };
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http
      .post(`${this.apiUrl}storeinquiry`, payload, { headers })
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.activityTrackerService.logActivity(
              'Inquiry stored for property',
              ''
            );
            this.tost.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
            // const elementToClick = this.elementRef.nativeElement.querySelector('#contactownerbuttonclose');
            const modalElement = document.getElementById('contect-owner');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
            // this.resetForm();
          }
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
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

  validateName(event: any) {
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
      !validFormatPattern.test(inputValue) || // Check if it's 10 digits
      !allIdenticalPattern.test(inputValue) || // Reject if all identical digits
      sequentialPattern.test(inputValue) || // Reject if sequential
      mirroredPattern.test(inputValue) // Reject if mirrored/palindromic
    ) {
      this.phoneError = true; // Display error
    } else {
      this.phoneError = false; // Valid number
      // this.sendOTPToMobile();
    }
  }

  resendOTP() {
    if (this.isResendEnabled) {
      this.sendOTPToMobile(); // Logic to send OTP
      this.startTimer(); // Restart the timer after resending OTP
    }
  }

  verifyOTP() {
    console.log(this.formData.contact_no, 'this.formData.contact_no');
    if (this.formData.otp == '') {
      this.tost.error('Please Enter OTP');
      return;
    }
    let payload = {
      contact_no: this.formData.contact_no,
      otp: this.formData.otp,
    };

    this.http.post(`${this.apiUrl}verifyinquiryotp`, payload).subscribe(
      (response: any) => {
        if (response.status == true) {
          // this.tost.success('OTP verified successfully.');
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
          setTimeout(() => {
            this.spinner.hide();
          }, 1000); // Adjust the delay as needed
         

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
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
        this.isResendEnabled = true;
      }
    }, 700);
  }
  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
  }

  sendOTPToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formData.contact_no,
      })
      .subscribe(
        (response: any) => {
          if (response.data == 'ok') {
            this.startTimer();
            if (response.status === true) {
              // this.sendOTPToMobile();
              const modalElement = this.otpModel.nativeElement;
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
              this.tost.success('OTP sent successfully.');
            }
            if (response.code === 101) {
              this.tost.warning(response.message);
            }
          } else {
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
      contact_no: '',
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

    if (
      this.nameError ||
      this.phoneError ||
      this.emailError ||
      this.termsError
    ) {
      return;
    }
    this.sendOTPToMobile(); // Call this to send OTP to mobile

    let contactModal = document.getElementById('contect-owner');
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

  fetchProperty(property: any) {
    console.log(property);
    this.singleProp = property;
  }

  submitFormPhone() {
    
    this.spinner.show();
    const payload = {
      contact_no: this.formDataphone.contactcontact_no,
      useremail: this.formDataphone.contactuseremail,
      username: this.formDataphone.contactusername,
      receiver_user_id: this.singleProp.user_id,
      project_Id: this.singleProp.project_id,
      propertyid: this.singleProp.id,
      builder_id: this.singleProp.builder_id,
      agent_id: this.singleProp.agent_id,
      leads_type: 'call for price',
      leads_for: 'Property',
      location: this.city,
    };
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    this.http
      .post(`${this.apiUrl}storeinquiry`, payload, { headers })
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.activityTrackerService.logActivity(
              'Inquiry stored for property',
              ''
            );
            this.tost.success('We have received your inquiry. Our team will get back to you within 24 working hours.');
            const modalElement = document.getElementById('get-owner');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
            this.resetContactForm();
          }
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
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

  validateContactName(event: any) {
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
      !validFormatPattern.test(inputValue) || // Check if it's 10 digits
      !allIdenticalPattern.test(inputValue) || // Reject if all identical digits
      sequentialPattern.test(inputValue) || // Reject if sequential
      mirroredPattern.test(inputValue) // Reject if mirrored/palindromic
    ) {
      this.phoneContactError = true;
    } else {
      this.phoneContactError = false;
      // this.sendOTPToMobile();
    }
  }

  openContactOTPModal() {
    this.nameContactError = false;
    this.phoneContactError = false;
    this.emailContactError = false;
    this.termsContactError = false;

    if (!this.formDataphone.contactusername) {
      this.nameContactError = true;
    }
    if (!this.formDataphone.contactuseremail) {
      this.emailContactError = true;
    }
    if (!this.formDataphone.contactcontact_no) {
      this.phoneContactError = true;
    }
    if (!this.formDataphone.termsContactAccepted) {
      this.termsContactError = true;
    }
    if (
      this.nameContactError ||
      this.phoneContactError ||
      this.emailContactError ||
      this.termsContactError
    ) {
      return;
    }
    this.sendOTPContactToMobile();

    let contactModal = document.getElementById('get-owner');
    let otpModal = document.getElementById('otpContactModel');

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
    if (this.isResendEnabled) {
      this.sendOTPContactToMobile();
      this.startTimer();
    }
  }

  sendOTPContactToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genrateinquiryotp`, {
        contact_no: this.formDataphone.contactcontact_no,
      })
      .subscribe(
        (response: any) => {
          if (response.data == 'ok') {
            this.startTimer();
            if (response.status === true) {
              // this.sendOTPToMobile();
              const modalElement = this.otpContactModel.nativeElement;
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
              this.tost.success('OTP sent successfully.');
            }
            if (response.code === 101) {
              this.tost.warning(response.message);
            }
          } else {
            this.phoneContactError = true;
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

  verifyContactOTP() {
    if (this.formDataphone.contactotp == '') {
      this.tost.error('Please Enter OTP');
      return;
    }
    let payload = {
      contact_no: this.formDataphone.contactcontact_no,
      otp: this.formDataphone.contactotp,
    };
    this.http.post(`${this.apiUrl}verifyinquiryotp`, payload).subscribe(
      (response: any) => {
        if (response.status == true) {
          // this.tost.success('OTP verified successfully.');
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

          setTimeout(() => {
            this.spinner.hide();
          }, 1000); // Adjust the delay as needed
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

  getUrl(urlPart1: any, urlPart2: any) {
    this.url = window.location.origin;
    const staticpart = '/property-details/';
    this.dynamicUrl = this.url + staticpart + urlPart1 + '/' + urlPart2;
    // console.log(this.dynamicUrl);
  }

  fetchCities() {
    this.http
      .get<{ data: { id: number; name: string }[] }>(
        `${environment.apiUrl}cities`
      )
      .subscribe(
        (response: any) => {
          this.city1 = response.responseData.map((city: any) => ({
            cid: city.id,
            cname: city.name,
          }));
          this.validcityforselected = response.validCities;
          const defaultCity = this.city1.find(
            (city) => city.cname === this.city
          );
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
    this.cityss = city;
    localStorage.setItem('location', city);
  }

  whatsappShare() {
    const link = `https://wa.me/?text=${encodeURIComponent(this.dynamicUrl)}`;
    window.open(link, '_blank');
  }
  // fancybox for images

  ngAfterViewInit(): void {
   
    const fancyboxOptions = {
      Toolbar: false, // Fancybox v4 uses uppercase `Toolbar`
      infinite: true, // Instead of `loop`, use `infinite`
    };

    Fancybox.bind("[data-fancybox='gallery']", fancyboxOptions);
  }

  // Share and copy link
  @Input() propertyLink: string = '';
  copyLink(event: MouseEvent) {
    navigator.clipboard.writeText(this.dynamicUrl).then(
      () => {
        this.showTooltip(event);
      },
      (err) => {
        console.log('failed copy');
      }
    );
  }

  twitterShare() {
    const text = encodeURIComponent('Check this out!');
    const url = encodeURIComponent(this.dynamicUrl);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank');
  }

  facebookShare() {
    const url = encodeURIComponent(this.dynamicUrl);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank');
  }

  emailShare() {
    const subject = encodeURIComponent('Check this out');
    const body = encodeURIComponent(
      `Here is something interesting: ${this.dynamicUrl}`
    );
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
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

  // Image slider

  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    // dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
  };

 
  formatLabel(segment: string): string {
    return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
