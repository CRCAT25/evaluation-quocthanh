export class DTOAction {
    Code: number
    ActionName: string
    ModuleID: number
    ModuleName: string
    FunctionID: number
    FunctionName: string
    ParentID: number
    ListAction: DTOAction[]
    TypeData: number
    PermissionConf: JSON
    IsVisible: boolean
}