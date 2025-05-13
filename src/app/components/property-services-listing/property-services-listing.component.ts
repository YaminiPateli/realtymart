import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SinglePropertyService } from '../service/singleproperty.service'; // Corrected import
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { GeolocationService } from '../service/geolocation.service';
import { Title, Meta } from '@angular/platform-browser';
declare var bootstrap: any;

interface City {
  cid: number;
  cname: string;
}
@Component({
  selector: 'app-property-services-listing',
  templateUrl: './property-services-listing.component.html',
  styleUrls: ['./property-services-listing.component.css'],
})
export class PropertyServicesListingComponent implements OnInit {
   @ViewChild('otpModel') otpModel!: ElementRef;
    private apiUrl: string = environment.apiUrl;
  singleproperty: any = [];
  singlepropertybanner: any;
  searchText: string = '';
  usernameError: boolean = false;
  contact_noError: boolean = false;
  useremailError: boolean = false;
  otpError: boolean = false;
  isResendEnabled:boolean = false;
  isMobileNumberDisabled: boolean = false;
  isSubmitting:boolean = false;
  openModel = 0;
  remainingTime: number = 60;
  private timer: any;
  selectedUserId: number | null = null;
  selectedServiceProviderId: number | null = null;
  selectedCompanyId: number | null = null;
  checkToken:any;
  is_token:boolean=false;
  city: any;
  city1: City[] = [];
  validcityforselected: any;
  // google reviews
  placeName: string = '';
  errorMessage: string | null = null;
  reviews: any[] | null = null;
  placeDetails: any = null;
  googleReviews: any;
  googleRatings: { [companyName: string]: number } = {};

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private singlePropertyService: SinglePropertyService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private tost: ToastrService,
    private spinner: NgxSpinnerService,
    private geolocationService: GeolocationService
  ) {
    this.city = localStorage.getItem('location');
    if(this.city == null){
      this.getLocation();
    }
    this.setMetaTags(
      `Property Service Companies in ${this.city}`,
      '',
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

  loadReviews() {
    this.singleproperty.companyListing.forEach((company:any) => {
      this.queryPlaceByName(company.company_name);
    });
  }

   // google reviews
  queryPlaceByName(placeName: string): void {  
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    const request = {
      query: placeName,
      fields: ['place_id', 'name'],
    };

    service.textSearch(request, (results: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const placeId = results[0].place_id;
        this.getPlaceDetails(placeId, placeName);
      } else {
        this.errorMessage = 'Error: Place not found.';
      }
    });
  }

  getPlaceDetails(placeId: string, companyName: string) {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      placeId,
      fields: ['rating'],
    };

    service.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        this.googleRatings[companyName] = place.rating || 0;
      }
    });
  }

  getLocation() {
    const locationCookie = localStorage.getItem('location');
    this.city = locationCookie;

    if (!locationCookie) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.geolocationService.getCity(latitude, longitude).then((city: string) => {
              if (this.isValidCity(city)) {
                this.updateCity(city);
              } else {
                this.updateCity('Ahmedabad');
              }
            }).catch((error: any) => {
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
    } else {
      // If 'location' cookie already exists, delete and set again with current city
      localStorage.removeItem('location');
      localStorage.setItem('location', this.city);
    }
  }

  updateCity(city: string) {
    this.city = city;
    localStorage.setItem('location', city);
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
    this.fetchProductServiceListing();
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

  toTitleCase(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
   

  fetchProductServiceListing() {
    const serviceName = this.route.snapshot.paramMap.get('name');
    if (serviceName) {
      this.singlePropertyService
        .getPropertyServiceListing(serviceName)
        .subscribe(
          (response: any) => {
            this.singleproperty = response.data;
            this.loadReviews();
            if (this.singleproperty?.bannerImage) {
              this.singleproperty.bannerImage =
                this.singleproperty.bannerImage.replace(/ /g, '%20');
            }
          },
          (error: any) => {
            console.error('Error fetching property service listing:', error);
          }
        );
    }
  }

  formData: any = {
    username: '',
    useremail: '',
    contact_no: '',
    otp:''
  };

  submitForm() {
    // this.usernameError = false;
    // this.contact_noError = false;
    // this.useremailError = false;

    // if(!this.formData.username) {
    //   this.usernameError=true;
    // }
    // if(!this.formData.useremail)
    // {
    //   this.useremailError=true;
    // }
    // if(!this.formData.contact_no)
    // {
    //   this.contact_noError=true;
    // }

    // if(this.usernameError || this.contact_noError || this.useremailError)
    // {
    //   return;
    // }
    const payload = {
      user_id: this.selectedUserId,
      sp_id: this.selectedCompanyId,
      ps_id: this.selectedServiceProviderId,
      product_id: '',
      service_id: '',
      name: this.formData.username,
      contact_no: this.formData.contact_no,
      email: this.formData.useremail,
      location:this.city
    };
     const token = localStorage.getItem('myrealtylogintoken');

      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
    this.http
      .post(`${this.apiUrl}spinquiry`, payload,{headers})
      .subscribe(
        (response: any) => {
          if (response.status === true) {
            this.tost.success('Inquiry Addeded successfully!');
            const modalElement = document.getElementById('interior-enquire');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
            if(!token){
              this.resetForm();
            }
          }
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
  }

  setUserId(userId: any,service_pid:any,company_id:any) {
    this.selectedUserId = userId;
    this.selectedServiceProviderId=service_pid;
    this.selectedCompanyId=company_id;
  }

  resetForm() {
    this.formData = {
      username: '',
      useremail: '',
      contact_no: '',
    };
    this.usernameError = false;
    this.contact_noError = false;
    this.useremailError = false;
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
    this.usernameError = !companyPattern.test(inputValue);
  }

  validateEmail(event: any) {
    const inputValue = event.target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    this.useremailError = !emailPattern.test(inputValue);
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
      this.contact_noError = true; // Display error
    } else {
      this.contact_noError = false; // Valid number
      // this.sendOTPToMobile();
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

  sendOTPToMobile() {
    this.spinner.show();
    this.http
      .post(`${this.apiUrl}genratespinquiryotp`, {
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
            this.contact_noError = true;
            // this.tost.error('Invalid Mobile Number.');
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

  openOTPModal() {
    this.usernameError = false;
    this.contact_noError = false;
    this.useremailError = false;

    if(!this.formData.username) {
      this.usernameError=true;
    }
    if(!this.formData.useremail)
    {
      this.useremailError=true;
    }
    if(!this.formData.contact_no)
    {
      this.contact_noError=true;
    }

    if(this.usernameError || this.contact_noError || this.useremailError)
    {
      return;
    }
    this.sendOTPToMobile(); // Call this to send OTP to mobile
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
          `${this.apiUrl}verifyspinquiryotp`,
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

              setTimeout(() => {
                this.spinner.hide();
              }, 1000);
              // if (
              //   this.usernameError||
              //   this.contact_noError ||
              //   this.useremailError
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

  // code for filter
  // filterItems() {
  //   const originalSingleProperty = this.singleproperty;
  //   this.singleproperty = originalSingleProperty.filter((item: string) => {
  //     if (typeof item === 'string' && item.includes(this.searchText)) {
  //       return true;
  //     }
  //     return false;
  //   });
  // }
}
