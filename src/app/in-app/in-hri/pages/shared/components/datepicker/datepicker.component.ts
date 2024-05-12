import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent {
  // public value: Date = new Date(yyyy, MM, dd);
  @Output() datePicked = new EventEmitter();
  public value: Date = new Date();

  public onChange(value: Date): void {
    this.datePicked.emit(value);
  }
}
