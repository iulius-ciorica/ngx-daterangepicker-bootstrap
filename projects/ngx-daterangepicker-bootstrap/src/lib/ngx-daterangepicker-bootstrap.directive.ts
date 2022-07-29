import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  DoCheck,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  reflectComponentType,
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
export class NgxDaterangepickerBootstrapDirective implements OnInit, OnDestroy, OnChanges, DoCheck, AfterViewInit {

  public $event: any;
  public daterangepicker: NgxDaterangepickerBootstrapComponent | any;
  private daterangepickerRef: ComponentRef<any>;
  private readonly daterangepickerElement: HTMLElement;
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
  @Input() formlyCustomField: Boolean = false; // if you use ngx-formly and create custom field this library

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
    this.opens = 'right';
    viewContainerRef.clear();
    this.daterangepickerRef = this.viewContainerRef.createComponent(NgxDaterangepickerBootstrapComponent, {injector: this.injector});
    this.daterangepickerElement = (this.daterangepickerRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    CSS.supports('display', 'contents') // unwrap or hide daterangepickerElement from DOM body, to fix clickOutside
      ? this.daterangepickerElement.classList.add('unwrap', 'on')
      : this.daterangepickerElement.classList.add('unwrap', 'off');
    document.body.appendChild(this.daterangepickerElement); // add daterangepickerElement to DOM body, to fix position top left issues
    this.daterangepicker = (<NgxDaterangepickerBootstrapComponent>this.daterangepickerRef.instance);
    this.daterangepicker.inline = false; // set inline to false for all directive usage
  }

  ngOnInit() {
    this.daterangepicker.rangeClicked.asObservable().subscribe((range: any) => {
      this.rangeClicked.emit(range);
    });
    this.daterangepicker.datesUpdated.asObservable().subscribe((range: any) => {
      this.datesUpdated.emit(range);
    });
    this.daterangepicker.startDateChanged.asObservable().subscribe((itemChanged: any) => {
      this.startDateChanged.emit(itemChanged);
    });
    this.daterangepicker.endDateChanged.asObservable().subscribe((itemChanged: any) => {
      this.endDateChanged.emit(itemChanged);
    });
    this.daterangepicker.clearClicked.asObservable().subscribe(() => {
      this.clearClicked.emit();
    });
    this.daterangepicker.choosedDate.asObservable().subscribe((change: any) => {
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
    this.daterangepicker.firstMonthDayClass = this.firstMonthDayClass;
    this.daterangepicker.lastMonthDayClass = this.lastMonthDayClass;
    this.daterangepicker.emptyWeekRowClass = this.emptyWeekRowClass;
    this.daterangepicker.emptyWeekColumnClass = this.emptyWeekColumnClass;
    this.daterangepicker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
    this.daterangepicker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
    this.daterangepicker.drops = this.drops;
    this.daterangepicker.opens = this.opens;
    this.localeDiffer = this.differs.find(this.locale).create();
    this.daterangepicker.closeOnAutoApply = this.closeOnAutoApply;
  }

  ngOnDestroy() {
    const reflectComponent = reflectComponentType(NgxDaterangepickerBootstrapComponent);
    const selector = document.querySelector(reflectComponent!.selector);
    if (selector !== null) document.body.removeChild(selector);
    this.applicationRef.detachView(this.daterangepickerRef.hostView);
    this.daterangepickerRef.destroy();
  }

  ngAfterViewInit(): void {
    if (this.formlyCustomField) this.writeValue(this.locale); // If you use ngx-formly custom field, remove [(ngModel)]
    // from the input and set [formlyCustomField]='true' instead, to avoid Expression has changed after it was checked.
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (changes.hasOwnProperty(change)) {
        if (this.notForChangesProperty.indexOf(change) === -1) {
          this.daterangepicker[change] = changes[change].currentValue;
        }
      }
    }
  }

  ngDoCheck() {
    if (this.localeDiffer) {
      const changes = this.localeDiffer.diff(this.locale);
      if (changes) {
        this.daterangepicker.updateLocale(this.locale);
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
    this.daterangepicker.show(event);
  }

  hide(e?: any) {
    this.daterangepicker.hide(e);
  }

  toggle(e?: any) {
    if (this.daterangepicker.isShown) {
      this.hide(e);
    } else {
      this.open(e);
    }
  }

  clear() {
    this.daterangepicker.clear();
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
        this.daterangepicker.setStartDate(val[this._startKey]);
      }
      if (val[this._endKey]) {
        this.daterangepicker.setEndDate(val[this._endKey]);
      }
      this.daterangepicker.calculateChosenLabel();
      if (this.daterangepicker.chosenLabel) {
        this._el.nativeElement.value = this.daterangepicker.chosenLabel;
      }
    } else {
      this.daterangepicker.clear();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setPosition();
  }

  /**
   * Set position of the calendar, this works as expected only if you add daterangepickerElement to DOM body
   */
  setPosition() {
    const container = this.daterangepicker.pickerContainer.nativeElement;
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
    const dateString = e.target.value.split(this.daterangepicker.locale.separator);
    let start = null, end = null;
    if (dateString.length === 2) {
      start = dayjs(dateString[0], this.daterangepicker.locale.format);
      end = dayjs(dateString[1], this.daterangepicker.locale.format);
    }
    if (this.singleDatePicker || start === null || end === null) {
      start = dayjs(e.target.value, this.daterangepicker.locale.format);
      end = start;
    }
    if (!start.isValid() || !end.isValid()) return;
    this.daterangepicker.setStartDate(start);
    this.daterangepicker.setEndDate(end);
    this.daterangepicker.updateView();
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
