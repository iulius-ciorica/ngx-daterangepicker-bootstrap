import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDaterangepickerBootstrapComponent } from './ngx-daterangepicker-bootstrap.component';

describe('NgxDaterangepickerBootstrapComponent', () => {
  let component: NgxDaterangepickerBootstrapComponent;
  let fixture: ComponentFixture<NgxDaterangepickerBootstrapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxDaterangepickerBootstrapComponent]
    });
    fixture = TestBed.createComponent(NgxDaterangepickerBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
