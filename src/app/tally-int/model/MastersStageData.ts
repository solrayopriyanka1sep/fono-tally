
//import {TALLYMASTERTYPES} from '../webtally/tallyInterfaces'

export class MastersStageData {
//    TallyMasterType:TALLYMASTERTYPES = Ledgers
    FronoCompanyId:number = 0
    MasterType:string = "Ledgers"
    Action: string = ""
    Id:number = 0     //Can be used as alias
    MasterName:string = ""
    ParentId:Number = 0
    ParentName:string = ""
    Alias:string = ""
    Address1?:string = ""
    Address2?:string = ""
    Address3?:string = ""
    Address4?:string = ""
    PinCode?:string = ""
    StateName?:string = ""
    CountryName?:string = ""
    Email?:string = ""
    Phone?:string = ""
    Mobile?:string = ""
    Fax?:string = ""
    Contact?:string = ""
    IncomeTaxNumber?:string = ""
    PartyGSTIN?:string = ""
    GSTApplicable?:boolean = false

    GSTRegistrationType?:string = ""
    TaxType?:string = ""
    GSTType?:string = ""
    GSTDutyHead?:string = ""
    GSTTypeOfSupply?:string = ""
    RoundingMethod?:string = ""
    RoundingLimit?:number = 0

    IsBillwiseOn?:boolean = false
    IsCostCentresOn?:boolean = false
    IsInterestOn?:boolean = false
    AffectsStock?:boolean = false
    PrimaryGroup:string = ""

    OpeningBalance:number = 0
    DrCr:string = "DR"

    Description:string = ""
    GstItemType:string="Goods"
 
    isSelected:boolean = false 
    Status:string = "" 
    Message:string = ""


}

