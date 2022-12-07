

export enum GSTAPPLICABLE {
    Applicable = '&#4; Applicable',
    NotApplicable = '&#4; Not Applicable',
    Undefined = '&#4; Undefined',
}

export enum TAXABILITY {
    Unkonwn = 'Unkonwn',
    Exempt = 'Exempt',
    NilRated = 'Nil Rated',
    Taxable = 'Taxable'
}

export enum GSTVALUATIONTYPE {
    OnValue = 'Based on Value',
    onQuantity = 'Based on Quantity',
    onRate = 'Based on Rate'
}

export enum COSTINGMETHOD {
    ZeroCost = 'At Zero Cost',
    AverageCost = 'Avg. Cost',
    FIFO = 'FIFO',
    FIFOPerpetual = 'FIFO Perpetual',
    LastPurchase = 'Last Purchase Cost',
    LIFOAnnual = 'LIFO Annual',
    LIFOPerpetual = 'LIFO Perpetual',
    MonthlyAverage = 'Monthly Avg. Cost',
    StandardCost = 'Std. Cost'
}

export enum TALLYGROUP {
    Non_Tally_Group = "" ,
    Branch_Divisions = "Branch / Divisions",
    Capital_Account = "Capital Account",
    Current_Assets = "Current Assets",
    Current_Liabilities = "Current Liabilities",
    Direct_Expenses = "Direct Expenses",
    Direct_Incomes = "Direct Incomes",
    Fixed_Assets = "Fixed Assets",
    Indirect_Expenses = "Indirect Expenses",
    Indirect_Incomes = "Indirect Incomes",
    Investments = "Investments",
    Loans_Liability = "Loans (Liability)",
    Misc_Expenses_ASSET = "Misc. Expenses (ASSET)",
    Purchase_Accounts = "Purchase Accounts",
    Sales_Accounts = "Sales Accounts",
    Bank_Accounts = "Bank Accounts",
    Bank_OD = "Bank OD A/c",
    Cash_in_hand = "Cash-in-Hand",
    Deposits_Asset = "Deposits (Asset)",
    Duties_and_Taxes = "Duties &amp; Taxes",
    Loans_and_Advances_Asset = "Loans &amp; Advances (Asset)",
    Provisions = "Provisions",
    Reserves_and_Surplus = "Reserves &amp; Surplus",
    Secured_Loans = "Secured Loans",
    Stock_in_hand = "Stock-in-Hand",
    Sundry_Creditors = "Sundry Creditors",
    Sundry_Debtors = "Sundry Debtors",
    Unsecured_Loans = "Unsecured Loans",
    Suspense  = "Suspense A/c"
}


export enum TALLYMASTERTYPES {
    Ledger_Groups = "Ledger Groups" ,
    Ledgers = 'Ledgers',
    Units = 'Units', 
    Stock_Groups = 'Stock Groups', 
    Stock_Items = 'Stock Items', 
    Stock_Categories = 'Stock Categories', 
    Locations = 'Locations', 
    CostCenters = 'Cost Centers', 
    CostCategories ='Cost Categories'
}


export interface ILedgerEntry {
    LedgerName: string;
    CashLedger: string;
    DebitCredit: string;
    LineAmount:number
    BillRef?: string;
}

export interface ILedgerEntries extends Array<ILedgerEntry>{}

//export interface ILedgerEntries { 
//    [index:number]:ILedgerEntry 
//} 

export interface IInventoryEntry {
    StockName: string;
    UOM: string;
    Qty:number;
    Rate:number;
    LineAmount:number;
    LedgerName: string;
}

export interface IInventoryEntries extends Array<IInventoryEntry>{}

//export  interface IInventoryEntries { 
//    [index:number]:IInventoryEntry 
//} 

/*
export class LedgerInfo {
    LedName : string = "";
    LedGroup : string = "";
    Id?:string;
    AliasName? : string;
    OpBal? : number;
    Add1? : string;
    Add2? : string;
    Add3? : string;
    Add4? : string;
    Add5? : string;
    PINCode? : string;
    State? : string;
    Country? : string;
    Email? : string;
    ContactPerson? : string;
    PANNo? : string;
    GSTINNo? : string;
    GSTApplicable? :boolean;
    GSTRegistrationType? : string;
    TaxType?  : TAXABILITY;
    GSTType? : string;
    GSTDuty? : number;
    GSTSupplyType? : string;
    RoundingMethod? : string;
    Roundinglimit? : number;
    IsBillwise? : boolean;
    CostCenterOn? : boolean;
    IsInterestOn? : boolean;
    AffectStock? : boolean;
    SAC_HSNcode? : string;
}

*/

export interface LedgerInfo {
    LedName : string;
    LedGroup : string;
    Id?:string;
    AliasName? : string;
    OpBal? : number;
    Add1? : string;
    Add2? : string;
    Add3? : string;
    Add4? : string;
    Add5? : string;
    PINCode? : string;
    State? : string;
    Country? : string;
    Email? : string;
    ContactPerson? : string;
    PANNo? : string;
    GSTINNo? : string;
    GSTApplicable? :boolean;
    GSTRegistrationType? : string;
    TaxType?  : TAXABILITY;
    GSTType? : string;
    GSTDuty? : number;
    GSTSupplyType? : string;
    RoundingMethod? : string;
    Roundinglimit? : number;
    IsBillwise? : boolean;
    CostCenterOn? : boolean;
    IsInterestOn? : boolean;
    AffectStock? : boolean;
    SAC_HSNcode? : string;
}


export interface StockGroupInfo {
    StockGroupName: string;
    Alias?: string;
    Parent?:string;
    isTaxabale?:boolean;
    TaxType?: TAXABILITY;
    HSC_SAC?:string;
    HSC_SAC_Descr?: string;
    GstApplicableFrom?: Date;
    GSTValuationType?:string;
    SGST_Rate?:number;
    CGST_Rate?:number;
    IGST_Rate?:number;
    SGST_Cess?:number;
    CGST_Cess?:number;
    IGST_Cess?:number
}

export interface ItemInfo {
    ItemName :string;
    Alias?: string;
    Parent?:string;
    ItemDescription?:string;
    Category?:string;
    BaseUOM :string;
    OpeningQty?: number;
    OpeningRate?: number;
    OpeningValue?: number;
    GSTApplicable?:boolean;
    CostingMethod?:COSTINGMETHOD;
    isPerishable?:boolean;
    isInclusiveOfTax?:boolean;
    TaxType?: TAXABILITY;
    GSTTypeofSupply?:string;
    GstApplicableFrom?: Date;
    HSC_SAC?:string;
    HSC_SAC_Descr?: string;
    GSTValuationType?:string;
    isReverseCharge?:boolean;
    SGST_Rate?: number;
    CGST_Rate?: number;
    IGST_Rate?: number;
    SGST_Cess?: number;
    CGST_Cess?: number;
    IGST_Cess?: number;
}

export interface VoucherTypeInfo {
    VoucherTypeName:string;
    IsDeemedPositive:boolean;
    Alias?: string;
    Parent?:string;
    MailingName?:string;
    NumberingMethod?:string
    UseZeroEntries?:boolean;
    PreventDuplicates?:boolean;
    PrefillZero?:boolean;    
    PrintAfterSave?:boolean;
    IsOptional?:boolean;
    CommonNarration?:boolean;
    MultiNarration?:boolean;
    IsTaxInvoice?:boolean;
}


export interface IVoucherData {
    VoucherTypeName: string;
    Action: string;
    VoucherDate: Date;
    VoucherNumber: string;
    VoucherRef?: string;
    VoucherRefDate?: Date;
    VoucherInvoiceView: string;
    HeaderLedger: string;
    Narration?: string;
    //HeaderAddress:? [string];
    HeaderAddress?: string[];
    StateName?:string;
    GSTRegistrationType?:string;
    PartyGSTNo?:string;
    VoucherTypeClass?:string;


    LedgerEntriesData : ILedgerEntries;    
    InventoryEntriesData : IInventoryEntries
}



export class LedgerEntry {
    LedgerName: string = ""
    CashLedger: string = ""
    DebitCredit: string = "DR"
    LineAmount:number = 0
    BillRef?: string = ""
}

export class InventoryEntry {
    StockName: string =""
    UOM: string =""
    Qty:number = 0
    Rate:number = 0
    LineAmount:number = 0
    LedgerName: string =""
}


export class VoucherData {
    VoucherTypeName: string = ""
    Action: string = "Create"
    VoucherDate: Date = new Date()
    VoucherNumber: string =""
    VoucherRef?: string = ""
    VoucherRefDate?: Date = new Date()
    VoucherInvoiceView: string = "Accounting Voucher View"
    VoucherEntryMode?:string = ""
    HeaderLedger: string =""
    Narration?: string = ""
    HeaderAddress?: string[] = []
    StateName?:string = ""
    GSTRegistrationType?:string =""
    PartyGSTNo?:string = ""
    VoucherTypeClass?:string =""

    LedgerEntriesData: LedgerEntry[] = []
    //LedgerEntriesData: ILedgerEntry[] = []
    //InventoryEntriesData: IInventoryEntries[] = []
    InventoryEntriesData: InventoryEntry[] = []
}

