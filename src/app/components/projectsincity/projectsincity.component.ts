import { Component, HostListener } from '@angular/core';
import { ProjectincityService } from '../service/projectincity.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-projectsincity',
  templateUrl: './projectsincity.component.html',
  styleUrls: ['./projectsincity.component.css'],
  providers: [DatePipe]
})
export class ProjectsincityComponent {
  private apiUrl: string = environment.apiUrl;
  projectincityData:any;
  projectincitycount:any;
  projectincity:any[]=[];
  isDropdownOpen: boolean = false;
  original: any[] = [];
  selectedSortOption: string = 'Relevance';
  sortOptions: string[] = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Most Recent'
  ];
  paginatedData: any[] = []; // Data for the current page
  currentPage: number = 1; // Current page number
  pageSize: number = 5; // Items per page
  totalItems: number = 0; // Total number of items
  itemsPerPage = 5;
  visiblePageStart: number = 1;
  visiblePageCount: number = 5;

  contactData:any;
  contact: any = {
    property_main_img: null,
    property_type: null,
    property_bhk: null,
    project_localities: null,
    minprice: null,
    maxprice: null,
    name: null,
  };

  initialListCount = 5;
  projectToLoad = 5;
  loading:boolean=false;
  scrollTimeout:any;
  isLoading:any;
  lastPage:any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private projectlistingincityService: ProjectincityService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    const cityName = this.route.snapshot.paramMap.get('city');
  }

  ngOnInit(): void {
    const city = localStorage.getItem('location');
    this.loadAllBuilders();
  }
  
  @HostListener('window:scroll', [])
  onScroll(): void {
    const items = document.querySelectorAll('.citiys-planes');
    if (items.length < 20) return;

    const lastVisibleItem = items[items.length - 2];
    if (!lastVisibleItem) return;

    const rect = lastVisibleItem.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && !this.isLoading) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.loadAllBuilders();
      }, 200);
    }
  }
    
  loadAllBuilders(): void {
    const cityName = this.route.snapshot.paramMap.get('city');

    if (this.isLoading || this.currentPage > this.lastPage) return;

    this.isLoading = true;
    this.loading = true;

    const lastElement = document.querySelectorAll('.citiys-planes');
    const lastItem = lastElement[lastElement.length - 1];
    const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

    this.http
      .get<any>(
        `${environment.apiUrl}projectincity/${cityName}?page=${this.currentPage}`
      )
      .subscribe(
        (response) => {
          const oldScrollY = window.scrollY;

          this.projectincity = this.projectincity || [];
          this.projectincity = [
            ...this.projectincity,
            ...(response.data?.data || []),
          ];
        this.setMetaTags(
          response.meta.title,
          response.meta.description,
            );

          this.lastPage = response?.data?.last_page;          
          this.projectincitycount = response?.data?.total;          

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

    // if (cityName) {
    //   this.projectlistingincityService.getprojectincity(cityName).subscribe(
    //     (response: any) => {
    //       this.projectincityData = response;
    //       this.projectincitycount = this.projectincityData?.responseData?.projectincitycount;
    //       this.projectincity = this.projectincityData?.data;
    //       this.original = [...this.projectincity];
    //       this.totalItems = this.projectincity.length;
    //       this.updatePaginatedData();
    //     },
    //     (error: any) => {
    //       console.error('Error fetching all builders:', error);
    //     }
    //   );
    // }
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

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.projectincity.slice(startIndex, endIndex);
  }

  updateTotalItems(): void {
    this.totalItems = this.projectincity.length; 
  }
  
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedData();
    }
    this.updateTotalItems();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
    this.updateTotalItems();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedData();
  
      // Adjust the visible range dynamically
      if (page < this.visiblePageStart) {
        this.visiblePageStart = Math.max(1, this.visiblePageStart - this.visiblePageCount);
      } else if (page >= this.visiblePageStart + this.visiblePageCount) {
        this.visiblePageStart = Math.min(page, this.getTotalPages() - this.visiblePageCount + 1);
      }
    }
  }
  nextPageGroup(): void {
    const totalPages = this.getTotalPages();
    if (this.visiblePageStart + this.visiblePageCount <= totalPages) {
      this.visiblePageStart += this.visiblePageCount;
    }
  }
  previousPageGroup(): void {
    if (this.visiblePageStart > 1) {
      this.visiblePageStart -= this.visiblePageCount;
    }
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to the first page
    this.updatePaginatedData();
  }
  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const visiblePages: number[] = [];
    
    const endPage = Math.min(this.visiblePageStart + this.visiblePageCount - 1, totalPages);
  
    for (let i = this.visiblePageStart; i <= endPage; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  }
  showFirstPage(): boolean {
    return this.currentPage > 3;
  }

  showLastPage(): boolean {
    return this.currentPage < this.getTotalPages() - 2;
  }
  getFormattedDate(dateString: string) {
    return this.datePipe.transform(dateString, 'MMMM, yyyy');
  }

  contactowner(project_name:any,propertyid:any){
    this.http
    .get(`${this.apiUrl}propertydetails/${project_name}/${propertyid}`)
    .subscribe(
      (contactData: any) => {
        this.contactData = contactData;
        this.contact = this.contactData?.responseData;
      },
      (error: any) => {
        // Handle the error as needed
      }
    );
    }
    toggleDropdown(): void {
      this.isDropdownOpen = !this.isDropdownOpen;
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
  
    changeSortOption(option: string): void {
      this.selectedSortOption = option;
      this.isDropdownOpen = false;
      switch (option) {
        case 'Price - Low to High':
          this.projectincity = [...this.projectincity.sort((a, b) => this.sortByPrice(a, b))];
          break;
        case 'Price - High to Low':
          this.projectincity = [...this.projectincity.sort((a, b) => this.sortByPrice(b, a))];
          break;
        case 'Most Recent':
          this.projectincity = [...this.projectincity.sort((a, b) => this.sortByRecent(a, b))];
          break;
        case 'Relevance':
          this.projectincity = [...this.original];
          break;
        default:
          this.projectincity = [...this.original];
          break;
      }
    }
    private sortByPrice(a: any, b: any): number {
      const priceA = this.convertToLac(a.project_maximum_price);
      const priceB = this.convertToLac(b.project_minimum_price);
      return priceA - priceB;
    }
    
    private sortByRecent(a: any, b: any): number {
      const dateA = new Date(a.projectdetails.created_at).getTime();
      const dateB = new Date(b.projectdetails.created_at).getTime();
      return dateB - dateA;
    }
  
    // filterByPrice(minPrice: number, maxPrice: number): void {
    //   this.filteredData = this.searchdata.filter(property => {
    //     const propertyMinPrice = this.parsePrice(property.minprice);
    //     const propertyMaxPrice = this.parsePrice(property.maxprice);
  
    //     return (
    //       (minPrice === null || propertyMinPrice >= minPrice) &&
    //       (maxPrice === null || propertyMaxPrice <= maxPrice)
    //     );
    //   });
    // }
    
  
    private parsePrice(priceString: string): number {
      if (!priceString) return 0;
      let numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '').trim());
  
      if (priceString.includes('cr')) {
        numericValue *= 100; // Convert crore to lac
      }
      return numericValue;
    }
}
