import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { DTOStatus } from '../shared/dtos/DTOStatus.dto';
import { EvaluationService } from '../shared/services/evaluation.service';
import { DTOEvaluation } from '../shared/dtos/DTOEvaluation.dto';
import { Observable } from 'rxjs';
import { State } from '@progress/kendo-data-query';
import { GridComponent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-hri001-evaluation-list',
  templateUrl: './hri001-evaluation-list.component.html',
  styleUrls: ['./hri001-evaluation-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Hri001EvaluationListComponent implements OnInit {
  // Variables
  collapseMode: BreadCrumbCollapseMode = 'none';
  currentDate: Date = new Date();
  dateStartPicked: Date = new Date(1900, 1, 1);
  dateEndPicked: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  view: Observable<DTOEvaluation[]>;
  state: State = { skip: 0, take: 5 };
  toolBoxSeleted: string = '';



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

  ngOnInit(): void {
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
   * This function help us tranform type date to string 'dd/MM/yyyy'
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


  /**
   * This function help us get date start or end
   * @param date type Date()
   * @param index 'Start' | 'End'
   */
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


  /**
   * This function make display list of actions that we can perform some action to change status or change content
   * @param status Status of evaluation
   * @param stage Current stage of evaluation
   * @returns 
   */
  getListActions(status: string, stage: string): string[]{
    if(status === 'Ngưng áp dụng'){
      return ['Xem chi tiết đợt đánh giá', 'Phê duyệt'];
    }
    else if(status === 'Đang soạn thảo'){
      return['Thiết lập đợt đánh giá', 'Gửi duyệt', 'Xóa đợt đánh giá'];
    }
    else if(status === 'Trả về'){
      return['Thiết lập đợt đánh giá', 'Gửi duyệt'];
    }
    else if(status === 'Gởi duyệt'){
      return['Xem chi tiết đợt đánh giá', 'Phê duyệt', 'Trả về'];
    }
    else if(status === 'Duyệt áp dụng'){
      if(stage === 'Hoàn tất'){
        return ['Xem chi tiết đợt đánh giá', 'Giám sát đợt đánh giá', 'Chấm điểm câu tự luận', 'Tính điểm đợt đánh giá'];
      }
      if(stage === 'Hoàn tất phúc khảo'){
        return ['Xem chi tiết đợt đánh giá', 'Giám sát đợt đánh giá', 'Chấm điểm câu tự luận', 'Chấm phúc khảo', 'Ngưng đợt đánh giá']
      }
    }
    return [];
  }


  /**
   * When function is called, toolBox will be displayed
   * @param code code of Item of list
   */
  toggleToolBox(code: string, event: any){
    if(code === this.toolBoxSeleted){
      this.toolBoxSeleted = '';
    }
    else{
      this.toolBoxSeleted = '';
      this.toolBoxSeleted = code;
    }
    event.view.document.querySelector('.col-5').style.zIndex = '3';
  }


  handleSearch(textboxValue: string) {
    console.log('textbox value: ' + textboxValue);
  }
}
