import {ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
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
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {

  protected readonly sideEnum: typeof SideEnum = SideEnum;

  readonly showCalInRanges: InputSignal<any> = input<any>();
  readonly singleDatePicker: InputSignal<any> = input<any>();
  readonly calendarVariables: InputSignal<any> = input<any>();
  readonly showWeekNumbers: InputSignal<any> = input<any>();
  readonly showISOWeekNumbers: InputSignal<any> = input<any>();
  readonly linkedCalendars: InputSignal<any> = input<any>();
  readonly showDropdowns: InputSignal<any> = input<any>();
  readonly locale: InputSignal<any> = input<any>();
  readonly timePicker: InputSignal<any> = input<any>();
  readonly startDate: InputSignal<any> = input<any>();
  readonly timepickerVariables: InputSignal<any> = input<any>();
  readonly timePickerSeconds: InputSignal<any> = input<any>();
  readonly timePicker24Hour: InputSignal<any> = input<any>();
  readonly prevEvent: OutputEmitterRef<{ $event: MouseEvent, side: SideEnum }> = output();
  readonly nextEvent: OutputEmitterRef<{ $event: MouseEvent, side: SideEnum }> = output();
  readonly monthChangedEvent: OutputEmitterRef<{ $event: Event, side: SideEnum }> = output();
  readonly yearChangedEvent: OutputEmitterRef<{ $event: Event, side: SideEnum }> = output();
  readonly dateEvent: OutputEmitterRef<{ $event: Event, side: SideEnum, row: number, col: number }> = output();
  readonly hoverDateEvent: OutputEmitterRef<{ $event: Event, side: SideEnum, row: number, col: number }> = output();
  readonly timeChangedEvent: OutputEmitterRef<{ $event: Event, side: SideEnum }> = output();

  clickPrev($event: MouseEvent, side: SideEnum): void {
    this.prevEvent.emit({$event: $event, side: side})
  }

  clickNext($event: MouseEvent, side: SideEnum): void {
    this.nextEvent.emit({$event: $event, side: side})
  }

  monthChanged($event: Event, side: SideEnum): void {
    this.monthChangedEvent.emit({$event: $event, side: side})
  }

  yearChanged($event: Event, side: SideEnum): void {
    this.yearChangedEvent.emit({$event: $event, side: side})
  }

  clickDate($event: Event, side: SideEnum, row: number, col: number): void {
    this.dateEvent.emit({$event: $event, side: side, row: row, col: col})
  }

  hoverDate($event: Event, side: SideEnum, row: number, col: number): void {
    this.hoverDateEvent.emit({$event: $event, side: side, row: row, col: col})
  }

  timeChanged($event: Event, side: SideEnum): void {
    this.timeChangedEvent.emit({$event: $event, side: side})
  }

}
