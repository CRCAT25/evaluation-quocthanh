import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { DTOStatus } from '../shared/dtos/DTOStatus.dto';
import { EvaluationService } from '../shared/services/evaluation.service';
import { DTOEvaluation } from '../shared/dtos/DTOEvaluation.dto';
import { Observable } from 'rxjs';
import { CompositeFilterDescriptor, State, filterBy, process } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators';

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
  toolBoxSeleted: string = '';
  dataSearch: string = '';
  gridView: GridDataResult;



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
  pageSizes = [25, 50, 75, 100];
  listStatus: DTOStatus[] = this.listCheckBoxStatusDefault;
  originData: DTOEvaluation[] = [];
  gridData: DTOEvaluation[] = [];
  listStage: DTOStatus[] = [];
  tempList: DTOEvaluation[] = [];

  // Object
  state: State = {
    skip: 0,
    take: 25,
    filter: {
      logic: 'and',
      filters: [
      ],
    },
    group: [],
    sort: [],
  };


  constructor(public service: EvaluationService) { }

  public ngOnInit(): void {
    this.service.read();
    this.service.subscribe((data: DTOEvaluation[]) => {
      const tempData = data;
      tempData.forEach(item => {
        item.dateStart = new Date(item.dateStart)
        item.dateEnd = new Date(item.dateEnd)
      })
      this.originData = [...tempData];
      this.gridData = filterBy(this.originData, {
        logic: 'and',
        filters: [
          {
            logic: 'or',
            filters: [
              this.filterStatus(),
              this.filterStage()
            ]
          },
          this.filterSearch()
        ]
      })
    });
  }



  parseDateInTimeZone(dateString: Date, timeZoneOffset: number): Date {
    // Parse the date string as a UTC date
    const dateObject = dateString;

    // Adjust the date to the desired time zone by adding the offset in minutes
    dateObject.setMinutes(dateObject.getMinutes() + timeZoneOffset * 60);

    return dateObject;
  }



  getListCheckBoxChecked(listCheckBox: any, type: string) {
    if (type === 'status') {
      this.listStatus = listCheckBox;
    }
    if (type === 'stage') {
      this.listStage = listCheckBox;
    }
    this.filterData();
  }



  filterStatus(): CompositeFilterDescriptor {
    let filterStatus: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    this.listStatus.forEach(status => {
      let statusName = status.status;
      if (statusName === 'Ngưng đánh giá') statusName = 'Ngưng áp dụng';
      if (statusName === 'Đã duyệt') statusName = 'Duyệt áp dụng';
      filterStatus.filters.push({ field: 'status', operator: 'eq', value: statusName })
    })


    return filterStatus;
  }



  filterStage(): CompositeFilterDescriptor {
    let filterStage: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    this.listStage.forEach(stage => {
      let stageName = stage.status;
      filterStage.filters.push({ field: 'stage', operator: 'eq', value: stageName })
    })
    return filterStage;
  }



  filterSearch(): CompositeFilterDescriptor {
    let filterSearch: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    filterSearch.filters.push({ field: 'code', operator: 'contains', value: this.dataSearch })
    filterSearch.filters.push({ field: 'name', operator: 'contains', value: this.dataSearch })
    return filterSearch;
  }



  filterDate(): CompositeFilterDescriptor {
    let filterDate: CompositeFilterDescriptor = { logic: 'and', filters: [] }
    filterDate.filters.push({ field: 'dateStart', operator: 'gte', value: this.dateStartPicked })
    filterDate.filters.push({ field: 'dateEnd', operator: 'lte', value: this.dateEndPicked })
    return filterDate;
  }


  filterData() {
    this.gridData = filterBy(this.originData, {
      logic: 'and',
      filters: [
        {
          logic: 'or',
          filters: [
            this.filterStatus(),
            this.filterStage()
          ]
        },
        this.filterSearch(),
        this.filterDate()
      ]
    })
  }


  resetFilter(noti: any) {
    if (noti === 'reset') {
      window.location.reload();
    }
  }



  /**
   * This function help us tranform type date to string 'dd/MM/yyyy'
   * @param date string has type 'yyyy-MM-dd'
   * @returns 'dd/MM/yyyy'
   */
  displayDate(date: Date) {
    const day: string = String(date.getDate());
    const month: string = String(date.getMonth() + 1);
    const year: string = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  }


  /**
   * This function help us get date start or end
   * @param date type Date()
   * @param index 'Start' | 'End'
   */
  getDate(date: Date, index: string) {
    if (index === 'Start') {
      this.dateStartPicked = this.parseDateInTimeZone(date, 7);
    }
    else if (index === 'End') {
      this.dateEndPicked = this.parseDateInTimeZone(date, 7);
    }
    else {
      console.error('Do not found date!');
    }
    console.log(this.dateEndPicked);
    this.filterData();
  }


  /**
   * This function make display list of actions that we can perform some action to change status or change content
   * @param status Status of evaluation
   * @param stage Current stage of evaluation
   * @returns 
   */
  getListActions(status: string, stage: string): string[] {
    if (status === 'Ngưng áp dụng') {
      return ['Xem chi tiết đợt đánh giá', 'Phê duyệt'];
    }
    else if (status === 'Đang soạn thảo') {
      return ['Thiết lập đợt đánh giá', 'Gửi duyệt', 'Xóa đợt đánh giá'];
    }
    else if (status === 'Trả về') {
      return ['Thiết lập đợt đánh giá', 'Gửi duyệt'];
    }
    else if (status === 'Gởi duyệt') {
      return ['Xem chi tiết đợt đánh giá', 'Phê duyệt', 'Trả về'];
    }
    else if (status === 'Duyệt áp dụng') {
      if (stage === 'Hoàn tất') {
        return ['Xem chi tiết đợt đánh giá', 'Giám sát đợt đánh giá', 'Chấm điểm câu tự luận', 'Tính điểm đợt đánh giá'];
      }
      if (stage === 'Hoàn tất phúc khảo') {
        return ['Xem chi tiết đợt đánh giá', 'Giám sát đợt đánh giá', 'Chấm điểm câu tự luận', 'Chấm phúc khảo', 'Ngưng đợt đánh giá']
      }
    }
    return [];
  }


  /**
   * When function is called, toolBox will be displayed
   * @param code code of Item of list
   */
  toggleToolBox(code: string, event: any) {
    if (code === this.toolBoxSeleted) {
      this.toolBoxSeleted = '';
    }
    else {
      this.toolBoxSeleted = '';
      this.toolBoxSeleted = code;
    }
    const list: any[] = event.view.document.querySelectorAll('.col-5');
    list.forEach(item => {
      item.classList.remove('tool-box-active');
    });
    list.forEach(item => {
      const toolBox = item.querySelector('.tool-box');
      if (toolBox.id === code) {
        item.classList.add('tool-box-active');
      }
    });

  }

  // Sự kiện khi click ra ngoài màn hình
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Kiểm tra xem phần tử được click có phải là other-pro_status_tool hay không
    if (!(event.target as HTMLElement).closest('.col-5')) {
      const list: any[] = event.view.document.querySelectorAll('.col-5') as any;
      list.forEach(item => {
        item.classList.remove('tool-box-active');
      });
      list.forEach(item => {
        if (item.querySelector('.active')) {
          console.log(item.querySelector('.active'));
          item.querySelector('.active').classList.remove('active')
          this.toolBoxSeleted = ''
        }
      });
    }
  }


  handleSearch(textboxValue: string) {
    this.dataSearch = textboxValue;
    this.filterData();
  }


  updateStatus(evaluator: DTOEvaluation) {

  }
}
