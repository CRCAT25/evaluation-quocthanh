import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DTOStatus } from '../../dtos/DTOStatus.dto';

class statusCheckObj {
  statusObj: DTOStatus
  isChecked: boolean
}

/**
 * - Component provide for display list checkbox status on type of data is object DTOStatus
 * - Having 2 inputs: listCheckBox: DTOStatus[], listCheckBoxDefault: DTOStatus[], 
 * - Having 1 output: listChecked: DTOStatus[]
 */
@Component({
  selector: 'component-checkboxlist',
  templateUrl: './checkboxlist.component.html',
  styleUrls: ['./checkboxlist.component.scss']
})
export class CheckboxlistComponent implements OnInit {
  @Input() listCheckBox: DTOStatus[] = [];
  @Input() listCheckBoxDefault: DTOStatus[] = [];
  @Output() listChecked: EventEmitter<DTOStatus[]> = new EventEmitter<DTOStatus[]>();

  currentListCheckBoxStatus: statusCheckObj[] = [];


  ngOnInit(): void {
    this.currentListCheckBoxStatus = this.listCheckBox.map(statusObj => ({
      statusObj,
      isChecked: this.containsObjectStatus(this.listCheckBoxDefault, statusObj)
    }))
  }



  /**
   * This function help us check arr include statusObj or not
   * @param arr list object status on type DTOStatus
   * @param statusObj object status on type DTOStatus
   * @returns true or false
   */
  containsObjectStatus(arr: DTOStatus[] , statusObj: DTOStatus) {
    return arr.some(obj => obj.id === statusObj.id && obj.status === statusObj.status);
  }



  /**
   * 
   * @param objStatus A object statusCheckObj
   * This function help us change value isChecked in statusCheckObj 
   * and then call function push to emit list status is checked on type DTOStatus to its parent component
   */
  onChangeCheckBox(objStatus: statusCheckObj) {
    if (objStatus) {
      this.currentListCheckBoxStatus.forEach(status => {
        if ((status.statusObj).status === (objStatus.statusObj).status) {
          objStatus.isChecked = !objStatus.isChecked;
          this.pushListCheckBoxChecked();
        }
      })
    }
    else {
      console.error('Invalid status!');
    }
  }



  /**
   * This funciton help us emit list status is checked on type DTOStatus to its parent component
   */
  pushListCheckBoxChecked() {
    let listTemp: DTOStatus[] = [];
    this.currentListCheckBoxStatus.forEach(statusObj => {
      if (statusObj.isChecked) {
        listTemp.push(statusObj.statusObj);
      }
    })
    if (listTemp.length === 0) {
      this.listChecked.emit(this.listCheckBox);
    }
    else {
      this.listChecked.emit(listTemp);
    }
  }
}
