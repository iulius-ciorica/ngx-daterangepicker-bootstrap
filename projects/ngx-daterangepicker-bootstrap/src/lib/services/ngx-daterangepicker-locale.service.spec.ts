import { TestBed } from '@angular/core/testing';

import { NgxDaterangepickerLocaleService } from './ngx-daterangepicker-locale.service';

describe('NgxDaterangepickerBootstrapService', () => {
  let service: NgxDaterangepickerLocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDaterangepickerLocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
