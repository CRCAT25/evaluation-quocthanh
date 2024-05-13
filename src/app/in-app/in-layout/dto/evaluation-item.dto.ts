import * as internal from "stream"
import { DTOStatus } from "../../in-hri/pages/shared/dtos/DTOStatus.dto"

export class EvaluationItem{
    code: string
    name: string
    category: string
    dateStart: string
    dateEnd: string
    countMember: number
    status: DTOStatus
    stage: DTOStatus // new status   
}