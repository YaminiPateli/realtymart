import { Component, OnInit } from '@angular/core';
import { PropertydetailsService } from '../../service/propertydetails.service';
import { IsverifiedService } from '../../service/isverified.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buy-detail',
  templateUrl: './buy-detail.component.html',
  styleUrls: ['./buy-detail.component.css']
})
export class BuyDetailComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  formData = {
    user_id: 5, // Initialize with appropriate default value
    property_id: 0, // Initialize with appropriate default value
  };

  singleproperty: any;
  singlepropertyData: any;
  verifyData: any;
  verify: any;

  constructor(
    private propertyDetailService: PropertydetailsService,
    private verifyservice: IsverifiedService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fetchPropertyDetails();
    this.loadisverified();
  }

  fetchPropertyDetails() {
    const propertyName = this.route.snapshot.paramMap.get('name');
    const propertyId = this.route.snapshot.paramMap.get('id');

    if (propertyName && propertyId) {
      this.propertyDetailService
        .getpropertydetail(propertyName, parseInt(propertyId))
        .subscribe(
          (propertyData: any) => {
            this.singlepropertyData = propertyData;
            this.singleproperty = this.singlepropertyData?.responseData;


          },
          (error: any) => {
            console.error('Error fetching property details:', error);
          }
        );
    }
  }

  submitForm() {
    this.http.post(`${this.apiUrl}storesaveproperty`, this.formData)
      .subscribe(
        (response) => {
          // Reload the current page
          window.location.reload();
        },
        (error) => {
          console.error('Error sending data', error);
          // Handle the error gracefully, e.g., display an error message to the user
        }
      );
  }


  loadisverified(): void {
    this.verifyservice.verifiedget()?.subscribe((verifyData: any) => {
      this.verifyData = verifyData;
      this.verify = this.verifyData?.responseData?.isverified;
    });
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
