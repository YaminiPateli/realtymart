import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Fancybox } from '@fancyapps/ui';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { Title, Meta } from '@angular/platform-browser';
declare var bootstrap: any;

interface City {
  cid: number;
  cname: string;
}

@Component({
  selector: 'app-propertytypesrent',
  templateUrl: './propertytypesrent.component.html',
  styleUrls: ['./propertytypesrent.component.css'],
})
export class PropertytypesrentComponent {
  tooltipVisible = false;
  tooltipPosition = { top: '0px', left: '0px' };
  @ViewChild('otpModel') otpModel!: ElementRef;
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  singleProp: any;
  propertytypeData: any;
  propertytypecount: any;
  propertytype: any;
  datacheck: any;
  type: any;
  city: any;
  original: any[] = [];
  filteredData: any[] = [];
  selectedSortOption: string = 'Relevance';
  isDropdownOpen: boolean = false;
  formData: any = {
    username: '', // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    countrycode: 'IN +91', // Initialize with an empty string
    contact_no: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string,
    otp: '',
    termsAccepted: false,
  };
  contact: any;
  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  otpError: boolean = false;
  isResendEnabled = false;
  termsError: boolean = false;
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
  isMobileNumberDisabled: boolean = false;
  openModel = 0;
  remainingTime: number = 60;
  private timer: any;
  isSubmitting = false;
  paginatedData: any[] = []; // Data for the current page
  currentPage: number = 1; // Current page number
  pageSize: number = 5; // Items per page
  totalItems: number = 0; // Total number of items
  itemsPerPage = 5;
  visiblePageStart: number = 1;
  visiblePageCount: number = 5;
  contactData: any;
  checkToken: any;
  is_token: boolean = false;
  // contact: any = {
  //   property_main_img: null,
  //   property_type: null,
  //   property_bhk: null,
  //   project_localities: null,
  //   minprice: null,
  //   maxprice: null,
  //   name: null,
  // };
  url: any;
  dynamicUrl: any;
  scrollTimeout: any;
  isLoading: any;
  lastPage: any;
originalPropertytype: any[] = [];

  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent',
  ];

  initialListCount = 5;
  propertyToLoad = 5;
  loading: boolean = false;
  city1: City[] = [];
  validcityforselected: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private tost: ToastrService,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService,
    private activityTrackerService: ActivityTrackerService,
    private router: Router
  ) {}

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

  capitalizeFirstLetter(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  }

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
      this.formDataphone.contactcontact_no =
        localStorage.getItem('contact_no') || '';
      this.formDataphone.termsContactAccepted = true;
    }
    const modalElement = document.getElementById('getOwner');
    if (modalElement) {
      modalElement.addEventListener('hide.bs.modal', () => {
        this.resetContactForm();
      });
    }
    this.type = this.route.snapshot.paramMap.get('type');
    this.city = this.route.snapshot.paramMap.get('city');
    this.fetchPropertyTypeBuysIn();
  }

  checkLoggedIn() {
    this.checkToken = localStorage.getItem('myrealtylogintoken');
    if (this.checkToken) {
      this.is_token = true;
    } else {
      this.is_token = false;
    }
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
        this.fetchPropertyTypeBuysIn();
      }, 200);
    }
  }

  getUrl(urlPart1: any, urlPart2: any) {
    this.url = window.location.origin;
    const staticpart = '/property-details/';
    this.dynamicUrl = this.url + staticpart + urlPart1 + '/' + urlPart2;
  }

  trackCustomActivity() {
    this.router.navigate(['property-details/:name/:id']);
    this.router.navigate(['project-details/:name/:id']);
  }

  fetchProperty(property: any) {
    console.log(property);
    this.singleProp = property;
  }

  whatsappShare() {
    const link = `https://wa.me/?text=${encodeURIComponent(this.dynamicUrl)}`;
    window.open(link, '_blank');
  }
  fetchPropertyTypeBuysIn() {
    const type = this.route.snapshot.paramMap.get('type');
    const city = this.route.snapshot.paramMap.get('city');
    if (this.isLoading || this.currentPage > this.lastPage) return;

    this.isLoading = true;
    this.loading = true;

    const lastElement = document.querySelectorAll('.maching-myproperties');
    const lastItem = lastElement[lastElement.length - 1];
    const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

    if (type && city) {
      this.http
        .get<any>(
          `${environment.apiUrl}propertytypesrentin/${type}/${city}?page=${this.currentPage}`
        )
        .subscribe(
          (response) => {
            const oldScrollY = window.scrollY;

            this.propertytype = this.propertytype || [];
            this.propertytype = [
              ...this.propertytype,
              ...(response.responseData?.propertytypesrentin?.data || []),
            ];

            this.originalPropertytype = [
              ...this.propertytype,
              ...(response.responseData?.propertytypesrentin?.data || []),
            ];

            this.setMetaTags(response.meta.title, response.meta.description);

            this.lastPage =
              response.responseData?.propertytypesrentin?.last_page;
            this.propertytypecount =
              response.responseData?.propertytypesrentin?.total;

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

  // updatePaginatedData(): void {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedData = this.propertytype.slice(startIndex, endIndex);
  // }
  // updateTotalItems(): void {
  //   this.totalItems = this.propertytype.length;
  // }
  // nextPage(): void {
  //   if (this.currentPage < this.getTotalPages()) {
  //     this.currentPage++;
  //     this.updatePaginatedData();
  //   }
  //   this.updateTotalItems();
  // }

  // previousPage(): void {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.updatePaginatedData();
  //   }
  //   this.updateTotalItems();
  // }

  // getTotalPages(): number {
  //   return Math.ceil(this.totalItems / this.pageSize);
  // }

  // goToPage(page: number): void {
  //   if (page >= 1 && page <= this.getTotalPages()) {
  //     this.currentPage = page;
  //     this.updatePaginatedData();

  //     // Adjust the visible range dynamically
  //     if (page < this.visiblePageStart) {
  //       this.visiblePageStart = Math.max(1, this.visiblePageStart - this.visiblePageCount);
  //     } else if (page >= this.visiblePageStart + this.visiblePageCount) {
  //       this.visiblePageStart = Math.min(page, this.getTotalPages() - this.visiblePageCount + 1);
  //     }
  //   }
  // }
  // nextPageGroup(): void {
  //   const totalPages = this.getTotalPages();
  //   if (this.visiblePageStart + this.visiblePageCount <= totalPages) {
  //     this.visiblePageStart += this.visiblePageCount;
  //   }
  // }
  // previousPageGroup(): void {
  //   if (this.visiblePageStart > 1) {
  //     this.visiblePageStart -= this.visiblePageCount;
  //   }
  // }

  // setPageSize(size: number): void {
  //   this.pageSize = size;
  //   this.currentPage = 1; // Reset to the first page
  //   this.updatePaginatedData();
  // }
  // getVisiblePages(): number[] {
  //   const totalPages = this.getTotalPages();
  //   const visiblePages: number[] = [];

  //   const endPage = Math.min(this.visiblePageStart + this.visiblePageCount - 1, totalPages);

  //   for (let i = this.visiblePageStart; i <= endPage; i++) {
  //     visiblePages.push(i);
  //   }
  //   return visiblePages;
  // }
  // showFirstPage(): boolean {
  //   return this.currentPage > 3;
  // }

  // showLastPage(): boolean {
  //   return this.currentPage < this.getTotalPages() - 2;
  // }
  private convertToLac(priceString: string): number {
    if (!priceString) return 0;

    // Remove non-numeric characters except dot and trim spaces
    let numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '').trim());

    if (priceString.toLowerCase().includes('cr')) {
      numericValue *= 100; // Convert Cr to LAC
    } else if (priceString.toLowerCase().includes('lac')) {
      // Already in LAC, no conversion needed
    } else {
      // Assume numeric values are direct and in the base unit (e.g., thousands)
      numericValue = numericValue / 100000; // Convert to LAC
    }

    return numericValue;
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

  changeSortOption(option: string): void {
    this.selectedSortOption = option;
    this.isDropdownOpen = false;
    switch (option) {
      case 'Price - Low to High':
        this.propertytype = this.propertytype.sort((a: any, b: any) =>
          this.sortByPrice(a, b)
        );
        break;
      case 'Price - High to Low':
        this.propertytype = this.propertytype.sort((a: any, b: any) =>
          this.sortByPrice(b, a)
        );
        break;
      case 'Most Recent':
        this.propertytype = this.propertytype.sort((a: any, b: any) =>
          this.sortByRecent(a, b)
        );
        break;
      case 'Relevance':
          this.propertytype = this.originalPropertytype;
        break;
      default:
        break;
    }
  }

  private sortByPrice(a: any, b: any): number {
    const priceA = this.convertToLac(a.rent_amount);
    const priceB = this.convertToLac(b.rent_amount);

    return priceA - priceB;
  }

  private sortByRecent(a: any, b: any): number {
    const dateA = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b?.created_at ? new Date(b.created_at).getTime() : 0;

    return dateB - dateA;
  }

  filterByPrice(minPrice: number, maxPrice: number): void {
    this.filteredData = this.propertytype.filter(
      (property: { minprice: string; maxprice: string }) => {
        const propertyMinPrice = this.convertToLac(property.minprice);
        const propertyMaxPrice = this.convertToLac(property.maxprice);

        return (
          (minPrice === null || propertyMinPrice >= minPrice) &&
          (maxPrice === null || propertyMaxPrice <= maxPrice)
        );
      }
    );
  }

  private parsePrice(priceString: string): number {
    if (!priceString) return 0;

    let numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '').trim());

    if (priceString.includes('cr')) {
      numericValue *= 100; // Convert crore to lac
    }

    return numericValue;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  contactowner(propertyid: any) {
    this.http.get(`${this.apiUrl}contactowner/${propertyid}`).subscribe(
      (contactData: any) => {
        this.contactData = contactData;
        this.contact = this.contactData?.data;
      },
      (error: any) => {
        // Handle the error as needed
      }
    );
  }

  submitForm() {
    //     this.nameError = false;
    //     this.phoneError = false;
    //     this.emailError = false;
    //     this.termsError = false;

    //  if(!this.formData.username) {
    //     this.nameError=true;
    //   }
    //   if(!this.formData.useremail)
    //   {
    //     this.emailError=true;
    //   }
    //   if(!this.formData.contact_no)
    //   {
    //     this.phoneError=true;
    //   }
    //   if (!this.formData.termsAccepted) {
    //     this.termsError = true;
    //   }

    //   if(this.nameError || this.phoneError || this.emailError || this.termsError)
    //   {
    //     return;
    //   }
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
      // leads_for:this.singleproject.property_for,
      // receiver_user_id:this.singleproject.user_id,
      // countrycode:'',
      // request_price:0,
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
            const modalElement = document.getElementById('contact-owner');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
            this.resetForm();
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
    if (this.formData.otp == '') {
      this.tost.error('Please Enter OTP');
      return;
    }

    this.http.post(`${this.apiUrl}verifyinquiryotp`, this.formData).subscribe(
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
          // else {
          //   this.submitForm();
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
              this.tost.success('OTP Sent Successfully.');
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
    let contactModal = document.getElementById('contact-owner');
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
            const modalElement = document.getElementById('contact-owner');
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
    let contactModal = document.getElementById('getOwner');
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
          if (response.data == 'ok') {
            this.startTimer();
            if (response.status === true) {
              // this.sendOTPToMobile();
              const modalElement = this.otpContactModel.nativeElement;
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
              this.tost.success('OTP Sent Successfully.');
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

  // fancybox for images

  ngAfterViewInit(): void {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // Custom options if needed
    });
  }
  checkDescriptionHeight() {
    throw new Error('Method not implemented.');
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
}
