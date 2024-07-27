export class EnumConfig {
    static GetListProduct: string = 'http://test.lapson.vn/api/product/GetProduct';
    static GetListSysStructureTree: string = 'http://172.16.10.86:75/qc/api/sys/GetListSysStructureTree';
    static GetListModuleTree: string = 'http://172.16.10.86:75/qc/api/sys/GetListModuleTree';
    static UpdateModule: string = 'http://172.16.10.86:75/qc/api/sys/UpdateModule';
}
/**
 * Đây là mẫu một module sẽ có 1 file enum riêng. 
 * Trong trường hợp chỉ mỗi bạn là một 1 module thì sẽ không tạo từng enum riêng 
 * mà tạo theo nhóm module lên trên menu.
 * Ví dụ: bài tập được giao nằm trong module nhân sự (hri) thì tạo ra một file enum hri.enum.ts 
 * và viết tất cả các enum cho các chức năng của module này tại đây.
 * Đây là file mẫu không xóa hoặc sửa !important
 */
