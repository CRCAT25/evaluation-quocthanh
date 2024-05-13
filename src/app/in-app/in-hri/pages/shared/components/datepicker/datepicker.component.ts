import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent {
  // public value: Date = new Date(yyyy, MM, dd);
  @Output() datePicked = new EventEmitter();
  @Input() value: Date = new Date();
  
  // format date dd/MM/yyyy
  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day).toLocaleDateString('en-CA');
  }

  public onChange(value: Date): void {
    this.datePicked.emit(this.formatDate(value));
  }
}
