import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { dataStage, dataStatus, DTOStatus } from '../shared/dtos/DTOStatus.dto';
import { EvaluationService } from '../shared/services/evaluation.service';
import { Observable } from 'rxjs';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { HttpClient } from '@angular/common/http';
import { DTOSession } from '../shared/dtos/DTOSession.dto';
import { GridDataResult } from '@progress/kendo-angular-grid';

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
  loading: boolean = false;



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
  listCheckBoxStatusDefault: DTOStatus[] = this.listCheckBoxStatus.filter(item => item.id !== 4);
  listCheckBoxStage: DTOStatus[] = dataStage;
  pageSizes = [25, 50, 75, 100];
  listStatus: DTOStatus[] = this.listCheckBoxStatusDefault;
  originData: GridDataResult;
  gridData: DTOSession[] = [];
  listStage: DTOStatus[] = [];
  tempList: DTOSession[] = [];




  // Object
  state: State = {
    skip: 1,
    take: 25,
    filter: {
      logic: 'and',
      filters: [
      ],
    },
    sort: [{field: 'LastModifiedTime', dir: 'desc'}]
  };


  constructor(public service: EvaluationService, private http: HttpClient) { }


  // Hàm chạy khi destroy trang
  ngOnDestroy(): void {
    localStorage.removeItem('tokenLogin')
  }



  // Hàm chạy khi khởi tạo trang
  public ngOnInit(): void {
    localStorage.getItem('tokenLogin');

    this.getData();
  }



  // Sự kiện get Data bằng state
  getData() {
    this.loading = true;
    this.service.getListQuesionSesstion(this.state).subscribe((res: DTOResponse) => {
      if(res.ObjectReturn){
        this.originData = {data: [...((res.ObjectReturn).Data)], total: res.ObjectReturn.Total};
        this.loading = false;
      }
    }, (resError => {
      console.log(resError);
    }));
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
    const filterStatus = this.filterStatus();
    const filterStage = this.filterStage();
    const filterDate = this.filterDate();
    const filterSearch = this.filterSearch();


    if(filterStatus.filters.length > 0 && filterStage.filters.length > 0){
      this.pushFilter(this.state, {
        logic: 'and',
        filters: [filterStatus, filterStage]
      })
    }
    else{
      if(filterStatus.filters.length > 0){
        this.pushFilter(this.state, filterStatus);
      }
      if(filterStage.filters.length > 0){
        this.pushFilter(this.state, filterStage);
      }
    }
    this.getData();
  }



  /**
   * Sự kiện được gọi khi cần push filter vào state được chỉ định
   * @param state
   * @param filter
   */
  pushFilter(state: State, filter: CompositeFilterDescriptor){
    this.resetFilterOfState();
    state.filter.filters.push(filter);
  }



  // Sự kiện được gọi khi cần reset filter của state
  resetFilterOfState(){
    this.state.filter.filters.length = 0;
  }



  resetFilter(noti: any) {
    if (noti === 'reset') {
      window.location.reload();
    }
  }



  displayDate(date: any) {
    date = new Date(date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }



  /**
   * Sự kiện lấy ngày bắt đầu và ngày kết thúc của datepicker
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
    // this.filterData();
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



  onPageChange(value: any){
    this.state.skip = value.skip;
    this.state.take = value.take;
    this.getData();
    console.log(value);
  }



  handleSearch(textboxValue: string) {
    this.dataSearch = textboxValue;
    this.filterData();
  }



  updateStatus(evaluator: DTOSession) {

  }
}
