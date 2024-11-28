import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'actions',
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {

  @Input() rangesArray: Array<any> = [];
  @Input() autoApply: any;
  @Input() showCalInRanges: any;
  @Input() singleDatePicker: any;
  @Input() chosenLabel: any;
  @Input() applyBtn: any;
  @Input() locale: any;
  @Input() showCancel: any;
  @Input() showClearButton: any;
  @Output() applyEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() clearEvent: EventEmitter<MouseEvent> = new EventEmitter();

  clickApply($event: any) {
    this.applyEvent.emit($event)
  }

  clickCancel($event: any) {
    this.cancelEvent.emit($event)
  }

  clickClear($event: any) {
    this.clearEvent.emit($event)
  }

}
