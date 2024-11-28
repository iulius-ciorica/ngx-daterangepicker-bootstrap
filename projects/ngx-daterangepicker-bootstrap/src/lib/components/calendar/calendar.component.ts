import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SideEnum} from '../../enums/side.enum';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'calendar',
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  protected readonly sideEnum = SideEnum;

  @Input() showCalInRanges: any;
  @Input() singleDatePicker: any;
  @Input() calendarVariables: any;
  @Input() showWeekNumbers: any;
  @Input() showISOWeekNumbers: any;
  @Input() linkedCalendars: any;
  @Input() showDropdowns: any;
  @Input() locale: any;
  @Input() timePicker: any;
  @Input() startDate: any;
  @Input() timepickerVariables: any;
  @Input() timePickerSeconds: any;
  @Input() timePicker24Hour: any;
  @Output() prevEvent: EventEmitter<{ $event: MouseEvent, side: SideEnum }> = new EventEmitter();
  @Output() nextEvent: EventEmitter<{ $event: MouseEvent, side: SideEnum }> = new EventEmitter();
  @Output() monthChangedEvent: EventEmitter<{ $event: Event, side: SideEnum }> = new EventEmitter();
  @Output() yearChangedEvent: EventEmitter<{ $event: Event, side: SideEnum }> = new EventEmitter();
  @Output() dateEvent: EventEmitter<{ $event: Event, side: SideEnum, row: number, col: number }> = new EventEmitter();
  @Output() hoverDateEvent: EventEmitter<{
    $event: Event,
    side: SideEnum,
    row: number,
    col: number
  }> = new EventEmitter();
  @Output() timeChangedEvent: EventEmitter<{ $event: Event, side: SideEnum }> = new EventEmitter();

  clickPrev($event: MouseEvent, side: SideEnum) {
    this.prevEvent.emit({$event: $event, side: side})
  }

  clickNext($event: MouseEvent, side: SideEnum) {
    this.nextEvent.emit({$event: $event, side: side})
  }

  monthChanged($event: Event, side: SideEnum) {
    this.monthChangedEvent.emit({$event: $event, side: side})
  }

  yearChanged($event: Event, side: SideEnum) {
    this.yearChangedEvent.emit({$event: $event, side: side})
  }

  clickDate($event: Event, side: SideEnum, row: number, col: number) {
    this.dateEvent.emit({$event: $event, side: side, row: row, col: col})
  }

  hoverDate($event: Event, side: SideEnum, row: number, col: number) {
    this.hoverDateEvent.emit({$event: $event, side: side, row: row, col: col})
  }

  timeChanged($event: Event, side: SideEnum) {
    this.timeChangedEvent.emit({$event: $event, side: side})
  }

}
