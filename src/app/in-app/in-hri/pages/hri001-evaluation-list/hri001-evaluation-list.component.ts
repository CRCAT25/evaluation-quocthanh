import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { DTOStatus } from '../shared/dtos/DTOStatus.dto';

@Component({
  selector: 'app-hri001-evaluation-list',
  templateUrl: './hri001-evaluation-list.component.html',
  styleUrls: ['./hri001-evaluation-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Hri001EvaluationListComponent {
  constructor() { }

  // Variables
  collapseMode: BreadCrumbCollapseMode = 'none';


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


  getListCheckBoxChecked(listCheckBox: any) {
    console.log(listCheckBox)
  }


  getDate(date: string, index: string) {
    if (index === 'Start') {
      console.log(index + ': ' + date)
    }
    if (index === 'End') {
      console.log(index + ': ' + date)
    }
  }


  handleSearch(textboxValue: string) {
    console.log('textbox value: ' + textboxValue);
  }
}
