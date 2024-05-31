import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { dataActions, dataStage, dataStatus, DTOStatus } from '../shared/dtos/DTOStatus.dto';
import { EvaluationService } from '../shared/services/evaluation.service';
import { Observable } from 'rxjs';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { HttpClient } from '@angular/common/http';
import { DTOSession } from '../shared/dtos/DTOSession.dto';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CheckboxlistComponent } from '../shared/components/checkboxlist/checkboxlist.component';
import { DatepickerComponent } from '../shared/components/datepicker/datepicker.component';
import { Router } from '@angular/router';
import { NotifiService } from 'src/app/in-app/in-config/pages/shared/services/notifi.service';

interface Action {
  id: number
  action: string
  classIcon: string
}


interface SessionUpdate {
  ListDTO: DTOSession[]
  StatusID: number
}

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
  isOpenConfirmDelete: boolean = false;
  sessionDelete: {Code: number, SessionName: string} = {Code: null, SessionName: null};



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
  listFilterData: GridDataResult;
  listOriginSession: GridDataResult;
  listStage: DTOStatus[] = [];
  listOriginAction: Action[] = dataActions;
  listCheckedSession: number[] = [];
  listAction: string[] = [];
  listCheckedFullSession: DTOSession[] = [];



  // Object
  state: State = {};
  @ViewChild('checkboxlistStage') childCheckBoxListStage!: CheckboxlistComponent;
  @ViewChild('checkboxlistStatus') childCheckboxListStatus!: CheckboxlistComponent;
  @ViewChild('datepickerStart') childDatePickerStart!: DatepickerComponent;
  @ViewChild('datepickerEnd') childDatePickerEnd!: DatepickerComponent;



  constructor(
    public evaluationService: EvaluationService,
    private router: Router,
    private notifi: NotifiService
  ) { }



  // Hàm chạy khi destroy trang
  ngOnDestroy(): void {
    localStorage.removeItem('tokenLogin')
  }



  // Hàm chạy khi khởi tạo trang
  public ngOnInit(): void {
    localStorage.getItem('tokenLogin');
    this.getOriginSessionData();
    this.initState();
    this.getDataAfterFilter();
    this.filterData();
  }



  /**
   * Sự kiện get danh sách session bằng state sau khi được filter
   */
  getDataAfterFilter() {
    // Lấy danh sách session được filter mặc định
    this.isLoading = true;
    this.evaluationService.getListQuesionSesstion(this.state).subscribe((res: DTOResponse) => {
      if (res.ObjectReturn) {
        this.listFilterData = { data: [...((res.ObjectReturn).Data)], total: res.ObjectReturn.Total };
        this.isLoading = false;
      }
    }, (resError => {
      this.router.navigateByUrl('/user-login');
      console.log(resError);
    }));
  }



  /**
   * Lấy danh sách session gốc không filter
   */
  getOriginSessionData() {
    this.evaluationService.getListQuesionSesstion({}).subscribe((res: DTOResponse) => {
      if (res.ObjectReturn) {
        this.listOriginSession = { data: [...((res.ObjectReturn).Data)], total: res.ObjectReturn.Total };
        this.isLoading = false;
      }
    })
  }



  /**
   * Khởi tạo state: State
   */
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



  /**
   * Sự kiện được gọi dùng để filter Session theo status
   * @returns CompositeFilterDescriptor
   */
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



  /**
   * Sự kiện được gọi dùng để filter Session theo stage
   * @returns CompositeFilterDescriptor
   */
  filterStage(): CompositeFilterDescriptor {
    let filterStage: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    this.listStage.forEach(stage => {
      let stageName = stage.status;
      if (stageName === 'Phúc khảo') stageName = 'Hoàn tất phúc khảo'
      filterStage.filters.push({ field: 'SessionStatusName', operator: 'eq', value: stageName })
    })
    return filterStage;
  }



  /**
   * Sự kiện được gọi dùng để filter Session theo textBox tìm kiếm
   * @returns CompositeFilterDescriptor
   */
  filterSearch(): CompositeFilterDescriptor {
    let filterSearch: CompositeFilterDescriptor = { logic: 'or', filters: [] }
    if (this.dataSearch !== '') {
      filterSearch.filters.push({ field: 'SessionID', operator: 'contains', value: this.dataSearch })
      filterSearch.filters.push({ field: 'SessionName', operator: 'contains', value: this.dataSearch })
    }
    return filterSearch;
  }



  /**
   * Sự kiện được gọi dùng để filter Session theo ngày
   * @returns CompositeFilterDescriptor
   */
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
    this.getDataAfterFilter();
  }



  /**
   * Sự kiện được gọi khi cần push filter vào state được chỉ định
   * @param state
   * @param filter
   */
  pushFilter(state: State, filter: CompositeFilterDescriptor) {
    state.filter.filters.push(filter);
  }



  /**
   * Sự kiện được gọi khi cần reset filter của state
   */
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
    this.dateEndPicked = this.maxDate;

    // Reset paging
    this.state.skip = 1;
    this.state.take = 25;

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
  formatDateToCompare(date: Date) {
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
      date.setDate(date.getDate() + 2);
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
  getListActions(status: string, stage: string): Action[] {
    let listActionFromStatus: Action[] = [];

    if (status) {
      if (status === 'Đang soạn thảo') {
        listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 0 || item.id === 1 || item.id === 9));
      }
      else if (status === 'Gởi duyệt') {
        if (stage === 'Chưa mở') {
          listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 0 || item.id === 2 || item.id === 4));
        }
        else {
          listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 6 || item.id === 2 || item.id === 4));
        }
      }
      else if (status === 'Ngưng áp dụng') {
        listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 6 || item.id === 2));
      }
      else if (status === 'Trả về') {
        listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 0 || item.id === 1));
      }
      else if (status === 'Duyệt áp dụng') {
        if (stage === 'Hoàn tất') {
          listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 6 || item.id === 7 || item.id === 8 || item.id === 5));
        }
        else if (stage === 'Hoàn tất phúc khảo') {
          listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 6 || item.id === 7 || item.id === 8 || item.id === 11 || item.id === 3));
        }
        else if (stage === 'Đang diễn ra') {
          listActionFromStatus.push(...this.listOriginAction.filter(item => item.id === 6 || item.id === 7 || item.id === 10));
        }
      }
      return listActionFromStatus
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
      this.toolBoxSeleted = -1;
    }
    // Mỗi khi chọn vào input gọi hàm getListCheckedSession
    if ((event.target as HTMLElement).closest('input')) {
      this.getListCheckedSession();
    }
  }



  /**
   * Sự kiện được gọi khi thực hiện chuyển trang hay hiện thị item mỗi trang
   * @param value Giá trị của paging
   */
  onPageChange(value: any) {
    this.state.skip = value.skip;
    this.state.take = value.take;
    this.getDataAfterFilter();
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



  /**
   * Sự kiện được gọi khi muốn cập nhật trạng thái của Session
   * @param quizSession là 1 object DTOSession
   * @param newStatus là object action được thực hiện
   */
  updateStatus(quizSession: any, newStatus: any) {
    // Khởi tạo 1 object SessionUpdate để lưu trữ đối tượng và trạng thái mới cần cập nhật
    let sessionUpdate: SessionUpdate = {
      ListDTO: [],
      StatusID: null
    };

    // Truyền quizSession và trạng thái mới vào object
    if (quizSession && newStatus && newStatus.id >= 1 && newStatus.id <= 4) {
      sessionUpdate.ListDTO.push(quizSession);
      sessionUpdate.StatusID = newStatus.id;

      // Gọi API Update bên service
      this.evaluationService.updateQuizSessionStatus(sessionUpdate).subscribe(response => {
        if (response.ErrorString) {
          this.notifi.message(response.ErrorString, "error");
        }
        else {
          this.notifi.message(`${newStatus.action} thành công`, "success");
          this.getDataAfterFilter();
          this.getOriginSessionData();
        }
      }, error => {
        console.error('Error:', error);
      });
    }
    else if(newStatus.id === 9){
      this.openDialogDelete(quizSession.SessionName, quizSession.Code)
    }
    else {
      console.error('Không tìm thấy câu hỏi hoặc action');
    }
  }



  /**
   * Sự kiện được gọi khi thực hiện update trạng thái cho cùng lúc nhiều session
   * @param newStatus Trạng thái cần update sang 
   */
  updateStatusMultiSession(newStatus: any) {
    let updateableList: DTOSession[] = [];
    let statusID: number = -1;
    if (newStatus === 'Gửi duyệt') {
      statusID = 1;
      this.listCheckedFullSession.forEach(session => {
        if (session.StatusID === 0 || session.StatusID === 4) {
          updateableList.push(session);
        }
      })
    }
    else if (newStatus === 'Phê duyệt') {
      statusID = 1;
      this.listCheckedFullSession.forEach(session => {
        if (session.StatusID === 1 || session.StatusID === 3) {
          updateableList.push(session);
        }
      })
    }
    else if (newStatus === 'Ngưng đợt đánh giá') {
      statusID = 3;
      this.listCheckedFullSession.forEach(session => {
        if (session.StatusID === 2) {
          updateableList.push(session);
        }
      })
    }
    else {
      console.log('Không có session được update');
    }

    let sessionUpdate: SessionUpdate = {
      ListDTO: updateableList,
      StatusID: statusID
    };

    this.evaluationService.updateQuizSessionStatus(sessionUpdate).subscribe((response: DTOResponse) => {
      if (response.ErrorString) {
        this.notifi.message(response.ErrorString, "error");
      }
      else {
        this.notifi.message(`${newStatus} thành công`, "success");
        this.getDataAfterFilter();
        this.getOriginSessionData();
      }
    }, error => {
      console.error('Error:', error);
    });
    this.closePopup();
  }



  /**
   * Sự kiện được gọi khi cần lấy những action khả dụng của 1 session khi thực hiện chọn nhiều
   * @param statusID 
   * @returns 
   */
  getListActionOneSession(statusID: number): string[] {
    if (statusID === 0 || statusID === 4) {
      return ['Gửi duyệt'];
    }
    else if (statusID === 1 || statusID === 3) {
      return ['Phê duyệt'];
    }
    else if (statusID === 2) {
      return ['Ngưng đợt đánh giá'];
    }
    else {
      return [];
    }
  }



  /**
   * Sự kiện được gọi dùng để lấy danh sách các action của nhiều session khi thực hiện chọn nhiều
   */
  getMultiAction() {
    let listMultiAction: string[] = [];
    this.listCheckedSession.forEach(code => {
      this.listOriginSession.data.forEach((session: DTOSession) => {
        if (session) {
          if (session.Code === code) {
            listMultiAction.push(...this.getListActionOneSession(session.StatusID));
          }
        }
      })
    })
    const customOrder = ['Gửi duyệt', 'Phê duyệt', 'Ngưng đợt đánh giá'];
    const uniqueListAction = Array.from(new Set(listMultiAction));
    const sortedList = uniqueListAction.sort((a, b) => {
      return customOrder.indexOf(a) - customOrder.indexOf(b);
    });
    return sortedList;
  }



  /**
   * Sự kiện được gọi khi cần lấy danh sách các session được chọn
   */
  getListCheckedSession() {
    this.listCheckedFullSession = [];
    this.listCheckedSession.forEach(code => {
      this.listOriginSession.data.forEach((session: DTOSession) => {
        if (session) {
          if (session.Code === code) {
            this.listCheckedFullSession.push(session);
          }
        }
      })
    })
  }



  /**
   * Sự kiện được gọi khi cần lấy icon theo action bất kỳ
   * @param actionName 
   * @returns 
   */
  getIconByAction(actionName: string): string {
    if (actionName) {
      if (actionName === 'Gửi duyệt') {
        return 'k-i-redo'
      }
      else if (actionName === 'Phê duyệt') {
        return 'k-i-check-outline'
      }
      else if (actionName === 'Ngưng đợt đánh giá') {
        return 'k-i-minus-outline'
      }
    }
    return '';
  }



  /**
   * Sự kiện được gọi khi cần đóng popup chọn nhiều session
   */
  closePopup() {
    this.listCheckedSession = [];
    this.listCheckedFullSession = [];
  }



  /**
   * Sự kiện được gọi khi cần xóa 1 session nào đó
   * @param code Code của session
   */
  deleteSession(code: number){
    const objDelete: {Code: number} = {Code: code};
    this.evaluationService.deleteQuizSession(objDelete).subscribe((response: DTOResponse) => {
      if (response.ErrorString) {
        console.log(response.ErrorString);
        this.notifi.message(response.ErrorString, "error");
      }
      else {
        this.notifi.message(`Xóa thành công`, "success");
        this.getDataAfterFilter();
        this.getOriginSessionData();
        this.closeDialogDelete();
      }
    }, error => {
      console.error('Error:', error);
    });
  }



  /**
   * Sự kiện được gọi khi muốn đóng dialog confirm delete
   */
  closeDialogDelete(){
    this.sessionDelete = {Code: null, SessionName: null};
    this.isOpenConfirmDelete = false;
  }



  /**
   * Sự kiện được gọi khi mở dialog confirm delete
   * @param sessionName name của session
   */
  openDialogDelete(sessionName: string, sessionID: number){
    this.isOpenConfirmDelete = true;
    this.sessionDelete = {Code: sessionID, SessionName: sessionName};
  }
}
