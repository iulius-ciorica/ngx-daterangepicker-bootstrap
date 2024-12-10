import {
  AfterViewChecked,
  AfterViewInit,
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  forwardRef,
  inject,
  Injector,
  input,
  InputSignal,
  InputSignalWithTransform,
  KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers,
  model,
  ModelSignal,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {
  NgxDaterangepickerBootstrapComponent
} from '../components/daterangepicker/ngx-daterangepicker-bootstrap.component';
import {LocaleConfig} from '../utils/ngx-daterangepicker-locale.config';
import {NgxDaterangepickerLocaleService} from '../services/ngx-daterangepicker-locale.service';
import dayjs, {Dayjs} from 'dayjs';

@Directive({
  selector: 'input[ngxDaterangepickerBootstrap]',
  host: {
    '[disabled]': 'disabled',
    '(click)': 'open()',
    '(blur)': 'onBlur()',
    '(keyup)': 'inputChanged($event)',
    '(keyup.esc)': 'hide()',
    '(window:resize)': 'onWindowResize($event)',
    '(document:click)': 'outsideClick($event)'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef((): typeof NgxDaterangepickerBootstrapDirective => NgxDaterangepickerBootstrapDirective),
      multi: true
    }
  ],
})
export class NgxDaterangepickerBootstrapDirective implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private injector: Injector = inject(Injector);
  private applicationRef: ApplicationRef = inject(ApplicationRef);
  private differs: KeyValueDiffers = inject(KeyValueDiffers);
  private elementRef: ElementRef = inject(ElementRef);
  private _renderer: Renderer2 = inject(Renderer2);
  private _localeService: NgxDaterangepickerLocaleService = inject(NgxDaterangepickerLocaleService);

  public $event: any;
  public daterangepicker: NgxDaterangepickerBootstrapComponent | any;
  private daterangepickerRef?: ComponentRef<NgxDaterangepickerBootstrapComponent>;
  private daterangepickerElement?: HTMLElement;
  private localeDiffer?: KeyValueDiffer<string, any>;
  private firstMonthDayClass?: string;
  private _onChange: Function = Function.prototype;
  private _onTouched: Function = Function.prototype;
  private _disabled?: boolean;
  private _value: any;
  private _startKey!: string;
  private _endKey!: string;
  private _locale: LocaleConfig = {};
  private _resizeObserver?: ResizeObserver;

  readonly minDate: InputSignal<Dayjs | null | undefined> = input<Dayjs | null | undefined>();
  readonly maxDate: InputSignal<Dayjs | null | undefined> = input<Dayjs | null | undefined>();
  readonly autoApply: InputSignal<boolean> = input<boolean>(false);
  readonly alwaysShowCalendars: InputSignal<boolean> = input<boolean>(false);
  readonly showCustomRangeLabel: InputSignal<boolean | undefined> = input<boolean>();
  readonly linkedCalendars: InputSignal<boolean> = input<boolean>(false);
  readonly dateLimit: InputSignal<number | null> = input<number | null>(null);
  readonly singleDatePicker: InputSignal<boolean> = input<boolean>(false);
  readonly showWeekNumbers: InputSignal<boolean> = input<boolean>(false);
  readonly showISOWeekNumbers: InputSignal<boolean> = input<boolean>(false);
  readonly showDropdowns: InputSignal<boolean> = input<boolean>(false);
  readonly isInvalidDate: InputSignal<Function | null | undefined> = input<Function | null | undefined>();
  readonly isCustomDate: InputSignal<Function | null | undefined> = input<Function | null | undefined>();
  readonly isTooltipDate: InputSignal<Function | null | undefined> = input<Function | null | undefined>();
  readonly showClearButton: InputSignal<boolean> = input<boolean>(false);
  readonly customRangeDirection: InputSignal<boolean> = input(false);
  readonly ranges: InputSignal<any> = input<any>(null);
  readonly opens: ModelSignal<string> = model<string>('right');
  readonly drops: ModelSignal<string> = model<string>('down');
  readonly lastMonthDayClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly emptyWeekRowClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly emptyWeekColumnClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly firstDayOfNextMonthClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly lastDayOfPreviousMonthClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly keepCalendarOpeningWithRange: InputSignal<boolean> = input(false);
  readonly showRangeLabelOnInput: InputSignal<boolean> = input(false);
  readonly showCancel: InputSignal<boolean> = input(false);
  readonly lockStartDate: InputSignal<Boolean> = input<Boolean>(false);
  readonly closeOnAutoApply: InputSignal<boolean> = input(true);
  readonly timePicker: InputSignal<Boolean> = input<Boolean>(false);
  readonly timePicker24Hour: InputSignal<Boolean> = input<Boolean>(false);
  readonly timePickerIncrement: InputSignal<number> = input(1);
  readonly timePickerSeconds: InputSignal<Boolean> = input<Boolean>(false);
  readonly formlyCustomField: InputSignal<Boolean> = input<Boolean>(false); // if you use ngx-formly and create custom field this library

  readonly startKey: InputSignalWithTransform<string, string> = input('startDate', {
    transform: (value: string): string => {
      value !== null ? this._startKey = value : this._startKey = 'startDate';
      return value;
    }
  });

  readonly endKey: InputSignalWithTransform<string, string> = input('endDate', {
    transform: (value: string): string => {
      value !== null ? this._endKey = value : this._endKey = 'endDate';
      return value;
    }
  });

  readonly locale: InputSignalWithTransform<object, object> = input({}, {
    transform: (value: object): object => {
      this._locale = {...this._localeService.config, ...value};
      return this._locale;
    }
  });

  readonly change: OutputEmitterRef<Object> = output();
  readonly rangeClicked: OutputEmitterRef<Object> = output();
  readonly datesUpdated: OutputEmitterRef<Object> = output();
  readonly startDateChanged: OutputEmitterRef<Object> = output();
  readonly endDateChanged: OutputEmitterRef<Object> = output();
  readonly clearClicked: OutputEmitterRef<void> = output();

  get disabled(): boolean | undefined {
    return this._disabled;
  }

  get value(): any {
    return this._value || null;
  }

  set value(val: any) {
    this._value = val;
    this._onChange(val);
  }

  private rangeClickedSubs: any;
  private datesUpdatedSubs: any;
  private startDateChangedSubs: any;
  private endDateChangedSubs: any;
  private clearClickedSubs: any;
  private chosenDateSubs: any;

  constructor() {
    this.viewContainerRef.clear();
    this.daterangepickerRef = this.viewContainerRef.createComponent(NgxDaterangepickerBootstrapComponent, {injector: this.injector});
    this.daterangepickerElement = (this.daterangepickerRef.hostView as EmbeddedViewRef<NgxDaterangepickerBootstrapComponent>).rootNodes[0] as HTMLElement;
    CSS.supports('display', 'contents') // unwrap or hide daterangepickerElement from DOM body, to fix clickOutside
      ? this.daterangepickerElement.classList.add('unwrap', 'on')
      : this.daterangepickerElement.classList.add('unwrap', 'off');
    document.body.appendChild(this.daterangepickerElement); // add daterangepickerElement to DOM body, to fix position top left issues
    this.daterangepicker = this.daterangepickerRef.instance;
    this.daterangepicker.inline = false; // set inline to false for all directive usage
  }

  ngOnInit(): void {
    this.daterangepickerRef?.setInput('autoApply', this.autoApply());
    this.daterangepickerRef?.setInput('alwaysShowCalendars', this.alwaysShowCalendars());
    this.daterangepickerRef?.setInput('showCustomRangeLabel', this.showCustomRangeLabel());
    this.daterangepickerRef?.setInput('linkedCalendars', this.linkedCalendars());
    this.daterangepickerRef?.setInput('dateLimit', this.dateLimit());
    this.daterangepickerRef?.setInput('singleDatePicker', this.singleDatePicker());
    this.daterangepickerRef?.setInput('showWeekNumbers', this.showWeekNumbers());
    this.daterangepickerRef?.setInput('showISOWeekNumbers', this.showISOWeekNumbers());
    this.daterangepickerRef?.setInput('showDropdowns', this.showDropdowns());
    this.daterangepickerRef?.setInput('showClearButton', this.showClearButton());
    this.daterangepickerRef?.setInput('customRangeDirection', this.customRangeDirection());
    this.daterangepickerRef?.setInput('ranges', this.ranges());
    this.daterangepickerRef?.setInput('opens', this.opens());
    this.daterangepickerRef?.setInput('drops', this.drops());
    this.daterangepickerRef?.setInput('lastMonthDayClass', this.lastMonthDayClass());
    this.daterangepickerRef?.setInput('emptyWeekRowClass', this.emptyWeekRowClass());
    this.daterangepickerRef?.setInput('emptyWeekColumnClass', this.emptyWeekColumnClass());
    this.daterangepickerRef?.setInput('firstDayOfNextMonthClass', this.firstDayOfNextMonthClass());
    this.daterangepickerRef?.setInput('lastDayOfPreviousMonthClass', this.lastDayOfPreviousMonthClass());
    this.daterangepickerRef?.setInput('keepCalendarOpeningWithRange', this.keepCalendarOpeningWithRange());
    this.daterangepickerRef?.setInput('showRangeLabelOnInput', this.showRangeLabelOnInput());
    this.daterangepickerRef?.setInput('showCancel', this.showCancel());
    this.daterangepickerRef?.setInput('lockStartDate', this.lockStartDate());
    this.daterangepickerRef?.setInput('closeOnAutoApply', this.closeOnAutoApply());
    this.daterangepickerRef?.setInput('timePicker', this.timePicker());
    this.daterangepickerRef?.setInput('timePicker24Hour', this.timePicker24Hour());
    this.daterangepickerRef?.setInput('timePickerIncrement', this.timePickerIncrement());
    this.daterangepickerRef?.setInput('timePickerSeconds', this.timePickerSeconds());
    this.daterangepickerRef?.setInput('firstMonthDayClass', this.firstMonthDayClass);
    if (this.minDate() !== undefined) this.daterangepickerRef?.setInput('minDate', this.minDate());
    if (this.maxDate() !== undefined) this.daterangepickerRef?.setInput('maxDate', this.maxDate());
    if (this.isInvalidDate() !== undefined) this.daterangepickerRef?.setInput('isInvalidDate', this.isInvalidDate());
    if (this.isCustomDate() !== undefined) this.daterangepickerRef?.setInput('isCustomDate', this.isCustomDate());
    if (this.isTooltipDate() !== undefined) this.daterangepickerRef?.setInput('isTooltipDate', this.isTooltipDate());
    this.rangeClickedSubs = this.daterangepicker.rangeClicked.subscribe((range: any) => this.rangeClicked.emit(range));
    this.datesUpdatedSubs = this.daterangepicker.datesUpdated.subscribe((range: any) => this.datesUpdated.emit(range));
    this.startDateChangedSubs = this.daterangepicker.startDateChanged.subscribe((itemChanged: any) => this.startDateChanged.emit(itemChanged));
    this.endDateChangedSubs = this.daterangepicker.endDateChanged.subscribe((itemChanged: any) => this.endDateChanged.emit(itemChanged));
    this.clearClickedSubs = this.daterangepicker.clearClicked.subscribe(() => this.clearClicked.emit());
    this.chosenDateSubs = this.daterangepicker.chosenDate.subscribe((change: any) => {
      if (change) {
        const value = {} as any;
        value[this._startKey] = change.startDate;
        value[this._endKey] = change.endDate;
        this.value = value;
        this.change.emit(value);
        if (typeof change.chosenLabel === 'string') {
          this.elementRef.nativeElement.value = change.chosenLabel;
        }
      }
    });
    this.pickerResizeObserver();
    this.localeDiffer = this.differs.find(this.locale()).create();
    if (this.localeDiffer) {
      const changes: KeyValueChanges<string, any> | null = this.localeDiffer.diff(this.locale());
      if (changes) {
        this.daterangepicker.updateLocale(this.locale());
      }
    }
  }

  ngOnDestroy(): void {
    this._resizeObserver?.unobserve(this.daterangepicker.pickerContainer().nativeElement);
    if (this.daterangepickerElement !== null) document.body.removeChild(this.daterangepickerElement!);
    this.applicationRef.detachView(this.daterangepickerRef!.hostView);
    this.rangeClickedSubs?.unsubscribe();
    this.datesUpdatedSubs?.unsubscribe();
    this.startDateChangedSubs?.unsubscribe();
    this.endDateChangedSubs?.unsubscribe();
    this.clearClickedSubs?.unsubscribe();
    this.chosenDateSubs?.unsubscribe();
    this.daterangepickerRef?.destroy();
  }

  ngAfterViewInit(): void {
    if (this.formlyCustomField()) this.writeValue(this.locale()); // If you use ngx-formly custom field, remove [(ngModel)]
    // from the input and set [formlyCustomField]='true' instead, to avoid Expression has changed after it was checked.
  }

  ngAfterViewChecked(): void {
    if (this.daterangepicker.isShown()) this.setPosition();
  }

  onWindowResize(event?: any): void {
    if (this.daterangepicker.isShown()) this.setPosition();
  }

  open(event?: any): void {
    if (this.disabled) return;
    this.daterangepicker.show(event);
    if (this.daterangepicker.isShown()) this.setPosition();
  }

  hide(event?: any): void {
    this.daterangepicker.hide(event);
  }

  onBlur(): void {
    this._onTouched();
  }

  toggle(event?: any): void {
    this.daterangepicker.isShown() ? this.hide(event) : this.open(event);
  }

  clear(): void {
    this.daterangepicker.clickClear();
  }

  writeValue(value: any): void {
    this.setValue(value);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(state: boolean): void {
    this._disabled = state;
  }

  private setValue(val: any): void {
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
        this.elementRef.nativeElement.value = this.daterangepicker.chosenLabel;
      }
    } else {
      this.daterangepicker.clickClear();
    }
  }

  pickerResizeObserver(): void {
    this._resizeObserver = new ResizeObserver(() => {
      // if (this.daterangepicker.isShown()) this.setPosition();
    });
    this._resizeObserver.observe(this.daterangepicker.pickerContainer().nativeElement);
  }

  /**
   * Set position of the calendar, this works as expected only if you add daterangepickerElement to DOM body
   */
  setPosition(): void {
    const pickerContainer: any = this.daterangepicker.pickerContainer().nativeElement;
    const inputOffset: { top: any; left: any; width: any; height: any } = this.getOffset(this.elementRef.nativeElement);
    let containerTop;
    let containerBottom;
    if (this.drops() && this.drops() === 'down') {
      containerTop = inputOffset.top + inputOffset.height + 'px';
      containerBottom = 'auto'
    }
    if (this.drops() && this.drops() === 'up') {
      containerTop = 'auto'
      containerBottom = window.innerHeight - inputOffset.top + 'px';
    }
    let style;
    if (this.opens() === 'right') {
      style = {
        top: containerTop,
        right: 'auto',
        bottom: containerBottom,
        left: inputOffset.left + 'px',
      };
    }
    if (this.opens() === 'center') {
      style = {
        top: containerTop,
        right: 'auto',
        bottom: containerBottom,
        left: inputOffset.left + (inputOffset.width - pickerContainer.offsetWidth) / 2 + 'px',
      };
    }
    if (this.opens() === 'left') {
      style = {
        top: containerTop,
        right: window.innerWidth - (inputOffset.left + inputOffset.width) + 'px',
        bottom: containerBottom,
        left: 'auto',
      };
    }
    if (style) {
      /* inset: top right bottom left */
      this._renderer.setStyle(pickerContainer, 'top', style.top);
      this._renderer.setStyle(pickerContainer, 'right', style.right);
      this._renderer.setStyle(pickerContainer, 'bottom', style.bottom);
      this._renderer.setStyle(pickerContainer, 'left', style.left);
    }
  }

  getOffset(element: any): { top: any; left: any; width: any; height: any } {
    const rect: any = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      height: rect.height,
      width: rect.width,
    };
  }

  inputChanged(event: any): void {
    if (event.target.tagName.toLowerCase() !== 'input') return;
    if (!event.target.value.length) return;
    const dateString: any = event.target.value.split(this.daterangepicker.locale.separator);
    let start: any = null, end: any = null;
    if (dateString.length === 2) {
      start = dayjs(dateString[0], this.daterangepicker.locale.format);
      end = dayjs(dateString[1], this.daterangepicker.locale.format);
    }
    if (this.singleDatePicker() || start === null || end === null) {
      start = dayjs(event.target.value, this.daterangepicker.locale.format);
      end = start;
    }
    if (!start.isValid() || !end.isValid()) return;
    this.daterangepicker.setStartDate(start);
    this.daterangepicker.setEndDate(end);
    this.daterangepicker.updateView();
  }

  /**
   * For click outside the calendar's container
   * @param event event object
   */
  outsideClick(event: any): void {
    if (!event.target || event.target.classList.contains('ngx-daterangepicker-action')) return;
    if (!this.elementRef.nativeElement.contains(event.target)) this.hide();
  }

}
