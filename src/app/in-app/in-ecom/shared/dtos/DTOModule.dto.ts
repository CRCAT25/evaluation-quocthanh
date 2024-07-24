import { DTOFunction } from "./DTOGroup.dto"

export class DTOGroup {
    Code: number
    Vietnamese: string
    Company: number
    GroupID: number
    ModuleID: string
    ImageSetting: string
    TypeData: number
    OrderBy: number
    ListGroup: DTOGroup[]
    ListFunctions: DTOFunction[]
    IsVisible: boolean
}