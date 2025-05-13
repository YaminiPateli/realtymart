import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AgentdetailsService } from '../service/agentdetails.service';
import { AgentpropertyforsellService } from '../service/agentpropertyforsell.service';
import { AgentpropertyforrentService } from '../service/agentpropertyforrent.service';
import { AgentcommercialpropertyforsellService } from '../service/agentcommercialpropertyforsell.service';
import { AgentcommercialpropertyforrentService } from '../service/agentcommercialpropertyforrent.service';
import { CountrycodeService } from '../service/countrycode.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivityTrackerService } from '../service/activitytracker.service';
import { GeolocationService } from '../service/geolocation.service';
declare var bootstrap: any;

interface City {
  cid: number;
  cname: string;
}
@Component({
  selector: 'app-agents-details',
  templateUrl: './agents-details.component.html',
  styleUrls: ['./agents-details.component.css']
})
export class AgentsDetailsComponent implements OnInit {
  @ViewChild('otpContactModel') otpContactModel!: ElementRef;

  private apiUrl = environment.apiUrl;
  singleagent: any;
  singleagentData: any;
  allagent: any;
  allbuildersData: any;
  listbuilder: any;
  agentpropertysellData: any;
  agentpropertyrentData: any;
  residentialagentsell: any;
  residentialagentrent: any;
  agentcommercialpropertysellData: any;
  commercialagentsell: any;
  agentcommercialpropertyrentData: any;
  commercialagentrent: any;
  countrycodeData: any;
  countrcode: any;
  countrycodecount: any;
  contact:any;
  contactData:any;
  selectedRentProperty: string = 'RESIDENTIAL';
  selectedSaleProperty: string = 'RESIDENTIAL';
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
  formDataphone: any = {
    contactusername: '',
    contactuseremail: '',
    contactcountrycode: 'IN +91',
    contactcontact_no: null, 
    contactproperty_for: '',
    contactotp: '',
    termsContactAccepted: false
  };
  is_token:boolean=false;
  isSelected = '';
  checkToken:any;
  city: any;
  city1:City[]=[];
  validcityforselected:any;

  constructor(
    private agentDetailService: AgentdetailsService,
    private propertysell: AgentpropertyforsellService,
    private commercialpropertysell: AgentcommercialpropertyforsellService,
    private propertyrent: AgentpropertyforrentService,
    private commercialpropertyrent: AgentcommercialpropertyforrentService,
    private allcountrycode: CountrycodeService,
    private route: ActivatedRoute,
    private http: HttpClient,
    // private datePipe: DatePipe,
    private location: Location,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private activityTrackerService: ActivityTrackerService,
    private geolocationService: GeolocationService,
  ) {}
  slideConfig1 = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: true,
    arrows: false,
    infinite: true,
    // autoplay: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  ngOnInit(): void {
    this.fetchAgentDetails();
    // this.agentresidentialagentpropertysell();
    // this.agentresidentialpropertyrent();
    // this.agentcommercialagentpropertysell();
    // this.agentcommercialagentpropertyrent();
    this.allcountrycodes();
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
  getKeys(obj: any): string[] {
    return Object.keys(obj);
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
    agent_id:this.singleagent.id,
    username:this.formDataphone.contactusername,
    useremail:this.formDataphone.contactuseremail,
    leads_type:'Agent',
    // leads_for:'',
    receiver_user_id:this.singleagent.user_id,
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
          this.activityTrackerService.logActivity('Inquiry stored for Agent','');
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
          this.phoneContactError=true;
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
  
  getFormattedDate(dateString: string) {
    // return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  fetchAgentDetails() {
    const agentName = this.route.snapshot.paramMap.get('name');

    if (agentName) {
      this.agentDetailService
      .getagentdetail(agentName)
      .subscribe(
        (response: any) => {
          this.singleagentData = response;
          this.singleagent =
          this.singleagentData?.data;
          },
          (error: any) => {
            console.error('Error fetching agent details:', error);
          }
        );
    }
  }

  

  // agentresidentialagentpropertysell() {
  //   const agentId = this.route.snapshot.paramMap.get('name');
    

  //   if (agentId) {
  //     this.propertysell.getagentresidentialpropertysell(parseInt(agentId)).subscribe(
  //       (selldata: any) => {
  //         this.agentpropertysellData = selldata;
  //         this.residentialagentsell = this.agentpropertysellData?.responseData?.agentresidentialpropertysell;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching agent sell details:', error);
  //       }
  //     );
  //   }
  // }

  // agentcommercialagentpropertysell() {
  //   const agentId = this.route.snapshot.paramMap.get('id');

  //   if (agentId) {
  //     this.commercialpropertysell.getagentcommercialpropertysell(parseInt(agentId)).subscribe(
  //       (sellcommercialdata: any) => {
  //         this.agentcommercialpropertysellData = sellcommercialdata;
  //         this.commercialagentsell = this.agentcommercialpropertysellData?.responseData?.agentcommercialpropertysell;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching agent sell details:', error);
  //       }
  //     );
  //   }
  // }

  // agentresidentialpropertyrent() {
  //   const agentId = this.route.snapshot.paramMap.get('id');

  //   if (agentId) {
  //     this.propertyrent.getagentresidentialpropertyrent(parseInt(agentId)).subscribe(
  //       (rentData: any) => {
  //         this.agentpropertyrentData = rentData;
  //         this.residentialagentrent = this.agentpropertyrentData?.data?.rentproperty;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching agent rent details:', error);
  //       }
  //     );
  //   }
  // }

  // agentcommercialagentpropertyrent() {
  //   const agentId = this.route.snapshot.paramMap.get('id');

  //   if (agentId) {
  //     this.commercialpropertyrent.getagentcommercialpropertyrent(parseInt(agentId)).subscribe(
  //       (commercialrentData: any) => {
  //         this.agentcommercialpropertyrentData = commercialrentData;
  //         this.commercialagentrent = this.agentcommercialpropertyrentData?.responseData?.agentcommercialpropertyrent;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching agent rent details:', error);
  //       }
  //     );
  //   }
  // }

  formData: any = {countrycode: 'IN +91',};
  contactowner(propertyid:any){
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

  submitForm() {
    this.http.post(`${this.apiUrl}storenquiry`, this.formData)
      .subscribe((response) => {

        // Reload the current page
        window.location.reload();

      }, (error) => {
        console.error('Error sending data', error);
      });
  }

  allcountrycodes(): void {
    this.allcountrycode.getcountrycode()?.subscribe((countrycodeData: any) => {
      this.countrycodeData = countrycodeData;
      this.countrcode = this.countrycodeData?.responseData?.countrycode;
      this.countrcode[0].selected = true;
    });
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
}
