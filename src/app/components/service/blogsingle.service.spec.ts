import { TestBed } from '@angular/core/testing';

import { BlogsingleService } from './blogsingle.service';

describe('BlogsingleService', () => {
  let service: BlogsingleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogsingleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
