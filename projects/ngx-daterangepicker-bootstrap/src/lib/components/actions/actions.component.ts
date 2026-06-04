import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';

@Component({
  selector: 'actions',
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {

  readonly rangesArray: InputSignal<Array<any>> = input<Array<any>>([]);
  readonly autoApply: InputSignal<any> = input<any>();
  readonly showCalInRanges: InputSignal<any> = input<any>();
  readonly singleDatePicker: InputSignal<any> = input<any>();
  readonly chosenLabel: InputSignal<any> = input<any>();
  readonly applyBtnDisabled: InputSignal<any> = input<any>();
  readonly locale: InputSignal<any> = input<any>();
  readonly showCancel: InputSignal<any> = input<any>();
  readonly showClearButton: InputSignal<any> = input<any>();
  readonly applyEvent: OutputEmitterRef<MouseEvent> = output();
  readonly cancelEvent: OutputEmitterRef<MouseEvent> = output();
  readonly clearEvent: OutputEmitterRef<MouseEvent> = output();

  clickApply($event: any): void {
    this.applyEvent.emit($event)
  }

  clickCancel($event: any): void {
    this.cancelEvent.emit($event)
  }

  clickClear($event: any): void {
    this.clearEvent.emit($event)
  }

}
