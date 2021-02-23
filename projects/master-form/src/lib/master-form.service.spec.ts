import { TestBed } from '@angular/core/testing';

import { MasterFormService } from './master-form.service';

describe('MasterFormService', () => {
  let service: MasterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
