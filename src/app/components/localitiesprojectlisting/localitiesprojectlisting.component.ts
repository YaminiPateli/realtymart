import { Component, OnInit } from '@angular/core';
import { ExplorelocalitiesprojectlistingService } from '../service/explorelocalitiesprojectlisting.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-localitiesprojectlisting',
  templateUrl: './localitiesprojectlisting.component.html',
  styleUrls: ['./localitiesprojectlisting.component.css']
})
export class LocalitiesprojectlistingComponent {

  localitiesprojectsData: any;
  localitiesprojects: any[] = [];
  isDropdownOpen: boolean = false;
  selectedSortOption: string = 'Relevance';
  original: any[] = [];
  filteredData: any[] = [];
  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent'
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private localitiesprojectlisting: ExplorelocalitiesprojectlistingService,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.fetchExploreLocalitiesProjectsList();
  }

  fetchExploreLocalitiesProjectsList(){
    const localities = this.route.snapshot.paramMap.get('localities');

    if (localities) {
      this.localitiesprojectlisting.getlocalitiesprojects(localities.toString()).subscribe(
        (localities: any) => {
          this.localitiesprojectsData = localities;
          this.localitiesprojects = this.localitiesprojectsData?.data;
          this.original = [...this.localitiesprojects];
          this.setMetaTags(
            localities.meta.title,
            localities.meta.description,
          );
        },
        (error: any) => {
          console.error('Error fetching agent sell details:', error);
        }
      );
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

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  changeSortOption(option: string): void {
    this.selectedSortOption = option;
    this.isDropdownOpen = false;
    switch (option) {
      case 'Price - Low to High':
        this.localitiesprojects = [...this.localitiesprojects.sort((a, b) => this.sortByPrice(a, b))];
        break;
      case 'Price - High to Low':
        this.localitiesprojects = [...this.localitiesprojects.sort((a, b) => this.sortByPrice(b, a))];
        break;
      case 'Most Recent':
        this.localitiesprojects = [...this.localitiesprojects.sort((a, b) => this.sortByRecent(a, b))];
        break;
      case 'Relevance':
        this.localitiesprojects = [...this.original];
        break;
      default:
        this.localitiesprojects = [...this.original];
        break;
    }
  }

  private sortByPrice(a: any, b: any): number {
    const priceA = this.convertToLac(a.project_minimum_price);
    const priceB = this.convertToLac(b.project_maximum_price);
    return priceA - priceB;
  }
  
  private sortByRecent(a: any, b: any): number {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  }

  filterByPrice(minPrice: number, maxPrice: number): void {
    this.filteredData = this.localitiesprojects.filter((property:any) => {
      const propertyMinPrice = this.convertToLac(property.minprice);
      const propertyMaxPrice = this.convertToLac(property.maxprice);

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
  
}
