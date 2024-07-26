import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { ReplaySubject } from 'rxjs';
import { DTOGroup } from '../../shared/dtos/DTOGroup';
import { listDataTemp } from '../../shared/services/datatemp';
import { DTOAction } from '../../shared/dtos/DTOAction.dto';
import { DTOFunction } from '../../shared/dtos/DTOFunction';
import { DrawerComponent, DrawerContentComponent, DrawerMode, DrawerPosition } from '@progress/kendo-angular-layout';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { TextDropdownComponent } from '../../shared/components/text-dropdown/text-dropdown.component';
import { TextAreaComponent } from '../../shared/components/text-area/text-area.component';

interface ActionHandle {
  Code: number
  Name: string
  Icon: string
}

@Component({
  selector: 'app-system-structure',
  templateUrl: './system-structure.component.html',
  styleUrls: ['./system-structure.component.scss']
})
export class SystemStructureComponent implements OnInit, OnDestroy {
  // variable Subject
  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);


  // Chế độ hiển thị của drawer
  expandMode: DrawerMode = 'overlay';
  // Drawer đang được mở ngay ban đầu hay không
  expanded = false;
  // Chiều dài của drawer
  widthDrawer: number = 430;
  // Vị trị xuất hiện của drawer
  positionDrawer: DrawerPosition = "end";
  // Chế độ của breadcrumb
  collapseMode: BreadCrumbCollapseMode = 'none';
  // Icon group
  imageIconGroup: string = '../../../../../assets/image-group.svg';
  // Icon function
  imageIconFunction: string = '../../../../../assets/image-function.svg';
  // Icon action
  imageIconAction: string = '../../../../../assets/image-action.svg';
  // Icon group màu xám
  imageIconGroupGray: string = '../../../../../assets/image-group-gray.svg';
  // Icon function màu xám
  imageIconFunctionGray: string = '../../../../../assets/image-function-gray.svg';
  // Icon action màu xám
  imageIconActionGray: string = '../../../../../assets/image-action-gray.svg';
  // Icon action chỉnh sửa
  imageIconEdit: string = '../../../../../assets/image-edit.svg';
  // Icon action xóa
  imageIconDelete: string = '../../../../../assets/image-delete.svg';
  // Loading của list
  isLoading: boolean = true;
  // Trạng thái mở rộng tree khi mới khởi tạo
  initiallyExpanded: boolean = true;
  // Có thể mở rộng từng item hay không
  isExpanded: boolean = true;
  // ToolBox nào đang được active
  toolBoxActive: any;
  // Item đang được chọn trên tree list
  itemSelectedTreeList: any;


  // Danh sách breadcrumb
  defaultItemsBreadCrumb: BreadCrumbItem[] = [
    {
      text: "Cấu trúc hệ thống",
    },
    {
      text: "Cấu trúc hệ thống",
    }
  ];
  // Danh sách cấu trúc hệ thống
  listSysStructure: DTOGroup[];
  // Danh sách các action
  listActionHandle: ActionHandle[] = [
    {
      Code: 1,
      Name: 'Chỉnh sửa',
      Icon: this.imageIconEdit
    },
    {
      Code: 2,
      Name: 'Thêm mới Module',
      Icon: this.imageIconGroup
    },
    {
      Code: 3,
      Name: 'Thêm mới Module con',
      Icon: this.imageIconGroup
    },
    {
      Code: 4,
      Name: 'Thêm mói Tính năng',
      Icon: this.imageIconFunction
    },
    {
      Code: 5,
      Name: 'Thêm mói Tính năng con',
      Icon: this.imageIconFunction
    },
    {
      Code: 6,
      Name: 'Thêm mới Chức năng',
      Icon: this.imageIconAction
    },
    {
      Code: 7,
      Name: 'Thêm mới Chức năng con',
      Icon: this.imageIconAction
    },
    {
      Code: 8,
      Name: 'Xóa Module',
      Icon: this.imageIconDelete
    },
    {
      Code: 9,
      Name: 'Xóa Tính năng',
      Icon: this.imageIconDelete
    },
    {
      Code: 10,
      Name: 'Xóa Chức năng',
      Icon: this.imageIconDelete
    }
  ]

  @ViewChild('drawer') childDrawer!: DrawerComponent;
  @ViewChild('drawerContent') childDrawerContent!: DrawerContentComponent;
  // Thuộc module
  @ViewChild('nameModule') childNameModule!: TextInputComponent;
  @ViewChild('groupParentModule') childGroupParentModule!: TextDropdownComponent;
  @ViewChild('idModule') childIdModule!: TextInputComponent;
  @ViewChild('apiPackage') childApiPackage!: TextInputComponent;
  @ViewChild('fontIconModule') childFontIconModule!: TextInputComponent;
  @ViewChild('orderByModule') childOrderByModule!: TextInputComponent;
  // Thuộc function
  @ViewChild('nameFunction') childNameFunction!: TextInputComponent;
  @ViewChild('moduleParentFunction') childModuleParentFunction!: TextDropdownComponent;
  @ViewChild('dllpackage') childDllpackage!: TextInputComponent;
  @ViewChild('fontIconFunction') childFontIconFunction!: TextInputComponent;
  @ViewChild('typeDataFunction') childTypeDataFunction!: TextInputComponent;
  @ViewChild('orderByFunction') childOrderByFunction!: TextInputComponent;
  @ViewChild('settingFunction') childSettingFunction!: TextAreaComponent;
  // Thuộc action
  @ViewChild('nameAction') childNameAction!: TextInputComponent;
  @ViewChild('moduleParentAction') childModuleParentAction!: TextDropdownComponent;
  @ViewChild('functionParentAction') childFunctionParentAction!: TextDropdownComponent;
  @ViewChild('actionParent') childActionParent!: TextDropdownComponent;
  @ViewChild('typeDataAction') childTypeDataAction!: TextInputComponent;
  @ViewChild('settingAction') childSettingAction!: TextAreaComponent;


  constructor() { }

  ngOnInit(): void {
    this.getListOriginSysStructure();
  }

  // Lấy danh sách cấu trúc hệ thống
  getListOriginSysStructure() {
    this.isLoading = true;
    const data: any = listDataTemp;
    if (data.StatusCode == 0) {
      this.listSysStructure = data.ObjectReturn;
      this.isLoading = false;
    }
  }

  // Hàm dùng để nhận biết DTO là Group hay Function hay Action
  identifyDTO(dto: any): string {
    if (!dto) {
      return 'Unknown';
    }

    if ('ListFunctions' in dto) {
      return 'DTOGroup';
    } else if ('ListAction' in dto && 'PermissionConf' in dto && 'ParentID' in dto) {
      return 'DTOAction';
    } else if ('ListAction' in dto && 'PermissionConf' in dto) {
      return 'DTOFunction';
    }

    return 'Unknown';
  }

  // Fetch data ra list
  fetchChildren = (item?: any): any[] => {
    if (item && (item.ListGroup || item.ListFunctions || item.ListAction)) {
      let children: any[] = [];
      if (this.hasListValue(item.ListGroup)) {
        children.push(...item.ListGroup)
      }

      if (this.hasListValue(item.ListFunctions)) {
        children.push(...item.ListFunctions)
      }

      if (this.hasListValue(item.ListAction)) {
        children.push(...item.ListAction)
      }
      return children;
    }
    return item ? [] : this.listSysStructure;
  };

  // Kiểm tra xem item đó có item con hay không
  hasChildren = (item: any): boolean => {
    const children = this.fetchChildren(item);
    return children && children.length > 0;
  };

  // Kiểm tra xem list có data hay không
  hasListValue(value: any): boolean {
    return !(value === undefined || value === null || value === <any>[] || value.length === 0);
  }

  /**
   * Hàm trả về đúng trường cần thiết của object đó
   * @param object Object cần kiểm tra
   * @returns 
   */
  getNameObject(object: any): string {
    if (object.ActionName) return object.ActionName;
    if (object.Vietnamese) return object.Vietnamese;

    return 'Lỗi getNameObject'
  }

  /**
   * Hàm trả về icon của object đó
   * @param object Object cần kiểm tra
   * @returns 
   */
  getIconOfObject(object: any) {
    if (object.ActionName) return this.imageIconActionGray;
    if (object.DLLPackage) return this.imageIconFunctionGray;
    if (object.Vietnamese) return this.imageIconGroupGray;

    return 'Lỗi getIconOfObject'
  }

  // Lấy thông tin bên phải của name object
  getIdObject(object: any): string {
    if (object.ActionName) return 'Loại ' + object.TypeData;
    if (object.DLLPackage) return object.DLLPackage;
    if (object.Vietnamese) return object.ModuleID;

    return 'Lỗi getIdObject'
  }

  // Hàm kiểm tra xem có thể thêm action tại function cụ thể hay không
  isActionAddable(currentAction: DTOAction, listAction: DTOAction[], maxLevel: number): boolean {
    let levelCheck = 1;

    // Tìm mức độ lồng nhau của action hiện tại
    while (currentAction.ParentID) {
      const parentAction = listAction?.find(a => a.ParentID === currentAction.ParentID);
      if (parentAction) {
        levelCheck++;
        currentAction = parentAction;
      } else {
        break;
      }
    }

    // Kiểm tra nếu mức độ lồng nhau đã đạt đến giới hạn
    return levelCheck === maxLevel;
  }

  // Kiểm tra xem có thể thêm module con hoặc action con
  isSubAddable(object: any): boolean {
    if (object.ActionName) {
      //   const group: DTOGroup = this.listSysStructure.find(group => group.Code === object.ModuleID);
      //   const functionOfGroup: DTOFunction = group?.ListFunctions?.find(func => func.Code === object.FunctionID);
      //   const listActionOfFunction: DTOAction[] = functionOfGroup?.ListAction;
      //   return this.isActionAddable(object, listActionOfFunction, 2);
      return true;
    }
    if (this.identifyDTO(object) === 'DTOGroup') {
      if (!object.GroupID) return true;
    }
    return false;
  }

  // Lấy danh sách các action có thể handle
  getListActionHandle(object: any): ActionHandle[] {
    const dtoType = this.identifyDTO(object);
    let listAction: ActionHandle[] = [];

    // Đối với DTOAction
    if (dtoType === 'DTOAction') {
      const objAction: DTOAction = object;
      listAction = this.listActionHandle.filter(action => action.Code === 1 || action.Code === 6);

      if (this.isSubAddable(objAction)) {
        listAction.push(this.listActionHandle.find(action => action.Code === 7));
      }
      if (!objAction.ListAction) {
        listAction.push(this.listActionHandle.find(action => action.Code === 10));
      }
    } 
    // Đối với DTOFunction
    else if (dtoType === 'DTOFunction') {
      const objFunction: DTOFunction = object;
      listAction = this.listActionHandle.filter(action => action.Code === 1 || action.Code === 4 || action.Code === 7);

      if (!objFunction.ListAction) {
        listAction.push(this.listActionHandle.find(action => action.Code === 9));
      }
    } 
    // Đối với DTOGroup
    else if (dtoType === 'DTOGroup') {
      const objGroup: DTOGroup = object;
      listAction = this.listActionHandle.filter(action => action.Code === 1 || action.Code === 2);

      if (this.isSubAddable(objGroup)) {
        listAction.push(this.listActionHandle.find(action => action.Code === 3));
      } else {
        listAction.push(this.listActionHandle.find(action => action.Code === 4));
      }
      listAction.push(this.listActionHandle.find(action => action.Code === 5));

      if (!objGroup.ListFunctions && !objGroup.ListGroup) {
        listAction.push(this.listActionHandle.find(action => action.Code === 8));
      }
    }

    return listAction;
  }


  // Sự kiện được gọi khi click vào tool box
  handleToolBox(object: any) {
    if (this.toolBoxActive !== object) this.toolBoxActive = object;
    else this.toolBoxActive = null;
  }

  /**
   * Sự kiện được gọi khi click vào action trong action list
   * @param actionHandle Nút action
   * @param object Object cần handle
   */
  handleAction(actionHandle: ActionHandle, object: any) {
    // Mở drawer
    this.childDrawer.toggle();
    
    // Disable content đằng sau
    const drawercontent = document.querySelector('kendo-drawer-content') as HTMLElement;
    drawercontent.style.pointerEvents = 'none';
    
    // Nếu là chỉnh sửa
    if (actionHandle.Code === 1) {
      this.bindDataToDrawer(object);
    }
  }

  // Sự kiện khi click ra ngoài màn hình
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.button-tool')) {
      this.toolBoxActive = -1;
    }
  }

  // Sự kiện được gọi khi chọn item bất kỳ trên tree list
  onClickItemTreeList(item: any) {
    this.itemSelectedTreeList = item[0].itemKey;
  }

  // Lấy danh sách các button sẽ hiển thị khi chọn item bất kỳ
  getListButtonAvailable() {
    return this.getListActionHandle(this.itemSelectedTreeList).filter(item => item.Code !== 1 && item.Code <= 7);
  }

  // Đóng drawer
  closeDrawer() {
    this.childDrawer.toggle();
    const drawercontent = document.querySelector('kendo-drawer-content') as HTMLElement;
    drawercontent.style.pointerEvents = 'all';
  }

  // Kiểm tra xem có thể hiện nút xóa khi xem chi tiết của từng item hay không
  hasButtonDeleteDrawer() {
    const obj = this.itemSelectedTreeList;
    if (this.identifyDTO(obj) === 'DTOGroup' && !obj.ListFunctions && !obj.ListGroup) {
      return true;
    }
    if (this.identifyDTO(obj) === 'DTOFunction' && !obj.ListAction) {
      return true;
    }
    if (this.identifyDTO(obj) === 'DTOAction' && !obj.ListAction) {
      return true;
    }
    return false;
  }

  // Bind dữ liệu của item được chọn ra drawer
  bindDataToDrawer(obj: any) {
    if (this.identifyDTO(obj) === 'DTOGroup') {
      const objGroup: DTOGroup = obj;
      // console.log(objGroup.Vietnamese);
      return;
    }
    if (this.identifyDTO(obj) === 'DTOAction') {
      console.log(obj);
      return;
    }
    if (this.identifyDTO(obj) === 'DTOFunction') {
      console.log(obj);
      return;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
