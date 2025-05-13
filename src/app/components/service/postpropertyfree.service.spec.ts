import { TestBed } from '@angular/core/testing';

import { PostpropertyfreeService } from './postpropertyfree.service';

describe('PostpropertyfreeService', () => {
  let service: PostpropertyfreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostpropertyfreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
