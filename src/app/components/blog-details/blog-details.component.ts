import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BlogsingleService } from '../service/blogsingle.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  blogdetailsData: any;
  blogdetails: any;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private BlogDetailsService: BlogsingleService,
    private route: ActivatedRoute,
  ) {
    this.LoadBlogDetails();
  }

  LoadBlogDetails() {
    const blogurl = this.route.snapshot.paramMap.get('blogurl');

    if (blogurl) {
      this.BlogDetailsService.getblogdetails(blogurl)?.subscribe((data) => {
        this.blogdetailsData = data;
        this.blogdetails = this.blogdetailsData['data'];
        this.setMetaTags(
          this.blogdetails['meta_title'],
          this.blogdetails['meta_description'],
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
}
