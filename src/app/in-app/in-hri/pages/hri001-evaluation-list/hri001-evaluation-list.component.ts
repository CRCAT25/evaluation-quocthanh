import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { dataStage, dataStatus, DTOStatus } from '../shared/dtos/DTOStatus.dto';
import { EvaluationService } from '../shared/services/evaluation.service';
import { Observable } from 'rxjs';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { HttpClient } from '@angular/common/http';
import { DTOSession } from '../shared/dtos/DTOSession.dto';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CheckboxlistComponent } from '../shared/components/checkboxlist/checkboxlist.component';
import { DatepickerComponent } from '../shared/components/datepicker/datepicker.component';

@Component({
  selector: 'app-hri001-evaluation-list',
  templateUrl: './hri001-evaluation-list.component.html',
  styleUrls: ['./hri001-evaluation-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Hri001EvaluationListComponent implements OnInit, OnDestroy {
  // Variables
  collapseMode: BreadCrumbCollapseMode = 'none';
  currentDate: Date = new Date();
  dateStartPicked: Date = new Date(1900, 1, 1);
  dateEndPicked: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  minDate: Date = new Date(1900, 1, 1);
  maxDate: Date = new Date(this.currentDate.getFullYear() + 50, 12, 30);
  view: Observable<DTOSession[]>;
  toolBoxSeleted: number = -1;
  dataSearch: string = '';
  isLoading: boolean = false;



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
  listCheckBoxStatus: DTOStatus[] = dataStatus;
  listCheckBoxStatusDefault: DTOStatus[] = this.listCheckBoxStatus.filter(item => item.id !== 3);
  listCheckBoxStage: DTOStatus[] = dataStage;
  pageSizes = [25, 50, 75, 100];
  listStatus: DTOStatus[] = this.listCheckBoxStatusDefault;
  originData: GridDataResult;
  gridData: DTOSession[] = [];
  listStage: DTOStatus[] = [];
  tempList: DTOSession[] = [];




  // Object
  state: State = {};
  @ViewChild('checkboxlistStage') childCheckBoxListStage!: CheckboxlistComponent;
  @ViewChild('checkboxlistStatus') childCheckboxListStatus!: CheckboxlistComponent;
  @ViewChild('datepickerStart') childDatePickerStart!: DatepickerComponent;
  @ViewChild('datepickerEnd') childDatePickerEnd!: DatepickerComponent;


  constructor(public service: EvaluationService) { }


  // Hàm chạy khi destroy trang
  ngOnDestroy(): void {
    localStorage.removeItem('tokenLogin')
  }



  // Hàm chạy khi khởi tạo trang
  public ngOnInit(): void {
    localStorage.getItem('tokenLogin');
    this.initState();
    this.getData();
    this.filterData();
  }



  // Sự kiện get Data bằng state
  getData() {
    this.isLoading = true;
    this.service.getListQuesionSesstion(this.state).subscribe((res: DTOResponse) => {
      if (res.ObjectReturn) {
        this.originData = { data: [...((res.ObjectReturn).Data)], total: res.ObjectReturn.Total };
        this.isLoading = false;
      }
    }, (resError => {
      console.log(resError);
    }));
  }



  // Khởi tạo state: State
  initState() {
    this.state = {
      skip: 1,
      take: 25,
      filter: {
        logic: 'and',
        filters: [
          {
            logic: 'or',
            filters: [
              { field: 'StatusID', operator: 'eq', value: '0' },
              { field: 'StatusID', operator: 'eq', value: '1' },
              { field: 'StatusID', operator: 'eq', value: '2' },
              { field: 'StatusID', operator: 'eq', value: '4' },
            ]
          }
        ],
      },
      sort: [{ field: 'LastModifiedTime', dir: 'desc' }]
    };
  }



  /**
   * Sự kiện giúp trả về thời gian 00h
   * @param dateString Date
   * @param timeZoneOffset Múi giờ
   * @returns 
   */
  parseDateInTimeZone(dateString: Date, timeZoneOffset: number): Date {
    // Parse the date string as a UTC date
    const dateObject = dateString;

    // Adjust the date to the desired time zone by adding the offset in minutes
    dateObject.setMinutes(dateObject.getMinutes() + timeZoneOffset * 60);

    return dateObject;
  }



  /**
   * Sự kiện giúp lấy danh sách status sau khi thao tác chọn các status
   * @param listCheckBox list cần được truyền data vào
   * @param type loại list status cần truyền
   */
  getListCheckBoxChecked(listCheckBox: any, type: string) {
    if (type === 'status') {
      this.listStatus = listCheckBox;
    }
    if (type === 'stage') {
      this.listStage = listCheckBox;
    }
    this.filterData();
  }



  // Sự kiện được gọi dùng để filter Session theo status
  filterStatus(): CompositeFilterDescriptor {
    let filterStatus: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    this.listStatus.forEach(status => {
      let statusName = status.status;
      if (statusName === 'Ngưng đánh giá') statusName = 'Ngưng áp dụng';
      if (statusName === 'Đã duyệt') statusName = 'Duyệt áp dụng';
      if (statusName === 'Gửi duyệt') statusName = 'Gởi duyệt';
      filterStatus.filters.push({ field: 'StatusName', operator: 'eq', value: statusName })
    })
    return filterStatus;
  }



  // Sự kiện được gọi dùng để filter Session theo stage
  filterStage(): CompositeFilterDescriptor {
    let filterStage: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    this.listStage.forEach(stage => {
      let stageName = stage.status;
      filterStage.filters.push({ field: 'SessionStatusName', operator: 'eq', value: stageName })
    })
    return filterStage;
  }



  // Sự kiện được gọi dùng để filter Session theo textBox tìm kiếm
  filterSearch(): CompositeFilterDescriptor {
    let filterSearch: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    if (this.dataSearch !== '') {
      filterSearch.filters.push({ field: 'SessionID', operator: 'contains', value: this.dataSearch })
      filterSearch.filters.push({ field: 'SessionName', operator: 'contains', value: this.dataSearch })
    }
    return filterSearch;
  }



  // Sự kiện được gọi dùng để filter Session theo ngày
  filterDate(): CompositeFilterDescriptor {
    let filterDate: CompositeFilterDescriptor = { logic: 'and', filters: [] }
    filterDate.filters.push({ field: 'StartDate', operator: 'gte', value: this.formatDateToCompare(this.dateStartPicked) })
    filterDate.filters.push({ field: 'EndDate', operator: 'lte', value: this.formatDateToCompare(this.dateEndPicked) })
    return filterDate;
  }



  /**
   * Chứa toàn bộ các filter: status, stage, search, date
   */
  filterData() {
    const filterStatus = this.filterStatus();
    const filterStage = this.filterStage();
    const filterSearch = this.filterSearch();
    const filterDate = this.filterDate();

    // Gán filters bằng rỗng
    this.resetFilterOfState();


    // Thực hiện khi có cả 2 filterStatus và filterStage
    if (filterStatus.filters.length > 0 && filterStage.filters.length > 0) {
      this.pushFilter(this.state, {
        logic: 'and',
        filters: [filterStatus, filterStage]
      })
    }
    // Thực hiện khi có 1 trong 2 filterStatus và filterStage
    else {
      if (filterStatus.filters.length > 0) {
        this.pushFilter(this.state, filterStatus);
      }
      if (filterStage.filters.length > 0) {
        this.pushFilter(this.state, filterStage);
      }
    }


    // Thực hiện khi có filterSearch
    if (filterSearch.filters.length > 0) {
      if (this.dataSearch !== '') {
        this.pushFilter(this.state, filterSearch);
      }
    }


    // Thực hiện khi có filterDate
    if (filterDate.filters.length > 0) {
      this.pushFilter(this.state, filterDate);
    }


    // Gọi lại API
    this.getData();
  }



  /**
   * Sự kiện được gọi khi cần push filter vào state được chỉ định
   * @param state
   * @param filter
   */
  pushFilter(state: State, filter: CompositeFilterDescriptor) {
    state.filter.filters.push(filter);
  }



  // Sự kiện được gọi khi cần reset filter của state
  resetFilterOfState() {
    this.state.filter.filters.length = 0;
  }



  /**
   * Sự kiện được gọi khi người dùng muốn reset bộ lọc
   */
  resetFilter() {
    // Reset checklist Stage
    this.childCheckBoxListStage.resetCheckList();
    this.listStage = [];

    // Reset checklist Status
    this.childCheckboxListStatus.resetCheckList();
    this.listStatus = this.listCheckBoxStatusDefault;

    // Reset start date
    this.childDatePickerStart.resetDate();
    this.dateStartPicked = this.minDate;

    // Reset end date
    this.childDatePickerEnd.resetDate();
    this.dateEndPicked = this.maxDate;7

    // Fetch lại data
    this.filterData();
  }



  /**
   * Sự kiện được gọi dùng để format ngày
   * @param date Date
   * @returns Ngày có format dd/MM/yyyy
   */
  displayDate(date: any) {
    date = new Date(date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }



  /**
   * 
   * @param date Date
   * @returns Ngày có dạng 2023-11-01T00:00:00
   */
  formatDateToCompare(date: Date){
    return date.toISOString().split('.')[0];
  }



  /**
   * Sự kiện lấy ngày bắt đầu và ngày kết thúc của datepicker
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
    this.filterData();
  }



  /**
   * Sự kiện được gọi để hiển thị các actions khả dụng đối với Session cụ thể
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
      if (stage === 'Đang diễn ra') {
        return ['Xem chi tiết đợt đánh giá', 'Gửi duyệt'];
      }
      else if (stage === 'Chưa mở') {
        return ['Thiết lập đợt đánh giá', 'Gửi duyệt'];
      }
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
      if (stage === 'Đang diễn ra') {
        return ['Xem chi tiết đợt đánh giá', 'Giám sát đợt đánh giá', 'Kết thúc làm bài']
      }
    }
    return [];
  }



  /**
   * Sự kiện được gọi khi chọn vào toolbox của Session bất kỳ
   * @param code Code của Session
   * @param event Object
   */
  toggleToolBox(code: number, event: any) {
    if (code === this.toolBoxSeleted) {
      this.toolBoxSeleted = -1;
    }
    else {
      this.toolBoxSeleted = -1;
      this.toolBoxSeleted = code;
    }
    const list: any[] = event.view.document.querySelectorAll('.col-5');
    list.forEach(item => {
      item.style.zIndex = 1;
      const toolBox = item.querySelector('.tool-box');
      if (Number(toolBox.id) === code) {
        item.style.zIndex = 3;
      }
    })
  }



  // Sự kiện khi click ra ngoài màn hình
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.col-5')) {
      this.toolBoxSeleted = -1
    }
  }



  /**
   * Sự kiện được gọi khi thực hiện chuyển trang hay hiện thị item mỗi trang
   * @param value Giá trị của paging
   */
  onPageChange(value: any) {
    this.state.skip = value.skip;
    this.state.take = value.take;
    this.getData();
  }



  /**
   * - Sự kiện được gọi khi người dùng tìm kiếm đợt đánh giá
   * - Gán giá trị được nhập ở textbox cho dataSearch
   * @param textboxValue Giá trị được nhập vào textbox search
   */
  handleSearch(textboxValue: string) {
    this.dataSearch = textboxValue;
    this.filterData();
  }



  updateStatus(evaluator: DTOSession) {

  }
}
