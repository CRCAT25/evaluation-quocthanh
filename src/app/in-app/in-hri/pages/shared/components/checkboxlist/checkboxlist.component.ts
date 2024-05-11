import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DTOStatus } from '../../dtos/DTOStatus.dto';

@Component({
  selector: 'app-checkboxlist',
  templateUrl: './checkboxlist.component.html',
  styleUrls: ['./checkboxlist.component.scss']
})
export class CheckboxlistComponent implements OnInit {
  @Input() listCheckBox: DTOStatus[] = [];
  @Output() listChecked: EventEmitter<DTOStatus[]> = new EventEmitter<DTOStatus[]>();
  currentListCheckBoxStatus: { status: DTOStatus; isChecked: boolean }[] = [];
  ngOnInit(): void {
    this.currentListCheckBoxStatus = this.listCheckBox.map(status => ({
      status,
      isChecked: false
    }));
  }
  onChangeCheckBox() {

  }
}
