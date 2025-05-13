import { AfterViewInit, Component, OnInit, HostListener,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExplorelocalitiesService } from '../service/explorelocalities.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { Title, Meta } from '@angular/platform-browser';
declare var bootstrap: any;

@Component({
  selector: 'app-explore-localities',
  templateUrl: './explore-localities.component.html',
  styleUrls: ['./explore-localities.component.css']
})
export class ExploreLocalitiesComponent {
  @ViewChild('otpModel') otpModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  explorelocalitiesData: any;
  explorelocalities: any;
  cookie_location = ''; // Make it public
  all_cookies: any = ''; // Make it public
  locationCookie: any;
  explorelocalitiescountData: any;
  explorelocalitiescount: any;
  latitude: any;
  longitude: any;
  properties:any;
  contactData:any;
  contact: any = {
    property_main_img: null,
    property_type: null,
    property_bhk: null,
    project_localities: null,
    minprice: null,
    maxprice: null,
    name: null,
  };
  paginatedData: any[] = []; // Data for the current page
  currentPage: number = 1; // Current page number
  pageSize: number = 5; // Items per page
  totalItems: number = 0; // Total number of items
  itemsPerPage = 5;
  visiblePageStart: number = 1;
  visiblePageCount: number = 5;
  formData: any = {countrycode: 'IN +91'};
  initialListCount = 5;
  localityToLoad = 5;
  loading:boolean=false;
  nameError:boolean=false;
  emailError:boolean=false;
  phoneError:boolean=false;
  otpError: boolean = false;
  isResendEnabled = false;
  termsError:boolean=false;
  remainingTime: number = 60;
  private timer: any;
  isSubmitting = false;
  isMobileNumberDisabled: boolean = false;
  checkToken:any;
  isLoading:any;
  scrollTimeout:any;
  lastPage:any;
  explorelocalitiesCount:any;
  is_token:boolean=false;
  proj_id:any;
  singleProp:any;
  city:any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private activityTrackerService: ActivityTrackerService,
    private explorelocalitiesService: ExplorelocalitiesService,
    private elementRef: ElementRef,
    private spinner: NgxSpinnerService,
    private tost: ToastrService,
  ) {
    setTimeout(() => {
    this.loadExploreLocalities();
    this.city = localStorage.getItem('location');
    }, 1000);
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
    }
  }

    @HostListener('window:scroll', [])
    onScroll(): void {
      const items = document.querySelectorAll('.localiti-box');
      if (items.length < 20) return;

      const lastVisibleItem = items[items.length - 2];
      if (!lastVisibleItem) return;

      const rect = lastVisibleItem.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && !this.isLoading) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.loadExploreLocalities();
        }, 200);
      }
    }

    loadExploreLocalities() {
      const city = localStorage.getItem('location');
      // const city = locationCookie || 'Ahmedabad';
      if (this.isLoading || this.currentPage > this.lastPage) return;

      this.isLoading = true;
      this.loading = true;

      const lastElement = document.querySelectorAll('.localiti-box');
      const lastItem = lastElement[lastElement.length - 1];
      const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

      this.http
        .get<any>(
          `${environment.apiUrl}propertieslocalities/${city}?page=${this.currentPage}`
        )
        .subscribe(
          (response) => {
            const oldScrollY = window.scrollY;

            this.explorelocalities = this.explorelocalities || [];
            this.explorelocalities = [
              ...this.explorelocalities,
              ...(response.data?.data || []),
            ];

            this.setMetaTags(
              response.meta.title,
              response.meta.description,
            );

            this.lastPage = response?.data?.last_page;          
            this.explorelocalitiesCount = response?.data?.total;          

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
    this.metaService.updateTag({ property: 'og:description', content: description, });
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
  //   this.paginatedData = this.explorelocalities.slice(startIndex, endIndex);
  // }
  // updateTotalItems(): void {
  //   this.totalItems = this.explorelocalities.length;
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

  contactowner(propertyid:any){
    this.proj_id = propertyid;
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

    fetchProperty(property:any){
      this.singleProp= property;
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
              this.tost.success('OTP sent successfully.');
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

  startTimer() {
    this.isResendEnabled = false;
    this.remainingTime = 60;
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timer);
        this.isResendEnabled = true;
      }
    }, 1000);
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
  resendOTP() {
    if (this.isResendEnabled) {
      this.sendOTPToMobile(); // Logic to send OTP
      this.startTimer(); // Restart the timer after resending OTP
    }
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
  onTermsChange(event: Event) {
    this.termsError = !(event.target as HTMLInputElement).checked;
  }
}
