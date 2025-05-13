import { TestBed } from '@angular/core/testing';

import { BlogslistingService } from './blogslisting.service';

describe('BlogslistingService', () => {
  let service: BlogslistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogslistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
