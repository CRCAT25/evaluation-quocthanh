import { Component, ViewEncapsulation } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { DTOStatus } from '../shared/dtos/DTOStatus.dto';
import { EvaluationService } from '../shared/services/evaluation.service';
import { DTOEvaluation } from '../shared/dtos/DTOEvaluation.dto';
import { Observable } from 'rxjs';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-hri001-evaluation-list',
  templateUrl: './hri001-evaluation-list.component.html',
  styleUrls: ['./hri001-evaluation-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Hri001EvaluationListComponent {
  // Variables
  collapseMode: BreadCrumbCollapseMode = 'none';
  currentDate: Date = new Date();
  dateStartPicked: Date = new Date(1900, 1, 1);
  dateEndPicked: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  public view: Observable<DTOEvaluation[]>;
  public state: State = { skip: 0, take: 5 };


  // List
  defaultItemsBreadCrumb: BreadCrumbItem[] = [
    {
      text: "Đánh giá nhân sự",
    },
    {
      text: "Đợt đánh giá",
    }
  ];
  itemsBreadCrumb: BreadCrumbItem[] = [...this.defaultItemsBreadCrumb];
  listCheckBoxStatus: DTOStatus[] = [
    {
      id: 1,
      status: "Đang soạn thảo"
    },
    {
      id: 2,
      status: "Trả về"
    },
    {
      id: 3,
      status: "Gửi duyệt"
    },
    {
      id: 4,
      status: "Đã duyệt"
    },
    {
      id: 5,
      status: "Ngưng đánh giá"
    }
  ]
  listCheckBoxStatusDefault: DTOStatus[] = [
    {
      id: 1,
      status: 'Đang soạn thảo'
    },
    {
      id: 2,
      status: "Trả về"
    },
    {
      id: 3,
      status: "Gửi duyệt"
    },
    {
      id: 4,
      status: "Đã duyệt"
    },
  ]
  listCheckBoxNearSearchBox: DTOStatus[] = [
    {
      id: 1,
      status: 'Hoàn tất'
    },
    {
      id: 2,
      status: "Phúc khảo"
    }
  ]


  constructor(public service: EvaluationService) {
    this.view = service;
    this.service.query(this.state);
  }


  getListCheckBoxChecked(listCheckBox: any) {
    console.log(listCheckBox)
  }

  /**
   * This funciton help us tranform type date has type Date() to string
   * @param date has type Date()
   * @returns string has type 'yyyy-MM-dd'
   * - Example: '2024-05-16'
   */
  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day).toLocaleDateString('en-CA');
  }


  /**
   * this function help us tranform type date to string 'dd/MM/yyyy'
   * @param date string has type 'yyyy-MM-dd'
   * @returns 'dd/MM/yyyy'
   */
  displayDate(date: string){
    const arrDateSplit = date.split('-');
    const day: string = arrDateSplit[2];
    const month: string = arrDateSplit[1];
    const year: string = arrDateSplit[0];
    return `${day}/${month}/${year}`;
  }


  getDate(date: Date, index: string) {
    if (index === 'Start') {
      this.dateStartPicked = date;
    }
    else if (index === 'End') {
      this.dateEndPicked = date;
    }
    else {
      console.error('Do not found date!');
    }
  }


  handleSearch(textboxValue: string) {
    console.log('textbox value: ' + textboxValue);
  }
}
