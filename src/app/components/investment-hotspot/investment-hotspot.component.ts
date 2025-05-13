import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-investment-hotspot',
  templateUrl: './investment-hotspot.component.html',
  styleUrls: ['./investment-hotspot.component.css']
})
export class InvestmentHotspotComponent {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {
    this.setMetaTags(
      'Investment Hotspot in realtymart',
      '',
    );
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
