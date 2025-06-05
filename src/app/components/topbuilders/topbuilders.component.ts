import { Component, OnInit } from '@angular/core';
import { TopbuilderslistingService } from '../service/topbuilderslisting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-topbuilders',
  templateUrl: './topbuilders.component.html',
  styleUrls: ['./topbuilders.component.css']
})
export class TopbuildersComponent implements OnInit{

  topbuilderData: any; // Replace with the actual data type
  topbuilders: any = {}; // Replace with the actual data type
  keys: string[] = [];
  locationCookie: any;
  activeLocality: string = 'sg';
  topbuildersbase64: any;
  locationget: any;


  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private topbuildersService: TopbuilderslistingService,
    ) {
      this.loadTopBuilders();
    }

    ngOnInit() {
      this.locationget = this.locationCookie = localStorage.getItem('location');
    }

    trackCustomActivity() {
      this.router.navigate(['builder-detail/:id']);
    }
    loadTopBuilders(): void {
      const locationCookie = localStorage.getItem('location');
      if (!locationCookie) {
      console.log(locationCookie);
      this.topbuildersService.topbuilderget('Ahmedabad').subscribe((data) => {
        this.topbuilderData = data;
        this.topbuilders = this.topbuilderData?.responseData;
        this.keys = Object.keys(this.topbuilders);
        // Initialize the active locality with the first key
        if (this.keys.length > 0) {
          this.activeLocality = this.keys[0];
        }

        this.setMetaTags(
          this.topbuilderData.meta.title,
          this.topbuilderData.meta.description,
        );
      });
    }
    else {
      console.log(locationCookie);
      this.topbuildersService.topbuilderget(locationCookie).subscribe((data) => {
        this.topbuilderData = data;
        this.topbuilders = this.topbuilderData?.responseData;
        this.topbuildersbase64 = console.log(btoa("stringAngular2"));
        this.keys = Object.keys(this.topbuilders);
        // Initialize the active locality with the first key
        if (this.keys.length > 0) {
          this.activeLocality = this.keys[0];
        }
        this.setMetaTags(
          this.topbuilderData.meta.title,
          this.topbuilderData.meta.description,
        );
      });
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

    setActiveLocality(locality: string): void {
      this.activeLocality = locality;
    }
}
