
//import {TALLYMASTERTYPES} from '../webtally/tallyInterfaces'

export class VoucherStageData {
    FronoCompanyId:number = 0
    VoucherType:string = "Ledgers"
    Action: string = ""
    VoucherNumber:number = 0 
    VoucherDate:string = "" 
    //VoucherDate:Date = new Date()
    VoucherAmt:number = 0
    VoucherRef:string = ""
    VoucherRefDate:string = ""
    HeaderLedger:string = ""
    PartyLedger:string = ""
//    ReceiptStatus:number = 0

    isSelected:boolean = false 
    Status:string = "" 
    Message:string = ""

    isPDCCollection:boolean = false   //In case of PDC collection do not check for child records


}

