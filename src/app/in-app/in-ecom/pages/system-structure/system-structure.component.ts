import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BreadCrumbCollapseMode, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { asapScheduler, from, Observable, of, scheduled } from 'rxjs';
import { DTOGroup } from '../../shared/dtos/DTOGroup';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { listDataTemp } from '../../shared/services/datatemp';
import { DTOAction } from '../../shared/dtos/DTOAction.dto';
import { DTOFunction } from '../../shared/dtos/DTOFunction';

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
export class SystemStructureComponent implements OnInit {
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
  // Field định danh item trong tree list
  idField: string = 'Code';
  // Có thể mở rộng từng item hay không
  isExpanded: boolean = true;


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


  constructor() { }

  ngOnInit(): void {
    this.getListOriginSysStructure();
  }

  // Lấy danh sách cấu trúc hệ thống
  getListOriginSysStructure() {
    this.isLoading = true;
    const data: any = listDataTemp;
    if (data.StatusCode == 0) {
      setTimeout(() => {
        this.listSysStructure = data.ObjectReturn;
        this.isLoading = false;
      }, 100)
    }
  }

  /**
   * Kiểm tra xem object đó có phải là group hay không
   * @param object Object cần kiểm tra
   * @returns 
   */
  isGroup(object: any): boolean {
    if (!object.DLLPackage && !object.ActionName && object.Vietnamese && object.Company >= 0) return true;

    return false;
  }

  /**
 * Kiểm tra xem object đó có phải là function hay không
 * @param object Object cần kiểm tra
 * @returns 
 */
  isFunction(object: any): boolean {
    if (object.DLLPackage && !object.ActionName) return true;

    return false;
  }

  /**
  * Kiểm tra xem object đó có phải là action hay không
  * @param object Object cần kiểm tra
  * @returns 
  */
  isAction(object: any): boolean {
    if (object.ActionName) return true;

    return false;
  }

  // Fetch data ra list
  fetchChildren = (item: any): Observable<any[]> => {
    if ((item.ListGroup?.length > 0 && item.ListFunctions?.length > 0)) {
      return scheduled(of([...item.ListGroup, ...item.ListFunctions]), asapScheduler);
    }
    if (item.ListAction) {
      return of(item.ListAction);
    }
    if (item.ListFunctions) {
      return of(item.ListFunctions);
    }
    if (item.ListGroup) {
      return of(item.ListGroup);
    }


    return of([]);
  };

  // Kiểm tra xem item đó có item con hay không
  hasChildren = (item: any): boolean => {
    return item.ListGroup?.length > 0 || item.ListFunctions?.length > 0 || item.ListAction?.length > 0;
  };

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
  isActionAddable(currentAction: DTOAction, listAction: DTOAction[], level: number): boolean {
    let levelCheck = 1;
    while (currentAction.ParentID) {
      const parentAction = listAction.find(a => a.Code === currentAction.ParentID);
      if (parentAction) {
        levelCheck++;
        currentAction = parentAction;
      } else {
        break;
      }
    }

    return levelCheck !== level;
  }

  // Kiểm tra xem có thể thêm module con hoặc action con
  isSubAddable(object: any): boolean {
    if (object.ActionName) {
      const group: DTOGroup = this.listSysStructure.find(group => group.Code === object.ModuleID);
      const functionOfGroup: DTOFunction = group.ListFunctions.find(func => func.Code === object.FunctionID);
      const listActionOfFunction: DTOAction[] = functionOfGroup.ListAction;
      return this.isActionAddable(object, listActionOfFunction, 3);
    }
    if (this.isGroup(object)) {
      if (!object.GroupID) return true;
    }
    return false;
  }

  // Lấy danh sách các action có thể handle
  getListActionHandle(object: any): ActionHandle[] {
    // Nếu là action
    if (object.ActionName) {
      const objAction: DTOAction = object;
      let listAction: ActionHandle[] = this.listActionHandle.filter(action => action.Code === 1 || action.Code === 6);
      // Kiểm tra có thể thêm con
      if (this.isSubAddable(objAction)) {
        listAction.push(this.listActionHandle.find(action => action.Code === 7));
      }
      // Kiểm tra có thể xóa
      if (!objAction.ListAction) {
        listAction.push(this.listActionHandle.find(action => action.Code === 10));
      }
      return listAction;
    }

    // Nếu là function
    if (object.DLLPackage) {
      const objFunction: DTOFunction = object;
      let listFunction: ActionHandle[] = this.listActionHandle.filter(action => action.Code === 1 || action.Code === 2 || action.Code === 4 || action.Code === 5);
      // Kiểm tra có thể xóa
      if (!objFunction.ListAction) {
        listFunction.push(this.listActionHandle.find(action => action.Code === 9));
      }
      return listFunction;
    }

    // Nếu là module
    if (this.isGroup(object)) {
      const objGroup: DTOGroup = object;
      let listGroup: ActionHandle[] = this.listActionHandle.filter(action => action.Code === 1 || action.Code === 2);
      // Kiểm tra có thể thêm con
      if (this.isSubAddable(objGroup)) {
        listGroup.push(this.listActionHandle.find(action => action.Code === 3));
      }
      listGroup.push(this.listActionHandle.find(action => action.Code === 4));
      // Kiểm tra có thể xóa
      if (!objGroup.ListFunctions && !objGroup.ListGroup) {
        listGroup.push(this.listActionHandle.find(action => action.Code === 8));
      }
      return listGroup;
    }

    return []
  }

  // Sự kiện được gọi khi click vào tool box
  handleToolBox(object: any) {
    console.log(this.getListActionHandle(object));
  }
}
