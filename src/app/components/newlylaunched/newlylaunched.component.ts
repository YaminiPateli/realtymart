import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import {  HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewlylaunchedService } from '../service/newlylaunched.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Fancybox } from '@fancyapps/ui';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { GeolocationService } from '../service/geolocation.service';
import { Title, Meta } from '@angular/platform-browser';
declare var bootstrap: any;

interface City {
  cid: number;
  cname: string;
}
@Component({
  selector: 'app-newlylaunched',
  templateUrl: './newlylaunched.component.html',
  styleUrls: ['./newlylaunched.component.css']
})
export class NewlylaunchedComponent {
  tooltipVisible = false;
  tooltipPosition = { top: '0px', left: '0px' };
  @ViewChild('otpModel') otpModel!: ElementRef;
  private apiUrl: string = environment.apiUrl;
  newlaunchedPropertyData:any;
  data:any;
  newlauchedproperty:any;
  newlauchedpropertycount:any;
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
    termsAccepted: false};
    paginatedData: any[] = []; // Data for the current page
    currentPage: number = 1; // Current page number
    pageSize: number = 5; // Items per page
    totalItems: number = 0; // Total number of items
    itemsPerPage = 5;
    visiblePageStart: number = 1;
    visiblePageCount: number = 5;
    contact:any;
    contactData:any;
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
    initialListCount = 5;
    propertyToLoad = 5;
    loading:boolean=false;
    checkToken:any;
    scrollTimeout:any;
    isLoading:any;
    lastPage:any;
    is_token:boolean=false;
  // contact: any = {
  //   property_main_img: null,
  //   property_type: null,
  //   property_bhk: null,
  //   project_localities: null,
  //   minprice: null,
  //   maxprice: null,
  //   name: null,
  // };

  city: any;
  city1:City[]=[];
  validcityforselected:any;

  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent'
  ];

  constructor(private titleService: Title, private metaService: Meta, public http: HttpClient, private newpropertyService: NewlylaunchedService, private route: ActivatedRoute,private tost: ToastrService,private elementRef: ElementRef,
    private spinner: NgxSpinnerService,  private activityTrackerService: ActivityTrackerService,  private router: Router, private geolocationService: GeolocationService,) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
  }
  ngOnInit(): void {
    const token = localStorage.getItem('myrealtylogintoken');
    if (token) {
      this.is_token = true;
      this.formData.username = localStorage.getItem('name') || '';
      this.formData.useremail = localStorage.getItem('email') || '';
      this.formData.contact_no = localStorage.getItem('contact_no') || '';
      this.formData.termsAccepted = true;
    }
    setTimeout(() => {
      this.fetchNewLaunchProject();
    }, 1000);
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
  
  fetchNewLaunchProject() : void {
    this.city = localStorage.getItem('location');
  if (this.isLoading || this.currentPage > this.lastPage) return;

    this.isLoading = true;
    this.loading = true;

    const lastElement = document.querySelectorAll('.maching-myproperties');
    const lastItem = lastElement[lastElement.length - 1];
    const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

    this.http
      .get<any>(
        `${environment.apiUrl}newlylaunched/${this.city}?page=${this.currentPage}`
      )
      .subscribe(
        (response) => {
          const oldScrollY = window.scrollY;

          this.newlauchedproperty = this.newlauchedproperty || [];
          this.newlauchedproperty = [
            ...this.newlauchedproperty,
            ...(response.data?.data || []),
          ];
        this.setMetaTags(response.meta.title, response.meta.description,);

          this.lastPage = response?.data?.last_page;          

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
        this.fetchNewLaunchProject();
      }, 200);
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

  trackCustomActivity() {
    this.router.navigate(['property-details/:name/:id']);
    this.router.navigate(['project-details/:name/:id']);
  }
// updatePaginatedData(): void {
//   const startIndex = (this.currentPage - 1) * this.pageSize;
//   const endIndex = startIndex + this.pageSize;
//   this.paginatedData = this.newlauchedproperty.slice(startIndex, endIndex);
// }
// updateTotalItems(): void {
//   this.totalItems = this.newlauchedproperty.length;
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
  changeSortOption(option: string): void {
    this.selectedSortOption = option;
    this.isDropdownOpen = false;
      switch (option) {
        case 'Price - Low to High':
          this.newlauchedproperty = this.newlauchedproperty.sort((a: any, b: any) =>  this.convertToLac(a.total_price) - this.convertToLac(b.total_price));
          break;
        case 'Price - High to Low':
          this.newlauchedproperty = this.newlauchedproperty.sort((a: any, b: any) => this.convertToLac(b.total_price) - this.convertToLac(a.total_price));
          break;
        case 'Most Recent':
          this.newlauchedproperty = this.newlauchedproperty.sort((a: any, b: any) => this.sortByRecent(a, b));
          break;
        case 'Relevance':
          this.newlauchedproperty = [... this.original];
          break;
        default:
          this.newlauchedproperty = [... this.original];
          break;
      }

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


  private sortByPrice(a: any, b: any): number {
    const priceA = this.parsePrice(a.project.project_maximum_price);
    const priceB = this.parsePrice(b.project.project_minimum_price);

    return priceA - priceB;
  }

  private sortByRecent(a: any, b: any): number {
    const dateA = a?.created_at
      ? new Date(a.created_at).getTime()
      : 0;
    const dateB = b?.created_at
      ? new Date(b.created_at).getTime()
      : 0;



    return dateB - dateA;
  }


  filterByPrice(minPrice: number, maxPrice: number): void {
    this.filteredData = this.newlauchedproperty.filter((property: { minprice: string; maxprice: string; }) => {
      const propertyMinPrice = this.parsePrice(property.minprice);
      const propertyMaxPrice = this.parsePrice(property.maxprice);

      return (
        (minPrice === null || propertyMinPrice >= minPrice) &&
        (maxPrice === null || propertyMaxPrice <= maxPrice)
      );
    });
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

  contactowner(propertyid:any){
    this.http
    .get(`${this.apiUrl}contactowner/${propertyid}`)
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
      contact_no :this.formData.contact_no,
      useremail:this.formData.useremail,
      username:this.formData.username,
      // project_Id:this.singleproject.id,
      leads_type:'Property',
      location:this.city
      // leads_for:this.singleproject.property_for,
      // receiver_user_id:this.singleproject.user_id,
      // countrycode:'',
      // request_price:0,
    }
    const token = localStorage.getItem('myrealtylogintoken');
                 const headers = new HttpHeaders()
                   .set('Authorization', `Bearer ${token}`)
                   .set('Accept', 'application/json');
      this.http.post(`${this.apiUrl}storeinquiry`,payload,{headers})
        .subscribe((response: any) => {
          if (response.status === true) {
            this.activityTrackerService.logActivity('Inquiry stored for project','');
            this.tost.success('Inquiry Addeded successfully!');
            const modalElement = document.getElementById('contact-owner');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }
            this.resetForm();
          }
        }, (error) => {
          console.error('Error sending data', error);
        });
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

        this.http
          .post(
            `${this.apiUrl}verifyinquiryotp`,
            this.formData
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

       // Image slider

        slideConfig1 = {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          infinite: true,
          autoplay: true,

        };

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
              navigator.clipboard.writeText(this.propertyLink).then(() =>
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
}
