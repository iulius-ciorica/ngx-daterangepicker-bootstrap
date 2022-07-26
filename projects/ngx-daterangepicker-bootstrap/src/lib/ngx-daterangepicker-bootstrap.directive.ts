import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import dayjs from 'dayjs';
import {NgxDaterangepickerBootstrapComponent} from "./ngx-daterangepicker-bootstrap.component";
import {LocaleConfig} from "./ngx-daterangepicker-locale.config";
import {NgxDaterangepickerLocaleService} from "./ngx-daterangepicker-locale.service";

@Directive({
  selector: 'input[ngxDaterangepickerBootstrap]',
  host: {
    '(keyup.esc)': 'hide()',
    '(blur)': 'onBlur()',
    '(click)': 'open()',
    '(keyup)': 'inputChanged($event)'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDaterangepickerBootstrapDirective), multi: true
    }
  ]
})
export class NgxDaterangepickerBootstrapDirective implements OnInit, OnChanges, DoCheck, AfterViewInit {

  public $event: any;
  public picker: NgxDaterangepickerBootstrapComponent | any;
  private localeDiffer?: KeyValueDiffer<string, any>;
  private firstMonthDayClass?: string;
  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  private _disabled?: boolean;
  private _value: any;
  private _startKey!: string;
  private _endKey!: string;
  private _locale: LocaleConfig = {};

  @Input() minDate?: dayjs.Dayjs;
  @Input() maxDate?: dayjs.Dayjs;
  @Input() autoApply?: boolean;
  @Input() alwaysShowCalendars?: boolean;
  @Input() showCustomRangeLabel?: boolean;
  @Input() linkedCalendars?: boolean;
  @Input() dateLimit: number | null = null;
  @Input() singleDatePicker?: boolean;
  @Input() showWeekNumbers?: boolean;
  @Input() showISOWeekNumbers?: boolean;
  @Input() showDropdowns?: boolean;
  @Input() isInvalidDate?: Function;
  @Input() isCustomDate?: Function;
  @Input() isTooltipDate?: Function;
  @Input() showClearButton?: boolean;
  @Input() customRangeDirection?: boolean;
  @Input() ranges: any;
  @Input() opens: string;
  @Input() drops: string;
  @Input() lastMonthDayClass?: string;
  @Input() emptyWeekRowClass?: string;
  @Input() emptyWeekColumnClass?: string;
  @Input() firstDayOfNextMonthClass?: string;
  @Input() lastDayOfPreviousMonthClass?: string;
  @Input() keepCalendarOpeningWithRange?: boolean;
  @Input() showRangeLabelOnInput?: boolean;
  @Input() showCancel: Boolean = false;
  @Input() lockStartDate: Boolean = false;
  @Input() closeOnAutoApply = true;
  @Input() timePicker: Boolean = false;
  @Input() timePicker24Hour: Boolean = false;
  @Input() timePickerIncrement: Number = 1;
  @Input() timePickerSeconds: Boolean = false;

  @Input() set startKey(value: any) {
    if (value !== null) {
      this._startKey = value;
    } else {
      this._startKey = 'startDate';
    }
  }

  @Input() set endKey(value: any) {
    if (value !== null) {
      this._endKey = value;
    } else {
      this._endKey = 'endDate';
    }
  }

  @Input() set locale(value) {
    this._locale = {...this._localeService.config, ...value};
  }

  @HostBinding('disabled') get disabled() {
    return this._disabled;
  }

  get locale(): any {
    return this._locale;
  }

  @Output() change: EventEmitter<Object> = new EventEmitter();
  @Output() rangeClicked: EventEmitter<Object> = new EventEmitter();
  @Output() datesUpdated: EventEmitter<Object> = new EventEmitter();
  @Output() startDateChanged: EventEmitter<Object> = new EventEmitter();
  @Output() endDateChanged: EventEmitter<Object> = new EventEmitter();
  @Output() clearClicked: EventEmitter<void> = new EventEmitter();

  notForChangesProperty: Array<string> = [
    'locale',
    'endKey',
    'startKey'
  ];

  get value() {
    return this._value || null;
  }

  set value(val) {
    this._value = val;
    this._onChange(val);
    this._changeDetectorRef.markForCheck();
  }

  constructor(private viewContainerRef: ViewContainerRef,
              private injector: Injector,
              private applicationRef: ApplicationRef,
              private differs: KeyValueDiffers,
              private elementRef: ElementRef,
              private _changeDetectorRef: ChangeDetectorRef,
              private _el: ElementRef,
              private _renderer: Renderer2,
              private _localeService: NgxDaterangepickerLocaleService) {
    this.endKey = 'endDate';
    this.startKey = 'startDate';
    this.drops = 'down';
    this.opens = 'auto';
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(NgxDaterangepickerBootstrapComponent);
    this.picker = (<NgxDaterangepickerBootstrapComponent>componentRef.instance);
    this.picker.inline = false; // set inline to false for all directive usage
  }

  ngOnInit() {
    this.picker.rangeClicked.asObservable().subscribe((range: any) => {
      this.rangeClicked.emit(range);
    });
    this.picker.datesUpdated.asObservable().subscribe((range: any) => {
      this.datesUpdated.emit(range);
    });
    this.picker.startDateChanged.asObservable().subscribe((itemChanged: any) => {
      this.startDateChanged.emit(itemChanged);
    });
    this.picker.endDateChanged.asObservable().subscribe((itemChanged: any) => {
      this.endDateChanged.emit(itemChanged);
    });
    this.picker.clearClicked.asObservable().subscribe(() => {
      this.clearClicked.emit();
    });
    this.picker.choosedDate.asObservable().subscribe((change: any) => {
      if (change) {
        const value = {} as any;
        value[this._startKey] = change.startDate;
        value[this._endKey] = change.endDate;
        this.value = value;
        this.change.emit(value);
        if (typeof change.chosenLabel === 'string') {
          this._el.nativeElement.value = change.chosenLabel;
        }
      }
    });
    this.picker.firstMonthDayClass = this.firstMonthDayClass;
    this.picker.lastMonthDayClass = this.lastMonthDayClass;
    this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
    this.picker.emptyWeekColumnClass = this.emptyWeekColumnClass;
    this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
    this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
    this.picker.drops = this.drops;
    this.picker.opens = this.opens;
    this.localeDiffer = this.differs.find(this.locale).create();
    this.picker.closeOnAutoApply = this.closeOnAutoApply;
  }

  ngAfterViewInit(): void {
    // this.writeValue(this.locale);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (changes.hasOwnProperty(change)) {
        if (this.notForChangesProperty.indexOf(change) === -1) {
          this.picker[change] = changes[change].currentValue;
        }
      }
    }
  }

  ngDoCheck() {
    if (this.localeDiffer) {
      const changes = this.localeDiffer.diff(this.locale);
      if (changes) {
        this.picker.updateLocale(this.locale);
      }
    }
    this.setPosition();
  }

  onBlur() {
    this._onTouched();
  }

  open(event?: any) {
    if (this.disabled) {
      return;
    }
    this.setPosition();
    this.picker.show(event);
  }

  hide(e?: any) {
    this.picker.hide(e);
  }

  toggle(e?: any) {
    if (this.picker.isShown) {
      this.hide(e);
    } else {
      this.open(e);
    }
  }

  clear() {
    this.picker.clear();
  }

  writeValue(value: any) {
    this.setValue(value);
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  setDisabledState(state: boolean): void {
    this._disabled = state;
  }

  private setValue(val: any) {
    if (val) {
      this.value = val;
      if (val[this._startKey]) {
        this.picker.setStartDate(val[this._startKey]);
      }
      if (val[this._endKey]) {
        this.picker.setEndDate(val[this._endKey]);
      }
      this.picker.calculateChosenLabel();
      if (this.picker.chosenLabel) {
        this._el.nativeElement.value = this.picker.chosenLabel;
      }
    } else {
      this.picker.clear();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setPosition();
  }

  /**
   * Set position of the calendar
   */
  setPosition() {
    const container = this.picker.pickerContainer.nativeElement;
    const inputOffset = this.getElementOffset(this._el.nativeElement);
    let containerTop;
    if (this.drops && this.drops === 'down') {
      containerTop = inputOffset.top + inputOffset.height + 'px';
    }
    if (this.drops && this.drops === 'up') {
      containerTop = inputOffset.top - container.clientHeight + 'px';
    }
    let style;
    if (this.opens === 'right') {
      style = {
        top: containerTop,
        left: inputOffset.left + 'px',
        right: 'auto'
      };
    }
    if (this.opens === 'center') {
      style = {
        top: containerTop,
        left: (inputOffset.left + inputOffset.width / 2 - container.clientWidth / 2) + 'px',
        right: 'auto'
      };
    }
    if (this.opens === 'left') {
      style = {
        top: containerTop,
        left: (inputOffset.left - container.clientWidth + inputOffset.width) + 'px',
        right: 'auto'
      };
    }
    if (style) {
      this._renderer.setStyle(container, 'top', style.top);
      this._renderer.setStyle(container, 'left', style.left);
      this._renderer.setStyle(container, 'right', style.right);
    }
  }

  getElementOffset(element: any) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      height: rect.height,
      width: rect.width,
    }
  }

  inputChanged(e: any) {
    if (e.target.tagName.toLowerCase() !== 'input') return;
    if (!e.target.value.length) return;
    const dateString = e.target.value.split(this.picker.locale.separator);
    let start = null, end = null;
    if (dateString.length === 2) {
      start = dayjs(dateString[0], this.picker.locale.format);
      end = dayjs(dateString[1], this.picker.locale.format);
    }
    if (this.singleDatePicker || start === null || end === null) {
      start = dayjs(e.target.value, this.picker.locale.format);
      end = start;
    }
    if (!start.isValid() || !end.isValid()) return;
    this.picker.setStartDate(start);
    this.picker.setEndDate(end);
    this.picker.updateView();
  }

  /**
   * For click outside of the calendar's container
   * @param event event object
   */
  @HostListener('document:click', ['$event'])
  outsideClick(event: any): void {
    if (!event.target || event.target.classList.contains('ngx-daterangepicker-action')) return;
    if (!this.elementRef.nativeElement.contains(event.target)) this.hide();
  }

}
