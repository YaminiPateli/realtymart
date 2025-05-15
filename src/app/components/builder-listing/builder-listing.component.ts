import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-builder-listing',
  templateUrl: './builder-listing.component.html',
  styleUrls: ['./builder-listing.component.css']
})
export class BuilderListingComponent {
  private apiUrl: string = environment.apiUrl;
  allbuilderprojectData:any;
  allbuilderprojectcount:any;
  allbuilderproject: any = [];
  isExpanded = false;
  // paginatedData: any[] = [];
  // currentPage: number = 1;
  // pageSize: number = 5;
  // totalItems: number = 0;
  // itemsPerPage = 5;
  // visiblePageStart: number = 1;
  // visiblePageCount: number = 5;

  initialListCount = 5;
  builderToLoad = 5;
  loading:boolean=false;
  lastPage: any;
  currentPage: number = 1;
  isLoading: any;
  scrollTimeout: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public http: HttpClient,
    private route: ActivatedRoute
  ) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
    }
  ngOnInit(): void {
    this.loadAllBuilders();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const items = document.querySelectorAll('.topahmedabad');

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

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  loadAllBuilders(): void {
    const cityName = this.route.snapshot.paramMap.get('city');
    if (this.isLoading || this.currentPage > this.lastPage) return;

      this.isLoading = true;
      this.loading = true;

      const lastElement = document.querySelectorAll('.topahmedabad');
      const lastItem = lastElement[lastElement.length - 1];
      const lastItemOffset = lastItem ? lastItem.getBoundingClientRect().top : 0;

    if (cityName) {
      this.http.get<any>(`${environment.apiUrl}allbuilderlisting/${cityName}?page=${this.currentPage}`).subscribe(
        (response) => {
          const oldScrollY = window.scrollY;

          this.allbuilderproject = this.allbuilderproject || [];
          this.allbuilderproject = [...this.allbuilderproject, ...(response.data?.data || []),];
          this.setMetaTags(
            response.meta.title,
            response.meta.description,
          );

          this.allbuilderprojectcount = response?.data?.total;
          this.lastPage = response?.data?.last_page;

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
}
