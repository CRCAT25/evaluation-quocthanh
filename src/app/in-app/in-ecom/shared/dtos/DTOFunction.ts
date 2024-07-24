import { DTOAction } from "./DTOAction.dto"

export class DTOFunction {
    Code: number
    VietNamese: string
    ModuleID: number
    DLLPackage: string
    ImageSetting: string
    TypeData: number
    OrderBy: number
    ListAction: DTOAction[]
    PermissionConf: JSON
}