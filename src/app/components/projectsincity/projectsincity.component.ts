import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ProjectincityService } from '../service/projectincity.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
declare var bootstrap: any;

@Component({
  selector: 'app-projectsincity',
  templateUrl: './projectsincity.component.html',
  styleUrls: ['./projectsincity.component.css'],
  providers: [DatePipe],
})
export class ProjectsincityComponent {
  private apiUrl: string = environment.apiUrl;
  @ViewChild('otpModel') otpModel!: ElementRef;
  projectincityData: any;
  projectincitycount: any;
  projectincity: any[] = [];
  isDropdownOpen: boolean = false;
  original: any[] = [];
  selectedSortOption: string = 'Relevance';
  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent',
  ];
  paginatedData: any[] = []; // Data for the current page
  currentPage: number = 1; // Current page number
  pageSize: number = 5; // Items per page
  totalItems: number = 0; // Total number of items
  itemsPerPage = 5;
  visiblePageStart: number = 1;
  visiblePageCount: number = 5;
  contactData: any;
  contact: any = {
    property_main_img: null,
    property_type: null,
    property_bhk: null,
    project_localities: null,
    minprice: null,
    maxprice: null,
    name: null,
  };
  initialListCount = 5;
  projectToLoad = 5;
  loading: boolean = false;
  scrollTimeout: any;
  isLoading: any;
  lastPage: any;
  singleProp: any;
  proj_id: any;
  is_token: boolean = false;
  formData: any = {
    username: '',
    useremail: '',
    countrycode: 'IN +91',
    contact_no: null,
    property_for: '',
    otp: '',
    termsAccepted: false,
  };
  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  otpError: boolean = false;
  isResendEnabled = false;
  termsError: boolean = false;
  isMobileNumberDisabled: boolean = false;
  openModel = 0;
  city: any;
  remainingTime: number = 60;
  private timer: any;
  isSubmitting = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private projectlistingincityService: ProjectincityService,
    private route: ActivatedRoute,
    private activityTrackerService: ActivityTrackerService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    const cityName = this.route.snapshot.paramMap.get('city');
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
    }
  }

  ngOnInit(): void {
    const city = localStorage.getItem('location');
    this.loadAllBuilders();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const items = document.querySelectorAll('.citiys-planes');
    if (items.length < 20) return;

    const lastVisibleItem = items[items.length - 2];
    if (!lastVisibleItem) return;

    const rect = lastVisibleItem.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && !this.isLoading) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.loadAllBuilders();
      }, 200);
    }
  }

  loadAllBuilders(): void {
    const cityName = this.route.snapshot.paramMap.get('city');

    if (this.isLoading || this.currentPage > this.lastPage) return;

    this.isLoading = true;
    this.loading = true;

    const lastElement = document.querySelectorAll('.citiys-planes');
    const lastItem = lastElement[lastElement.length - 1];
    const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

    this.http
      .get<any>(
        `${environment.apiUrl}projectincity/${cityName}?page=${this.currentPage}`
      )
      .subscribe(
        (response) => {
          const oldScrollY = window.scrollY;

          this.projectincity = this.projectincity || [];
          this.projectincity = [
            ...this.projectincity,
            ...(response.data?.data || []),
          ];
          this.setMetaTags(response.meta.title, response.meta.description);

          this.lastPage = response?.data?.last_page;
          this.projectincitycount = response?.data?.total;

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

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.projectincity.slice(startIndex, endIndex);
  }

  updateTotalItems(): void {
    this.totalItems = this.projectincity.length;
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedData();
    }
    this.updateTotalItems();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
    this.updateTotalItems();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedData();

      // Adjust the visible range dynamically
      if (page < this.visiblePageStart) {
        this.visiblePageStart = Math.max(
          1,
          this.visiblePageStart - this.visiblePageCount
        );
      } else if (page >= this.visiblePageStart + this.visiblePageCount) {
        this.visiblePageStart = Math.min(
          page,
          this.getTotalPages() - this.visiblePageCount + 1
        );
      }
    }
  }
  nextPageGroup(): void {
    const totalPages = this.getTotalPages();
    if (this.visiblePageStart + this.visiblePageCount <= totalPages) {
      this.visiblePageStart += this.visiblePageCount;
    }
  }
  previousPageGroup(): void {
    if (this.visiblePageStart > 1) {
      this.visiblePageStart -= this.visiblePageCount;
    }
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to the first page
    this.updatePaginatedData();
  }
  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const visiblePages: number[] = [];

    const endPage = Math.min(
      this.visiblePageStart + this.visiblePageCount - 1,
      totalPages
    );

    for (let i = this.visiblePageStart; i <= endPage; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  }
  showFirstPage(): boolean {
    return this.currentPage > 3;
  }

  showLastPage(): boolean {
    return this.currentPage < this.getTotalPages() - 2;
  }
  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  private convertToLac(priceString: string): number {
    if (!priceString) return 0;
    let numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '').trim());

    if (priceString.toLowerCase().includes('cr')) {
      numericValue *= 100;
    } else if (priceString.toLowerCase().includes('lac')) {
    } else {
      numericValue = numericValue / 100000;
    }

    return numericValue;
  }

  changeSortOption(option: string): void {
    this.selectedSortOption = option;
    this.isDropdownOpen = false;
    switch (option) {
      case 'Price - Low to High':
        this.projectincity = [
          ...this.projectincity.sort((a, b) => this.sortByPrice(a, b)),
        ];
        break;
      case 'Price - High to Low':
        this.projectincity = [
          ...this.projectincity.sort((a, b) => this.sortByPrice(b, a)),
        ];
        break;
      case 'Most Recent':
        this.projectincity = [
          ...this.projectincity.sort((a, b) => this.sortByRecent(a, b)),
        ];
        break;
      case 'Relevance':
        this.projectincity = [...this.original];
        break;
      default:
        this.projectincity = [...this.original];
        break;
    }
  }
  private sortByPrice(a: any, b: any): number {
    const priceA = this.convertToLac(a.project_maximum_price);
    const priceB = this.convertToLac(b.project_minimum_price);
    return priceA - priceB;
  }

  private sortByRecent(a: any, b: any): number {
    const dateA = new Date(a.projectdetails.created_at).getTime();
    const dateB = new Date(b.projectdetails.created_at).getTime();
    return dateB - dateA;
  }

  private parsePrice(priceString: string): number {
    if (!priceString) return 0;
    let numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '').trim());

    if (priceString.includes('cr')) {
      numericValue *= 100; // Convert crore to lac
    }
    return numericValue;
  }

  contactowner(propertyid: any) {
    this.proj_id = propertyid;
    this.http.get(`${environment.apiUrl}contactowner/${propertyid}`).subscribe(
      (contactData: any) => {
        this.contactData = contactData;
        this.contact = this.contactData?.data;
      },
      (error: any) => {
        // Handle the error as needed
      }
    );
  }

  fetchProperty(property: any) {
    this.singleProp = property;
  }

  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
  }

  submitForm() {
    this.spinner.show();

    const payload = this.contact.property
      ? {
          contact_no: this.formData.contact_no,
          useremail: this.formData.useremail,
          username: this.formData.username,
          project_Id: this.contact?.property?.project_id,
          property_id: this.contact?.property?.property_id,
          builder_id: this.contact?.property?.builder_id,
          agent_id: this.contact?.property?.agent_id,
          receiver_user_id: this.contact?.property?.user_id,
          leads_type: 'Call for Price',
          leads_for: 'Property',
          location: this.city,
        }
      : {
          contact_no: this.formData.contact_no,
          useremail: this.formData.useremail,
          username: this.formData.username,
          project_Id: this.contact?.project?.project_id,
          builder_id: this.contact?.project?.builder_id,
          agent_id: this.contact?.project?.agent_id,
          receiver_user_id: this.contact?.project?.user_id,
          leads_type: 'Call for Price',
          leads_for: 'Project',
          location: this.city,
        };
    const token = localStorage.getItem('myrealtylogintoken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    this.http
      .post(`${environment.apiUrl}storeinquiry`, payload, { headers })
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.activityTrackerService.logActivity(
              `Inquiry stored for ${
                this.contact.property ? 'property' : 'project'
              }`,
              ''
            );
            this.toastr.success('Inquiry Addeded successfully!');
            const modalElement = document.getElementById('contact-owner');
            const modalElementProp =
              document.getElementById('contact-owner-prop');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
            if (modalElementProp) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElementProp);
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
    if (
      this.nameError ||
      this.phoneError ||
      this.emailError ||
      this.termsError
    ) {
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

  resendOTP() {
    clearInterval(this.timer);
    this.startTimer();
  }

  verifyOTP() {
    if (this.formData.otp == '') {
      this.toastr.error('Please Enter OTP');
      return;
    }
    let payload = {
      contact_no: this.formData.contact_no,
      otp: this.formData.otp,
    };

    this.http.post(`${environment.apiUrl}verifyinquiryotp`, payload).subscribe(
      (response: any) => {
        if (response.status == true) {
          this.toastr.success('OTP verified successfully.');
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

  sendOTPToMobile() {
    this.spinner.show();
    this.http
      .post(`${environment.apiUrl}genrateinquiryotp`, {
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
              this.toastr.success('OTP Sent Successfully.');
            }
            if (response.code === 101) {
              this.toastr.warning(response.message);
            }
          } else {
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
}
