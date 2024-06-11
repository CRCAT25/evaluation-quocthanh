import { DTOECOMChannel } from "./DTOECOMChannel.dto"

export class DTOECOMChannelGroup{
    Code: number = 0
    ChannelGroupName: string = ""
    ChannelGroupID: string = ""
    ListGroup: DTOECOMChannelGroup[] = []
    ParentID: number
    ListChannel: DTOECOMChannel[] = []
    IsPoolStock: boolean = true
    IsOutDistributedStock: boolean = false
    Priority: number = 1
    NumOfProducts: number = 0
    ListIcon: string[] = []
    TypeData: number
    IsChild: boolean
    ListPriority: DTOECOMChannelGroup[] = []
    
    
    
    
    
   
    
    
    
    
    
    
    
    
}