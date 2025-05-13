import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PropertyservicesService } from '../service/propertyservices.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-property-services',
  templateUrl: './property-services.component.html',
  styleUrls: ['./property-services.component.css'],
})
export class PropertyServicesComponent implements OnInit {
  searchdata: string[] = [];
  propertyget: any;
  data: any;
  result: any;
  selectedService: string = '';

  constructor(private titleService: Title, private metaService: Meta, public http: HttpClient, private propertyservicesService: PropertyservicesService) {
    this.setMetaTags(
      'Property Services in realtymart',
      '',
    );
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
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

  ngOnInit(): void {
    this.fetchSportsData();
  }

  fetchSportsData() {
    this.propertyservicesService.propertyget().subscribe((data) => {
      this.propertyget = data;
      this.result = this.propertyget['responseData'];
      this.searchdata = this.result.map((item: any) => item.name);
    });
  }

  onServiceSelect(event: any) {
    this.selectedService = event.value;
  }
  
}
