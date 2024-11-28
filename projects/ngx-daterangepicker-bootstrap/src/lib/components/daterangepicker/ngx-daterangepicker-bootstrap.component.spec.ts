import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDaterangepickerBootstrapComponent } from './ngx-daterangepicker-bootstrap.component';

describe('DaterangepickerComponent', () => {
  let component: NgxDaterangepickerBootstrapComponent;
  let fixture: ComponentFixture<NgxDaterangepickerBootstrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDaterangepickerBootstrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxDaterangepickerBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
