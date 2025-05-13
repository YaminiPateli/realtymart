import { Component, NgModule, OnInit } from '@angular/core';
import { ProjectdetailsService } from '../service/projectdetails.service';
import { IssponsoredService } from '../service/issponsored.service';
import { IsverifiedService } from '../service/isverified.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})

export class ProjectdetailsComponent {
  private apiUrl = environment.apiUrl;
  singleproject: any;
  singleprojectData: any;
  sponsorData: any;
  sponsor: any;
  verifyData: any;
  verify: any;
  formData = {
    username: '',  // Initialize with an empty string
    useremail: '', // Initialize with an empty string
    countrycode: '', // Initialize with an empty string
    phone_number: null, // Initialize with null or a default number
    property_for: '', // Initialize with an empty string
  };


  constructor(
    private projectDetailService: ProjectdetailsService,
    private route: ActivatedRoute,// Inject ActivatedRoute here
    private http: HttpClient,
    private sponsorservice: IssponsoredService,
    private verifyservice: IsverifiedService,
    private location: Location,
    private toastr: ToastrModule
  ) {}

  ngOnInit(): void {
    this.fetchPropertyDetails();
    // this.loadissponsored();
    // this.loadisverified();
  }

  fetchPropertyDetails() {

    const projectName = this.route.snapshot.paramMap.get('name');
    const projectId = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');
    if (projectName && projectId && type) {
      this.projectDetailService
        .getprojectdetail(projectName, parseInt(projectId),parseInt(type))
        .subscribe(
          (projectData: any) => {
            this.singleprojectData = projectData;
            this.singleproject = this.singleprojectData?.responseData;
          },
          (error: any) => {
            console.error('Error fetching property details:', error);
          }
        );
    }
  }


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



  submitForm() {
    this.http.post(`${this.apiUrl}storenquiry`, this.formData)
      .subscribe(
        (response: any) => {
          if (response.responseData === 'success') {
            // setTimeout(() => {
            //   this.toastr.success('Enquiry Submitted Successfully.');
            // }, 10);
          }
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
  }

    //-------------------------------//
  //Featured Projects Slider //
  //-------------------------------//

  slideConfig1 = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": false,
    "arrows": false,
    "infinite": true,
    "autoplay":true,

    "responsive": [
      {
        breakpoint: 1365,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        'breakpoint': 480,
        'settings': {
          'slidesToShow': 1,
          'slidesToScroll': 1
        }
      }
    ]
  };



}
