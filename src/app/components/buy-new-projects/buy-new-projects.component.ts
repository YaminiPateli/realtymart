import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropertylistingService } from '../service/propertylisting.service';

@Component({
  selector: 'app-buy-new-projects',
  templateUrl: './buy-new-projects.component.html',
  styleUrls: ['./buy-new-projects.component.css']
})
export class BuyNewProjectsComponent {
  propertylisting: any;
  data: any;
  result: any;

  constructor(public http: HttpClient, private PropertylistingService: PropertylistingService) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);

    this.PropertylistingService.propertylisting().subscribe((data: any) => {
      this.propertylisting = data;
      this.result = this.propertylisting['responseData']['allproperty'];
      console.log(this.result);
    });
  }
}
