import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangesComponent } from './ranges.component';

describe('RangesComponent', () => {
  let component: RangesComponent;
  let fixture: ComponentFixture<RangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
