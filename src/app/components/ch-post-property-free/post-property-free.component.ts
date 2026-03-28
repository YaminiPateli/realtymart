import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalityService } from '../../components/service/locality.service';
import { AllcitiesService } from '../service/allcities.service';
import { PropertytypeforpostpropertyService } from '../service/propertytypeforpostproperty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-property-free',
  templateUrl: './post-property-free.component.html',
  styleUrls: ['./post-property-free.component.css']
})
export class PostPropertyFreeComponent {
  localityData:any;
  locality:any;
  allcitiesData: any;
  allcities: any;
  propertytype: any;
  propertytypeData: any;
  propertytypeDatas: any;
  propertytypeGroups: any[] = [];
  selectedFurnishing: string = '';

  constructor(private router: Router,
    private localityservice: LocalityService,
    private allcityService: AllcitiesService,
    private PropertytypeforService: PropertytypeforpostpropertyService,) {
      this.getlocalityservices();
      this.loadAllCities();
      this.loadPropertyType();
  }

  selectFurnishing(value: string) {
    this.selectedFurnishing = value;
  }

  getlocalityservices(): void {
    this.localityservice.getlocality()?.subscribe((localityData: any) => {
      this.localityData = localityData;
      this.locality = this.localityData?.responseData?.data;
    });
  }

  loadAllCities() : void{
    this.allcityService.getallcities()?.subscribe((data:any) => {
      this.allcitiesData = data;
      this.allcities = this.allcitiesData?.responseData?.allcities;
    });
  }
  loadPropertyType(): void {
    this.PropertytypeforService.getpropertytypeforpostproperty().subscribe((propertytypeDatas: any) => {
      this.propertytypeData = propertytypeDatas;
      this.propertytype = this.propertytypeData?.responseData?.propertytypeforpostproperty;

      // Transform the data into an array of groups
      this.propertytypeGroups = Object.keys(this.propertytype).map((group) => ({
        groupName: group,
        properties: this.propertytype[group],
      }));  
    });
  }

  // min max floor
  value: number = 0;

  increment() {
    this.value++;
  }

  decrement() {
    if (this.value > 0) {
      this.value--;
    }
  }


  // image upload

  images: Array<{ url: string, name: string }> = [];

  onFileSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const maxSizeMB = 4;
      const maxWidth = 600;
      const maxHeight = 400;

      if (file.size / 1024 / 1024 <= maxSizeMB) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const img = new Image();
          img.src = e.target.result;

          img.onload = () => {
            if (img.width <= maxWidth && img.height <= maxHeight) {
              this.images.push({ url: e.target.result, name: file.name });
            } else {
              alert(`Image dimensions for '${file.name}' should not exceed 600x400 pixels.`);
            }
          };
        };

        reader.readAsDataURL(file);
      } else {
        alert(`File size for '${file.name}' should not exceed 4MB.`);
      }
    }
  }

}
