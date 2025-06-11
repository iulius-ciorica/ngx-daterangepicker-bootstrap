import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  viewChild,
  ViewEncapsulation,
  WritableSignal
} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgxDaterangepickerLocaleService} from "../../services/ngx-daterangepicker-locale.service";
import dayjs, {Dayjs} from "dayjs";
import localeData from "dayjs/plugin/localeData";
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import week from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {NgClass} from "@angular/common";
import {RangesComponent} from '../ranges/ranges.component';
import {CalendarComponent} from '../calendar/calendar.component';
import {ActionsComponent} from '../actions/actions.component';
import {SideEnum} from "../../model/daterangepicker.model";

dayjs.extend(localeData);
dayjs.extend(LocalizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(week);
dayjs.extend(customParseFormat);

@Component({
  selector: 'ngx-daterangepicker-bootstrap',
  imports: [
    NgClass,
    FormsModule,
    RangesComponent,
    CalendarComponent,
    ActionsComponent,
  ],
  templateUrl: './ngx-daterangepicker-bootstrap.component.html',
  styleUrl: './ngx-daterangepicker-bootstrap.component.scss',
  host: {
    '(click)': 'handleInternalClick($event)'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDaterangepickerBootstrapComponent implements OnInit {

  private _localeService = inject(NgxDaterangepickerLocaleService);

  public $event: any;
  public chosenLabel?: string;
  public calendarVariables: { left: any, right: any } = {left: {}, right: {}};
  public timepickerVariables: { left: any, right: any } = {left: {}, right: {}};
  readonly applyBtnDisabled: WritableSignal<Boolean> = signal<Boolean>(false);
  public chosenRange?: string | null;
  public rangesArray: Array<any> = [];
  public inline = true;
  public showCalInRanges: Boolean = false;
  private tooltiptext: any = [];  // for storing tooltiptext
  private leftCalendar: any = {};
  private rightCalendar: any = {};
  private nowHoveredDate: null = null;
  private pickingDate: Boolean = false;
  private _old: { start: any, end: any } = {start: null, end: null};
  public _minDate?: Dayjs | null;
  public _maxDate?: Dayjs | null;
  // private _locale: LocaleConfig = {};
  private _ranges: any = {};

  readonly startDate: ModelSignal<Dayjs | null | undefined> = model<Dayjs | null | undefined>(dayjs().startOf('day'));
  readonly endDate: ModelSignal<Dayjs | null | undefined> = model<Dayjs | null | undefined>(dayjs().endOf('day'));
  readonly dateLimit: InputSignal<number | null> = input<number | null>(null);
  readonly autoApply: InputSignal<Boolean> = input<Boolean>(false);
  readonly singleDatePicker: InputSignal<Boolean> = input<Boolean>(false);
  readonly showDropdowns: InputSignal<Boolean> = input<Boolean>(false);
  readonly showWeekNumbers: InputSignal<Boolean> = input<Boolean>(false);
  readonly showISOWeekNumbers: InputSignal<Boolean> = input<Boolean>(false);
  readonly linkedCalendars: InputSignal<Boolean> = input<Boolean>(false);
  readonly autoUpdateInput: InputSignal<Boolean> = input<Boolean>(true);
  readonly alwaysShowCalendars: InputSignal<Boolean> = input<Boolean>(false);
  readonly maxSpan: InputSignal<Boolean> = input<Boolean>(false);
  readonly lockStartDate: InputSignal<Boolean> = input<Boolean>(false);
  readonly timePicker: InputSignal<Boolean> = input<Boolean>(false);
  readonly timePicker24Hour: InputSignal<Boolean> = input<Boolean>(false);
  readonly timePickerIncrement: InputSignal<number> = input(1);
  readonly timePicker24HourInterval: InputSignal<number[]> = input([0, 23]);
  readonly timePickerSeconds: InputSignal<Boolean> = input<Boolean>(false);
  readonly showClearButton: InputSignal<Boolean> = input<Boolean>(false);
  readonly firstMonthDayClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly lastMonthDayClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly emptyWeekRowClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly emptyWeekColumnClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly firstDayOfNextMonthClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly lastDayOfPreviousMonthClass: InputSignal<string | null | undefined> = input<string | null | undefined>(null);
  readonly showCustomRangeLabel: InputSignal<boolean | undefined> = input<boolean>();
  readonly showCancel: InputSignal<boolean> = input(false);
  readonly keepCalendarOpeningWithRange: InputSignal<boolean> = input(false);
  readonly showRangeLabelOnInput: InputSignal<boolean> = input(false);
  readonly customRangeDirection: InputSignal<boolean> = input(false);
  readonly drops: InputSignal<string | undefined> = input<string>();
  readonly opens: InputSignal<string | undefined> = input<string>();
  readonly closeOnAutoApply: InputSignal<boolean> = input(true);

  readonly minDate: InputSignalWithTransform<Dayjs | null | undefined, Dayjs | string> = input(undefined, {
    transform: (value: Dayjs | string): Dayjs | null | undefined => {
      dayjs.isDayjs(value) ? this._minDate = value : this._minDate = dayjs(value);
      return this._minDate;
    }
  });

  readonly maxDate: InputSignalWithTransform<Dayjs | null | undefined, Dayjs | string> = input(undefined, {
    transform: (value: Dayjs | string): Dayjs | null | undefined => {
      dayjs.isDayjs(value) ? this._maxDate = value : this._maxDate = dayjs(value);
      return this._maxDate;
    }
  });

  readonly locale: InputSignal<any> = model<any>({});
  readonly _locale: Signal<any> = computed((): any => this.locale() !== null ? {...this._localeService.config, ...this.locale()} : {});

  readonly ranges: InputSignalWithTransform<any, any> = input({}, { // custom ranges
    transform: (value: any): any => {
      this._ranges = value;
      this.renderRanges();
      return this._ranges;
    }
  });

  readonly isInvalidDate: InputSignal<Function | null | undefined> = input<Function | null | undefined>((): boolean => false);
  readonly isCustomDate: InputSignal<Function | null | undefined> = input<Function | null | undefined>((): boolean => false);
  readonly isTooltipDate: InputSignal<Function | null | undefined> = input<Function | null | undefined>((): null => null);

  readonly isShown: WritableSignal<Boolean> = signal<Boolean>(false);
  readonly pickerContainer: Signal<ElementRef | undefined> = viewChild<ElementRef>('pickerContainer');

  readonly chosenDate: OutputEmitterRef<Object> = output();
  readonly rangeClicked: OutputEmitterRef<Object> = output();
  readonly datesUpdated: OutputEmitterRef<Object> = output();
  readonly startDateChanged: OutputEmitterRef<Object> = output();
  readonly endDateChanged: OutputEmitterRef<Object> = output();
  readonly cancelClicked: OutputEmitterRef<void> = output();
  readonly clearClicked: OutputEmitterRef<void> = output();

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  ngOnInit(): void {
    this._buildLocale();
    const daysOfWeek: any[] = [...this._locale().daysOfWeek];
    this._locale().firstDay = this._locale().firstDay % 7;
    if (this._locale().firstDay !== 0) {
      let iterator: any = this._locale().firstDay;
      while (iterator > 0) {
        daysOfWeek.push(daysOfWeek.shift());
        iterator--;
      }
    }
    this._locale().daysOfWeek = daysOfWeek;
    if (this.inline) {
      this.applyBtnDisabled.set(true);
      this._old.start = this.startDate()?.clone();
      this._old.end = this.endDate()?.clone();
    }
    const timePicker: Boolean = this.timePicker();
    if (this.startDate() && timePicker) {
      this.setStartDate(this.startDate());
      this.renderTimePicker(SideEnum.left);
    }
    if (this.endDate() && timePicker) {
      this.setEndDate(this.endDate());
      this.renderTimePicker(SideEnum.right);
    }
    this.updateMonthsInView();
    this.renderCalendar(SideEnum.left);
    this.renderCalendar(SideEnum.right);
    this.renderRanges();
  }

  renderRanges(): void {
    this.rangesArray = [];
    let start: any, end: any;
    if (typeof this.ranges() === 'object') {
      for (const range in this.ranges()) {
        if (this.ranges()[range]) {
          if (typeof this.ranges()[range][0] === 'string') {
            start = dayjs(this.ranges()[range][0], this._locale().format);
          } else {
            start = dayjs(this.ranges()[range][0]);
          }
          if (typeof this.ranges()[range][1] === 'string') {
            end = dayjs(this.ranges()[range][1], this._locale().format);
          } else {
            end = dayjs(this.ranges()[range][1]);
          }
          // If the start or end date exceed those allowed by the minDate or maxSpan
          // options, shorten the range to the allowable period.
          if (this.minDate() && start.isBefore(this.minDate())) {
            start = this.minDate()?.clone();
          }
          let maxDate: Dayjs | null | undefined = this.maxDate();
          const maxSpan: Boolean = this.maxSpan();
          if (maxSpan && maxDate && start.clone().add(maxSpan).isAfter(maxDate)) {
            maxDate = start.clone().add(maxSpan);
          }
          if (maxDate && end.isAfter(maxDate)) {
            end = maxDate.clone();
          }
          // If the end of the range is before the minimum or the start of the range is
          // after the maximum, don't display this range option at all.
          const timePicker: Boolean = this.timePicker();
          if ((this.minDate() && end.isBefore(this.minDate(), timePicker ? 'minute' : 'day'))
            || (maxDate && start.isAfter(maxDate, timePicker ? 'minute' : 'day'))) {
            continue;
          }
          // Support unicode chars in the range names.
          const elem: HTMLTextAreaElement = document.createElement('textarea');
          elem.innerHTML = range;
          const rangeHtml: string = elem.value;
          this.ranges()[rangeHtml] = [start, end];
        }
      }
      for (const range in this.ranges()) {
        if (this.ranges()[range]) {
          this.rangesArray.push(range);
        }
      }
      if (this.showCustomRangeLabel()) {
        this.rangesArray.push(this._locale().customRangeLabel);
      }
      this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars();
      if (!this.timePicker()) {
        this.startDate.set(this.startDate()?.startOf('day'));
        this.endDate.set(this.endDate()?.endOf('day'));
      }
    }
  }

  renderTimePicker(side: SideEnum): void {
    let selected: any, minDate: any;
    const maxDate: Dayjs | null | undefined = this.maxDate();
    if (side === SideEnum.left) {
      selected = this.startDate()?.clone();
      minDate = this.minDate();
    } else if (side === SideEnum.right && this.endDate()) {
      selected = this.endDate()?.clone();
      minDate = this.startDate();
    } else if (side === SideEnum.right && !this.endDate()) {
      // don't have an end date, use the start date then put the selected time for the right side as the time
      selected = this._getDateWithTime(this.startDate(), SideEnum.right);
      if (selected.isBefore(this.startDate())) {
        selected = this.startDate()?.clone();  // set it back to the start date the time was backwards
      }
      minDate = this.startDate();
    }
    const start: number = this.timePicker24Hour() ? this.timePicker24HourInterval()[0] : 1;
    const end: number = this.timePicker24Hour() ? this.timePicker24HourInterval()[1] : 12;
    this.timepickerVariables[side] = {
      hours: [],
      minutes: [],
      minutesLabel: [],
      seconds: [],
      secondsLabel: [],
      disabledHours: [],
      disabledMinutes: [],
      disabledSeconds: [],
      selectedHour: 0,
      selectedMinute: 0,
      selectedSecond: 0
    };
    // generate hours
    for (let i: number = start; i <= end; i++) {
      let i_in_24: number = i;
      if (!this.timePicker24Hour()) {
        i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : (i === 12 ? 0 : i);
      }
      const time: any = selected.clone().hour(i_in_24);
      let disabled: boolean = false;
      if (minDate && time.minute(59).isBefore(minDate)) {
        disabled = true;
      }
      if (maxDate && time.minute(0).isAfter(maxDate)) {
        disabled = true;
      }
      this.timepickerVariables[side].hours.push(i);
      if (i_in_24 === selected.hour() && !disabled) {
        this.timepickerVariables[side].selectedHour = i;
      } else if (disabled) {
        this.timepickerVariables[side].disabledHours.push(i);
      }
    }
    // generate minutes
    for (let i: number = 0; i < 60; i += this.timePickerIncrement()) {
      const padded: string | number = i < 10 ? '0' + i : i;
      const time: any = selected.clone().minute(i);
      let disabled: boolean = false;
      if (minDate && time.second(59).isBefore(minDate)) {
        disabled = true;
      }
      if (maxDate && time.second(0).isAfter(maxDate)) {
        disabled = true;
      }
      this.timepickerVariables[side].minutes.push(i);
      this.timepickerVariables[side].minutesLabel.push(padded);
      if (selected.minute() === i && !disabled) {
        this.timepickerVariables[side].selectedMinute = i;
      } else if (disabled) {
        this.timepickerVariables[side].disabledMinutes.push(i);
      }
    }
    // generate seconds
    if (this.timePickerSeconds()) {
      for (let i: number = 0; i < 60; i++) {
        const padded: string | number = i < 10 ? '0' + i : i;
        const time: any = selected.clone().second(i);
        let disabled: boolean = false;
        if (minDate && time.isBefore(minDate)) {
          disabled = true;
        }
        if (maxDate && time.isAfter(maxDate)) {
          disabled = true;
        }
        this.timepickerVariables[side].seconds.push(i);
        this.timepickerVariables[side].secondsLabel.push(padded);
        if (selected.second() === i && !disabled) {
          this.timepickerVariables[side].selectedSecond = i;
        } else if (disabled) {
          this.timepickerVariables[side].disabledSeconds.push(i);
        }
      }
    }
    // generate AM/PM
    if (!this.timePicker24Hour()) {
      if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
        this.timepickerVariables[side].amDisabled = true;
      }
      if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
        this.timepickerVariables[side].pmDisabled = true;
      }
      if (selected.hour() >= 12) {
        this.timepickerVariables[side].ampmModel = 'PM';
      } else {
        this.timepickerVariables[side].ampmModel = 'AM';
      }
    }
    this.timepickerVariables[side].selected = selected;
  }

  renderCalendar(side: SideEnum): void { // side model
    const mainCalendar: any = (side === SideEnum.left) ? this.leftCalendar : this.rightCalendar;
    const month: any = mainCalendar.month.month();
    const year: any = mainCalendar.month.year();
    const hour: any = mainCalendar.month.hour();
    const minute: any = mainCalendar.month.minute();
    const second: any = mainCalendar.month.second();
    const daysInMonth: number = dayjs(new Date(year, month)).daysInMonth();
    const firstDay: Dayjs = dayjs(new Date(year, month, 1));
    const lastDay: Dayjs = dayjs(new Date(year, month, daysInMonth));
    const lastMonth: number = dayjs(firstDay).subtract(1, 'month').month();
    const lastYear: number = dayjs(firstDay).subtract(1, 'month').year();
    const daysInLastMonth: number = dayjs(new Date(lastYear, lastMonth)).daysInMonth();
    const dayOfWeek: number = firstDay.day();
    // initialize a 6 rows x 7 columns array for the calendar
    const calendar: any = [];
    calendar.firstDay = firstDay;
    calendar.lastDay = lastDay;
    for (let i: number = 0; i < 6; i++) calendar[i] = [];
    // populate the calendar with date objects
    let startDay: any = daysInLastMonth - dayOfWeek + this._locale().firstDay + 1;
    if (startDay > daysInLastMonth) startDay -= 7;
    if (dayOfWeek === this._locale().firstDay) startDay = daysInLastMonth - 6;
    let curDate: Dayjs = dayjs(new Date(lastYear, lastMonth, startDay, 12, minute, second));
    for (let i: number = 0, col: number = 0, row: number = 0; i < 42; i++, col++, curDate = dayjs(curDate).add(24, 'hour')) {
      if (i > 0 && col % 7 === 0) {
        col = 0;
        row++;
      }
      calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
      curDate = curDate.hour(12);
      if (this.minDate() && calendar[row][col].format('YYYY-MM-DD') === this.minDate()?.format('YYYY-MM-DD') &&
        calendar[row][col].isBefore(this.minDate()) && side === 'left') {
        calendar[row][col] = this.minDate()?.clone();
      }
      if (this.maxDate() && calendar[row][col].format('YYYY-MM-DD') === this.maxDate()?.format('YYYY-MM-DD') &&
        calendar[row][col].isAfter(this.maxDate()) && side === 'right') {
        calendar[row][col] = this.maxDate()?.clone();
      }
    }
    // make the calendar object available to hoverDate/clickDate
    if (side === SideEnum.left) {
      this.leftCalendar.calendar = calendar;
    } else {
      this.rightCalendar.calendar = calendar;
    }
    //
    // Display the calendar
    //
    let minDate: Dayjs | null | undefined = side === 'left' ? this.minDate() : this.startDate();
    let maxDate: Dayjs | null | undefined = this.maxDate();
    // adjust maxDate to reflect the dateLimit setting in order to
    // grey out end dates beyond the dateLimit
    const dateLimit: number | null = this.dateLimit();
    if (this.endDate() === null && dateLimit) {
      const maxLimit: Dayjs | undefined = this.startDate()?.clone().add(dateLimit, 'day').endOf('day');
      if (!maxDate || maxLimit?.isBefore(maxDate)) maxDate = maxLimit;
      if (this.customRangeDirection()) {
        minDate = this.minDate();
        const minLimit: Dayjs | undefined = this.startDate()?.clone().subtract(dateLimit, 'day').endOf('day');
        if (!minDate || minLimit?.isAfter(minDate)) {
          minDate = minLimit;
        }
      }
    }
    this.calendarVariables[side] = {
      month: month,
      year: year,
      hour: hour,
      minute: minute,
      second: second,
      daysInMonth: daysInMonth,
      firstDay: firstDay,
      lastDay: lastDay,
      lastMonth: lastMonth,
      lastYear: lastYear,
      daysInLastMonth: daysInLastMonth,
      dayOfWeek: dayOfWeek,
      // other vars
      calRows: Array.from(Array(6).keys()),
      calCols: Array.from(Array(7).keys()),
      classes: {},
      minDate: minDate,
      maxDate: maxDate,
      calendar: calendar
    };
    if (this.showDropdowns()) {
      const currentMonth: any = calendar[1][1].month();
      const currentYear: any = calendar[1][1].year();
      const realCurrentYear: number = dayjs().year();
      const maxYear: number = (maxDate && maxDate.year()) || (realCurrentYear + 5);
      const minYear: number = (minDate && minDate.year()) || (realCurrentYear - 50);
      const inMinYear: boolean = currentYear === minYear;
      const inMaxYear: boolean = currentYear === maxYear;
      const years: any[] = [];
      for (let y: number = minYear; y <= maxYear; y++) years.push(y);
      this.calendarVariables[side].dropdowns = {
        currentMonth: currentMonth,
        currentYear: currentYear,
        maxYear: maxYear,
        minYear: minYear,
        inMinYear: inMinYear,
        inMaxYear: inMaxYear,
        monthArrays: Array.from(Array(12).keys()),
        yearArrays: years
      };
    }
    this._buildCells(calendar, side);
  }

  setStartDate(startDate: any): void {
    if (typeof startDate === 'string') this.startDate.set(dayjs(startDate, this._locale().format));
    if (typeof startDate === 'object') {
      this.pickingDate = true;
      this.startDate.set(dayjs(startDate));
    }
    const timePicker: Boolean = this.timePicker();
    if (!timePicker) {
      this.pickingDate = true;
      this.startDate.set(this.startDate()?.startOf('day'));
    }
    const timePickerIncrement: number = this.timePickerIncrement();
    if (timePicker && timePickerIncrement) {
      this.startDate.set(this.startDate()?.minute(Math.round(this.startDate()!.minute() / timePickerIncrement) * timePickerIncrement));
    }
    if (this.minDate() && this.startDate()?.isBefore(this.minDate())) {
      this.startDate.set(this.minDate()?.clone());
      if (timePicker && timePickerIncrement) {
        this.startDate.set(this.startDate()?.minute(Math.round(this.startDate()!.minute() / timePickerIncrement) * timePickerIncrement));
      }
    }
    if (this.maxDate() && this.startDate()?.isAfter(this.maxDate())) {
      this.startDate.set(this.maxDate()?.clone());
      if (timePicker && timePickerIncrement) {
        this.startDate.set(this.startDate()?.minute(Math.floor(this.startDate()!.minute() / timePickerIncrement) * timePickerIncrement));
      }
    }
    if (!this.isShown()) {
      this.updateElement();
    }
    this.startDateChanged.emit({startDate: this.startDate()});
    this.updateMonthsInView();
  }

  setEndDate(endDate: any): void {
    if (typeof endDate === 'string') {
      this.endDate.set(dayjs(endDate, this._locale().format));
    }
    if (typeof endDate === 'object') {
      this.pickingDate = false;
      this.endDate.set(dayjs(endDate));
    }
    const timePicker: Boolean = this.timePicker();
    if (!timePicker) {
      this.pickingDate = false;
      this.endDate.set(this.endDate()?.add(1, 'd').startOf('day').subtract(1, 'second'));
    }
    const timePickerIncrement: number = this.timePickerIncrement();
    if (timePicker && timePickerIncrement) {
      this.endDate()?.minute(Math.round(this.endDate()!.minute() / timePickerIncrement) * timePickerIncrement);
    }
    if (this.endDate()?.isBefore(this.startDate())) {
      this.endDate.set(this.startDate()?.clone());
    }
    if (this.maxDate() && this.endDate()?.isAfter(this.maxDate())) {
      this.endDate.set(this.maxDate()?.clone());
    }
    const dateLimit: number | null = this.dateLimit();
    if (dateLimit && this.startDate()?.clone().add(dateLimit, 'day').isBefore(this.endDate())) {
      this.endDate.set(this.startDate()!.clone().add(dateLimit, 'day'));
    }
    if (!this.isShown()) {
      // this.updateElement();
    }
    this.endDateChanged.emit({endDate: this.endDate()});
    this.updateMonthsInView();
  }

  updateView(): void {
    if (this.timePicker()) {
      this.renderTimePicker(SideEnum.left);
      this.renderTimePicker(SideEnum.right);
    }
    this.updateMonthsInView();
    this.updateCalendars();
  }

  updateMonthsInView(): void {
    const singleDatePicker: Boolean = this.singleDatePicker();
    const linkedCalendars: Boolean = this.linkedCalendars();
    if (this.endDate()) {
      // if both dates are visible already, do nothing
      if (!singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
        ((this.startDate() && this.leftCalendar && this.startDate()?.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
          (this.startDate() && this.rightCalendar && this.startDate()?.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
        &&
        (this.endDate()?.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
          this.endDate()?.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))
      ) {
        return;
      }
      if (this.startDate()) {
        this.leftCalendar.month = this.startDate()?.clone().date(2);
        if (!linkedCalendars && (this.endDate()?.month() !== this.startDate()?.month() ||
          this.endDate()?.year() !== this.startDate()?.year())) {
          this.rightCalendar.month = this.endDate()?.clone().date(2);
        } else {
          this.rightCalendar.month = this.startDate()?.clone().date(2).add(1, 'month');
        }
      }
    } else {
      if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate()?.format('YYYY-MM') &&
        this.rightCalendar.month.format('YYYY-MM') !== this.startDate()?.format('YYYY-MM')) {
        this.leftCalendar.month = this.startDate()?.clone().date(2);
        this.rightCalendar.month = this.startDate()?.clone().date(2).add(1, 'month');
      }
    }
    if (this.maxDate() && linkedCalendars && !singleDatePicker && this.rightCalendar.month > <Dayjs>this.maxDate()) {
      this.rightCalendar.month = this.maxDate()?.clone().date(2);
      this.leftCalendar.month = this.maxDate()?.clone().date(2).subtract(1, 'month');
    }
  }

  /**
   *  This is responsible for updating the calendars
   */
  updateCalendars(): void {
    this.renderCalendar(SideEnum.left);
    this.renderCalendar(SideEnum.right);
    if (this.endDate() === null) {
      return;
    }
    this.calculateChosenLabel();
  }

  updateElement(): void {
    const format: any = this._locale().displayFormat ? this._locale().displayFormat : this._locale().format;
    const autoUpdateInput: Boolean = this.autoUpdateInput();
    if (!this.singleDatePicker() && autoUpdateInput) {
      if (this.startDate() && this.endDate()) {
        // if we use ranges and should show range label on input
        if (this.rangesArray.length && this.showRangeLabelOnInput() && this.chosenRange &&
          this._locale().customRangeLabel !== this.chosenRange) {
          this.chosenLabel = this.chosenRange;
        } else {
          this.chosenLabel = this.startDate()?.format(format) +
            this._locale().separator + this.endDate()?.format(format);
        }
      }
    } else if (autoUpdateInput) {
      this.chosenLabel = this.startDate()?.format(format);
    }
  }

  remove(): void {
    this.isShown.set(false);
  }

  /**
   * this should calculate the label
   */
  calculateChosenLabel(): void {
    if (!this._locale() || !this._locale().separator) {
      this._buildLocale();
    }
    let customRange: boolean = true;
    let i: number = 0;
    if (this.rangesArray.length > 0) {
      for (const range in this.ranges()) {
        if (this.ranges()[range]) {
          if (this.timePicker()) {
            const format: string = this.timePickerSeconds() ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
            // ignore times when comparing dates if time picker seconds is not enabled
            if (this.startDate()?.format(format) === this.ranges()[range][0].format(format)
              && this.endDate()?.format(format) === this.ranges()[range][1].format(format)) {
              customRange = false;
              this.chosenRange = this.rangesArray[i];
              break;
            }
          } else {
            // ignore times when comparing dates if time picker is not enabled
            if (this.startDate()?.format('YYYY-MM-DD') === this.ranges()[range][0].format('YYYY-MM-DD')
              && this.endDate()?.format('YYYY-MM-DD') === this.ranges()[range][1].format('YYYY-MM-DD')) {
              customRange = false;
              this.chosenRange = this.rangesArray[i];
              break;
            }
          }
          i++;
        }
      }
      if (customRange) {
        if (this.showCustomRangeLabel()) {
          this.chosenRange = this._locale().customRangeLabel;
        } else {
          this.chosenRange = null;
        }
        // if custom label: show calendar
        this.showCalInRanges = true;
      }
    }
    this.updateElement();
  }

  clickApply(e?: any): void {
    if (this.inline) this.applyBtnDisabled.set(true);
    if (!this.singleDatePicker() && this.startDate() && !this.endDate()) {
      this.endDate.set(this._getDateWithTime(this.startDate(), SideEnum.right));
      this.calculateChosenLabel();
    }
    if (this.startDate() && this.endDate()) {
      // get if there are invalid date between range
      let date: Dayjs | undefined = this.startDate()?.clone();
      while (date?.isBefore(this.endDate())) {
        if (this.isInvalidDate()!(date)) {
          this.endDate.set(date.subtract(1, 'days'));
          this.calculateChosenLabel();
          break;
        }
        date = date.add(1, 'days');
      }
    }
    if (this.chosenLabel) {
      this.chosenDate.emit({chosenLabel: this.chosenLabel, startDate: this.startDate(), endDate: this.endDate()});
    }
    this.datesUpdated.emit({startDate: this.startDate(), endDate: this.endDate(), label: this.chosenRange});
    if (e || (this.closeOnAutoApply() && !e)) {
      this.hide();
    }
  }

  clickCancel(e: any): void {
    this.startDate.set(this._old.start);
    this.endDate.set(this._old.end);
    if (this.inline) {
      this.updateView();
    }
    this.cancelClicked.emit();
    this.hide();
    this.clearIncompleteDateSelection();
  }

  /**
   * called when month is changed
   * @param object get month value in $event.target.value / side left or right
   */
  monthChanged(object: { $event: any, side: SideEnum }): void {
    const {$event, side} = object;
    const year: any = this.calendarVariables[side].dropdowns.currentYear;
    const month: number = parseInt($event.target.value, 10);
    this.monthOrYearChanged(month, year, side);
  }

  /**
   * called when year is changed
   * @param object get year value in $event.target.value / side left or right
   */
  yearChanged(object: { $event: any, side: SideEnum }): void {
    const {$event, side} = object;
    const month: any = this.calendarVariables[side].dropdowns.currentMonth;
    const year: number = parseInt($event.target.value, 10);
    this.monthOrYearChanged(month, year, side);
  }

  /**
   * called when time is changed
   * @param object time $event / side left or right
   */
  timeChanged(object: { $event: any, side: SideEnum }): void {
    const {$event, side} = object;
    let hour: number = parseInt(this.timepickerVariables[side].selectedHour, 10);
    const minute: number = parseInt(this.timepickerVariables[side].selectedMinute, 10);
    const second: number = this.timePickerSeconds() ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
    if (!this.timePicker24Hour()) {
      const ampm: any = this.timepickerVariables[side].ampmModel;
      if (ampm === 'PM' && hour < 12) {
        hour += 12;
      }
      if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }
    }
    if (side === SideEnum.left) {
      let start: Dayjs | undefined = this.startDate()?.clone();
      start = start?.hour(hour);
      start = start?.minute(minute);
      start = start?.second(second);
      this.setStartDate(start);
      this.setEndDate(this.endDate()?.clone());
      if (this.singleDatePicker()) {
        this.endDate.set(this.startDate()?.clone());
      } else if (this.endDate() && this.endDate()?.format('YYYY-MM-DD') === start?.format('YYYY-MM-DD') && this.endDate()?.isBefore(start)) {
        this.setEndDate(start?.clone());
      } else if (!this.endDate() && this.timePicker()) {
        const startClone: Dayjs = this._getDateWithTime(start, SideEnum.right);
        if (startClone.isBefore(start)) {
          this.timepickerVariables[SideEnum.right].selectedHour = hour;
          this.timepickerVariables[SideEnum.right].selectedMinute = minute;
          this.timepickerVariables[SideEnum.right].selectedSecond = second;
        }
      }
    } else if (this.endDate()) {
      this.setStartDate(this.startDate()?.clone());
      let end: Dayjs | undefined = this.endDate()?.clone();
      end = end?.hour(hour);
      end = end?.minute(minute);
      end = end?.second(second);
      this.setEndDate(end);
    }
    // update the calendars so all clickable dates reflect the new time component
    this.updateCalendars();
    // re-render the time pickers because changing one selection can affect what's enabled in another
    this.renderTimePicker(SideEnum.left);
    this.renderTimePicker(SideEnum.right);
    if (this.autoApply()) {
      this.clickApply();
    }
    this.applyBtnDisabled.set(false);
  }

  /**
   *  call when month or year changed
   * @param month month number 0 -11
   * @param year year eg: 1995
   * @param side left or right
   */
  monthOrYearChanged(month: number, year: number, side: SideEnum): void {
    const isLeft: boolean = side === SideEnum.left;
    if (!isLeft) {
      if (year < this.startDate()!.year() || (year === this.startDate()!.year() && month < this.startDate()!.month())) {
        month = this.startDate()!.month();
        year = this.startDate()!.year();
      }
    }
    if (this.minDate()) {
      if (year < this.minDate()!.year() || (year === this.minDate()!.year() && month < this.minDate()!.month())) {
        month = this.minDate()!.month();
        year = this.minDate()!.year();
      }
    }
    if (this.maxDate()) {
      if (year > this.maxDate()!.year() || (year === this.maxDate()!.year() && month > this.maxDate()!.month())) {
        month = this.maxDate()!.month();
        year = this.maxDate()!.year();
      }
    }
    this.calendarVariables[side].dropdowns.currentYear = year;
    this.calendarVariables[side].dropdowns.currentMonth = month;
    if (isLeft) {
      this.leftCalendar.month = this.leftCalendar.month.month(month).year(year);
      if (this.linkedCalendars()) {
        this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
      }
    } else {
      this.rightCalendar.month = this.rightCalendar.month.month(month).year(year);
      if (this.linkedCalendars()) {
        this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
      }
    }
    this.updateCalendars();
  }

  /**
   * Click on previous month
   * @param object previous $event / side left or right calendar
   */
  clickPrev(object: { $event: MouseEvent, side: SideEnum }): void {
    const {$event, side} = object;
    if (side === SideEnum.left) {
      this.leftCalendar.month = this.leftCalendar.month.subtract(1, 'month');
      if (this.linkedCalendars()) {
        this.rightCalendar.month = this.rightCalendar.month.subtract(1, 'month');
      }
    } else {
      this.rightCalendar.month = this.rightCalendar.month.subtract(1, 'month');
    }
    this.updateCalendars();
  }

  /**
   * Click on next month
   * @param object next $event / side left or right calendar
   */
  clickNext(object: { $event: MouseEvent, side: SideEnum }): void {
    const {$event, side} = object;
    if (side === SideEnum.left) {
      this.leftCalendar.month = this.leftCalendar.month.add(1, 'month');
    } else {
      this.rightCalendar.month = this.rightCalendar.month.add(1, 'month');
      if (this.linkedCalendars()) {
        this.leftCalendar.month = this.leftCalendar.month.add(1, 'month');
      }
    }
    this.updateCalendars();
  }

  /**
   * When hovering a date
   * @param object get value by $event.target.value / side left or right / row or col position of the current date clicked
   */
  hoverDate(object: { $event: any, side: SideEnum, row: number, col: number }): void {
    const {$event, side, row, col} = object;
    const leftCalDate: any = this.calendarVariables.left.calendar[row][col];
    const rightCalDate: any = this.calendarVariables.right.calendar[row][col];
    if (this.pickingDate) {
      this.nowHoveredDate = side === SideEnum.left ? leftCalDate : rightCalDate;
      this.renderCalendar(SideEnum.left);
      this.renderCalendar(SideEnum.right);
    }
    const tooltip: any = side === SideEnum.left ? this.tooltiptext[leftCalDate] : this.tooltiptext[rightCalDate];
    if (tooltip.length > 0) {
      $event.target.setAttribute('title', tooltip);
    }
  }

  /**
   * When selecting a date
   * @param object get value by $event.target.value / side left or right / row or col position of the current date clicked
   */
  clickDate(object: { $event: any, side: SideEnum, row: number, col: number }): void {
    const {$event, side, row, col} = object;
    if ($event.target.tagName === 'TD') {
      if (!$event.target.classList.contains('available')) return;
    } else if ($event.target.tagName === 'SPAN') {
      if (!$event.target.parentElement.classList.contains('available')) return;
    }
    if (this.rangesArray.length) {
      this.chosenRange = this._locale().customRangeLabel;
    }
    let date: any = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
    const customRangeDirection: boolean = this.customRangeDirection();
    const autoApply: Boolean = this.autoApply();
    if ((this.endDate() || (date.isBefore(this.startDate(), 'day') && !customRangeDirection)) && !this.lockStartDate()) { // picking start
      this.applyBtnDisabled.set(true);
      if (this.timePicker()) {
        date = this._getDateWithTime(date, SideEnum.left);
      }
      this.endDate.set(null);
      this.setStartDate(date.clone());
    } else if (!this.endDate() && date.isBefore(this.startDate()) && !customRangeDirection) {
      // special case: clicking the same date for start/end,
      // but the time of the end date is before the start date
      this.setEndDate(this.startDate()?.clone());
    } else { // picking end
      this.applyBtnDisabled.set(false);
      if (this.timePicker()) {
        date = this._getDateWithTime(date, SideEnum.right);
      }
      if (date.isBefore(this.startDate(), 'day') === true && customRangeDirection) {
        this.setEndDate(this.startDate());
        this.setStartDate(date.clone());
      } else {
        this.setEndDate(date.clone());
      }
      if (autoApply) {
        this.calculateChosenLabel();
      }
    }
    if (this.singleDatePicker()) {
      this.applyBtnDisabled.set(false);
      this.setEndDate(this.startDate());
      this.updateElement();
    }
    this.updateView();
    if (autoApply && this.startDate() && this.endDate()) {
      this.clickApply();
    }
    // This is to cancel the blur event handler if the mouse was in one of the inputs
    $event.stopPropagation();
  }

  /**
   *  Click on the custom range
   * @param object $event / label
   */
  clickRange(object: { $event: MouseEvent, label: string }): void {
    const {$event, label} = object;
    this.chosenRange = label;
    if (label === this._locale().customRangeLabel) {
      this.isShown.set(true); // show calendars
      this.showCalInRanges = true;
      // disable apply button after selecting custom range
      this.applyBtnDisabled.set(true);
    } else {
      const dates: any = this.ranges()[label];
      this.startDate.set(dates[0].clone());
      this.endDate.set(dates[1].clone());
      if (this.showRangeLabelOnInput() && label !== this._locale().customRangeLabel) {
        this.chosenLabel = label;
      } else {
        this.calculateChosenLabel();
      }
      this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars();
      const timePicker: Boolean = this.timePicker();
      if (!timePicker) {
        this.startDate.set(this.startDate()?.startOf('day'));
        this.endDate.set(this.endDate()?.endOf('day'));
      }
      const alwaysShowCalendars: Boolean = this.alwaysShowCalendars();
      if (!alwaysShowCalendars) {
        this.isShown.set(false); // hide calendars
      }
      this.rangeClicked.emit({label: label, dates: dates});
      if (!this.keepCalendarOpeningWithRange() || this.autoApply()) {
        this.clickApply();
      } else {
        if (!alwaysShowCalendars) {
          return this.clickApply();
        }
        if (this.maxDate() && this.maxDate()?.isSame(dates[0], 'month')) {
          this.rightCalendar.month = this.rightCalendar.month.month(dates[0].month());
          this.rightCalendar.month = this.rightCalendar.month.year(dates[0].year());
          this.leftCalendar.month = this.leftCalendar.month.month(dates[0].month() - 1);
          this.leftCalendar.month = this.leftCalendar.month.year(dates[1].year());
        } else {
          this.leftCalendar.month = this.leftCalendar.month.month(dates[0].month());
          this.leftCalendar.month = this.leftCalendar.month.year(dates[0].year());
          // get the next year
          const nextMonth: any = dates[0].clone().add(1, 'month');
          this.rightCalendar.month = this.rightCalendar.month.month(nextMonth.month());
          this.rightCalendar.month = this.rightCalendar.month.year(nextMonth.year());
        }
        this.updateCalendars();
        if (timePicker) {
          this.renderTimePicker(SideEnum.left);
          this.renderTimePicker(SideEnum.right);
        }
        // enable apply button after selecting a range
        this.applyBtnDisabled.set(false);
      }
    }
  }

  show(e?: any): void {
    if (this.isShown()) return;
    this._old.start = this.startDate()?.clone();
    this._old.end = this.endDate()?.clone();
    this.isShown.set(true);
    this.applyBtnDisabled.set(true);
    this.updateView();
  }

  hide(e?: any): void {
    if (!this.isShown()) return;
    // incomplete date selection, revert to last values
    if (!this.endDate()) {
      if (this._old.start) this.startDate.set(this._old.start.clone());
      if (this._old.end) this.endDate.set(this._old.end.clone());
      this.clearIncompleteDateSelection();
    }
    // if a new date range was selected, invoke the user callback function
    if (!this.startDate()?.isSame(this._old.start) || !this.endDate()?.isSame(this._old.end)) {
      // this.callback(this.startDate(), this.endDate(), this.chosenLabel);
    }
    // if picker is attached to a text input, update it
    this.updateElement();
    this.isShown.set(false);
    this.applyBtnDisabled.set(true);
  }

  clearIncompleteDateSelection(): void {
    this.nowHoveredDate = null;
    this.pickingDate = false;
  }

  /**
   * handle click on all element in the component, useful for outside of click
   * @param e event
   */
  handleInternalClick(e: any): void {
    e.stopPropagation();
  }

  /**
   * update the locale options
   * @param locale
   */
  updateLocale(locale: any): void {
    for (const key in locale) {
      if (locale.hasOwnProperty(key)) {
        this._locale()[key] = locale[key];
      }
    }
  }

  /**
   *  clear the daterange picker
   */
  clickClear($event: any): void {
    const start: number = this.timePicker24HourInterval()[0];
    const end: number = this.timePicker24HourInterval()[1];
    this.startDate.set(this.timePicker24Hour() && start !== 0 ? dayjs().startOf('day').add(start, 'hours') : dayjs().startOf('day'));
    this.endDate.set(this.timePicker24Hour() && end !== 23 ? dayjs().startOf('day').add(end, 'hours') : dayjs().endOf('day'));
    this.chosenDate.emit({chosenLabel: '', startDate: null, endDate: null});
    this.datesUpdated.emit({startDate: null, endDate: null});
    this.clearClicked.emit();
    this.hide();
  }

  /**
   * Find out if the selected range should be disabled if it doesn't
   * fit into minDate and maxDate limitations.
   */
  disableRange(range: any): any {
    if (range === this._locale().customRangeLabel) {
      return false;
    }
    const rangeMarkers: any = this.ranges()[range];
    const areBothBefore: any = rangeMarkers.every((date: any): any => {
      if (!this.minDate()) {
        return false;
      }
      return date.isBefore(this.minDate());
    });
    const areBothAfter: any = rangeMarkers.every((date: any): any => {
      if (!this.maxDate()) {
        return false;
      }
      return date.isAfter(this.maxDate());
    });
    return (areBothBefore || areBothAfter);
  }

  /**
   *
   * @param date the date to add time
   * @param side left or right
   */
  private _getDateWithTime(date: any, side: SideEnum): Dayjs {
    let hour: number = parseInt(this.timepickerVariables[side].selectedHour, 10);
    if (!this.timePicker24Hour()) {
      const ampm: any = this.timepickerVariables[side].ampmModel;
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
    }
    const minute: number = parseInt(this.timepickerVariables[side].selectedMinute, 10);
    const second: number = this.timePickerSeconds() ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
    return date.clone().hour(hour).minute(minute).second(second);
  }

  /**
   *  build the locale config
   */
  private _buildLocale(): void {
    if (!this._locale().format) {
      if (this.timePicker()) {
        this._locale().format = dayjs.localeData().longDateFormat('lll');
      } else {
        this._locale().format = dayjs.localeData().longDateFormat('L');
      }
    }
  }

  private _buildCells(calendar: any, side: SideEnum): void {
    for (let row: number = 0; row < 6; row++) {
      this.calendarVariables[side].classes[row] = {};
      const rowClasses: any[] = [];
      const emptyWeekRowClass: string | null | undefined = this.emptyWeekRowClass();
      if (
        emptyWeekRowClass &&
        Array.from(Array(7).keys()).some((i: number): boolean => calendar[row][i].month() !== this.calendarVariables[side].month)
      ) {
        rowClasses.push(emptyWeekRowClass);
      }
      for (let col: number = 0; col < 7; col++) {
        const classes: any[] = [];
        // empty week row class
        const emptyWeekColumnClass: string | null | undefined = this.emptyWeekColumnClass();
        if (emptyWeekColumnClass) {
          if (calendar[row][col].month() !== this.calendarVariables[side].month) {
            classes.push(emptyWeekColumnClass);
          }
        }
        // highlight today's date
        if (calendar[row][col].isSame(new Date(), 'day')) classes.push('today');
        // highlight weekends
        if (calendar[row][col].isoWeekday() > 5) classes.push('weekend');
        // grey out the dates in other months displayed at beginning and end of this calendar
        if (calendar[row][col].month() !== calendar[1][1].month()) {
          classes.push('off');
          // mark the last day of the previous month in this calendar
          const lastDayOfPreviousMonthClass: string | null | undefined = this.lastDayOfPreviousMonthClass();
          if (
            lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() ||
              calendar[1][1].month() === 0) && calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth
          ) {
            classes.push(lastDayOfPreviousMonthClass);
          }
          // mark the first day of the next month in this calendar
          const firstDayOfNextMonthClass: string | null | undefined = this.firstDayOfNextMonthClass();
          if (
            firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() ||
              calendar[row][col].month() === 0) && calendar[row][col].date() === 1
          ) {
            classes.push(firstDayOfNextMonthClass);
          }
        }
        // mark the first day of the current month with a custom class
        const firstMonthDayClass: string | null | undefined = this.firstMonthDayClass();
        if (
          firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() &&
          calendar[row][col].date() === calendar.firstDay.date()
        ) {
          classes.push(firstMonthDayClass);
        }
        // mark the last day of the current month with a custom class
        const lastMonthDayClass: string | null | undefined = this.lastMonthDayClass();
        if (
          lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() &&
          calendar[row][col].date() === calendar.lastDay.date()) {
          classes.push(lastMonthDayClass);
        }
        // don't allow selection of dates before the minimum date
        if (this.minDate() && calendar[row][col].isBefore(this.minDate(), 'day')) {
          classes.push('off', 'disabled');
        }
        // don't allow selection of dates after the maximum date
        if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
          classes.push('off', 'disabled');
        }
        // don't allow selection of date if a custom function decides it's invalid
        if (this.isInvalidDate()!(calendar[row][col])) {
          classes.push('off', 'disabled', 'invalid');
        }
        // highlight the currently selected start date
        if (this.startDate() && calendar[row][col].format('YYYY-MM-DD') === this.startDate()?.format('YYYY-MM-DD')) {
          classes.push('active', 'start-date');
        }
        // highlight the currently selected end date
        if (this.endDate() != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate()?.format('YYYY-MM-DD')) {
          classes.push('active', 'end-date');
        }
        // highlight dates in-between the selected dates
        if (
          (
            (this.nowHoveredDate != null && this.pickingDate) || this.endDate() != null
          ) &&
          (
            calendar[row][col] > <Dayjs>this.startDate() &&
            (
              calendar[row][col] < <Dayjs>this.endDate() || (calendar[row][col] < <any>this.nowHoveredDate && this.pickingDate)
            )
          ) &&
          (
            !classes.find((el: any): boolean => el === 'off')
          )
        ) {
          classes.push('in-range');
        }
        // apply custom classes for this date
        const isCustom: any = this.isCustomDate()!(calendar[row][col]);
        if (isCustom !== false) {
          if (typeof isCustom === 'string') {
            classes.push(isCustom);
          } else {
            Array.prototype.push.apply(classes, isCustom);
          }
        }
        // apply custom tooltip for this date
        const isTooltip: any = this.isTooltipDate()!(calendar[row][col]);
        if (isTooltip) {
          if (typeof isTooltip === 'string') {
            this.tooltiptext[calendar[row][col]] = isTooltip; // setting tooltiptext for custom date
          } else {
            this.tooltiptext[calendar[row][col]] = 'Put the tooltip as the returned value of isTooltipDate';
          }
        } else {
          this.tooltiptext[calendar[row][col]] = '';
        }
        // store classes var
        let cname: string = '', disabled: boolean = false;
        for (let i: number = 0; i < classes.length; i++) {
          cname += classes[i] + ' ';
          if (classes[i] === 'disabled') {
            disabled = true;
          }
        }
        if (!disabled) {
          cname += 'available';
        }
        this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
      }
      this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
    }
  }

}
