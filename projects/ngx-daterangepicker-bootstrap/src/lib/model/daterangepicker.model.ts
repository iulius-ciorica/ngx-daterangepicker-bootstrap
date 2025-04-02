import {Dayjs} from "dayjs";

export enum SideEnum {
  left = 'left',
  right = 'right'
}

export interface DateRanges {
  [index: string]: [Dayjs, Dayjs];
}

export interface DateRange {
  label: string;
  dates: [Dayjs, Dayjs];
}

export interface ChosenDate {
  chosenLabel: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

export interface TimePeriod {
  [index: string]: Dayjs;

  startDate: Dayjs;
  endDate: Dayjs;
}

export interface StartDate {
  startDate: Dayjs;
}

export interface EndDate {
  endDate: Dayjs;
}

interface TimePickerVariables {
  secondsLabel: string[];
  selectedMinute: number;
  selectedSecond: number;
  hours: number[];
  seconds: number[];
  disabledHours: number[];
  disabledMinutes: number[];
  minutes: number[];
  minutesLabel: string[];
  selectedHour: number;
  disabledSeconds: number[];
  amDisabled?: boolean;
  pmDisabled?: boolean;
  ampmModel?: string;
  selected: Dayjs;
}

interface TimePickerVariablesHolder {
  [index: string]: TimePickerVariables;
}

interface CalendarRowClasses {
  [index: number]: string;

  classList: string;
}

interface CalendarClasses {
  [index: number]: CalendarRowClasses;
}

interface Dropdowns {
  inMaxYear: boolean;
  yearArrays: number[];
  maxYear: number;
  minYear: number;
  currentMonth: number;
  inMinYear: boolean;
  monthArrays: number[];
  currentYear: number;
}

type CalendarArrayWithProps<T> = T[] & { firstDay?: Dayjs; lastDay?: Dayjs };

interface CalendarVariables {
  calRows: number[];
  calCols: number[];
  calendar: CalendarArrayWithProps<Dayjs[]>;
  minDate: Dayjs;
  year: number;
  classes: CalendarClasses;
  lastMonth: number;
  minute: number;
  second: number;
  daysInMonth: number;
  dayOfWeek: number;
  month: number;
  hour: number;
  firstDay: Dayjs;
  lastYear: number;
  lastDay: Dayjs;
  maxDate: Dayjs;
  daysInLastMonth: number;
  dropdowns?: Dropdowns;
}

interface CalendarVariableHolder {
  [index: string]: CalendarVariables;
}

interface VisibleCalendar {
  month: Dayjs;
  calendar: CalendarArrayWithProps<Dayjs[]>;
}
