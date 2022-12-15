import { Injectable } from '@angular/core';
import { TallyIntService  } from '../webtally/tallyint.service';
import { configData } from '../model/configData';
import { FronoIntService } from './fronoint.service';
import { MastersStageData } from '../model/MastersStageData';
import { VoucherData, LedgerEntry, InventoryEntry } from '../webtally/tallyInterfaces';

//import { TALLYGROUP, IVoucherData, ILedgerEntries, ILedgerEntry, IInventoryEntries, IInventoryEntry } from '../webtally/tallyInterfaces';

/*
export interface IConfigData {
    Ledgers :boolean ;   
    StockItems: boolean ;
    Locations:boolean;
    CostCenters:boolean;
    CostCategories:boolean;
    SalesRelated:boolean;
    PurchaseRelated:boolean;
    ReceiptPayments:boolean;
    Journals:boolean;
    SalesOrders:boolean;
    PurchaseOrders:boolean;
}
*/


@Injectable({
    providedIn: 'root'
})

  
export class TallyDataService {
    TallyGroupsData: any[] = []
    TallyLedgerData: any[] = []
    TallyUOMsData: any[] = []
    TallyStockGroupsData: any[] = []
    TallyStockItemsData: any[] = []
    TallyStockCategories: any[] = []
    TallyCostCenters: any[] = []
    TallyCostCategories: any[] = []
    TallyLocations: any[] = []

    vouchersFromDate:Date = new Date()
    vouchersToDate:Date = new Date()

    TallyMastersStageData:any[] = []
    MastersStageData:any[] = []
    TransactionsStageData:any[] = []

    mappingData:any[] = []
    FronoCompanyNumber:number = 0

    
    MasterTypes:string[] =['Ledger Groups', 'Ledgers', 'Units', 'Stock Groups', 'Stock Items', 'Stock Categories', 'Locations', 'Cost Centers', 'Cost Categories' ]

    ConfigOptions:configData
    DataType:number = 0  // 0 - Master , 1 Transactions
    ExportImport:number = 0 //0 - Export to Tally , 1 Import from Tally

  
    constructor(private TallyAPI:TallyIntService, private FronoAPI:FronoIntService) { 
        this.ConfigOptions = new configData()
        
        //{Ledgers:true, StockItems: false, Locations: false, CostCenters: false,  CostCategories: false ,
        //    SalesRelated : true,  PurchaseRelated : true,  ReceiptPayments: true,  Journals: true,  SalesOrders: false,  PurchaseOrders: false }
    }


    public init(FronoCompanyNumber:number):void{
        this.FronoCompanyNumber = FronoCompanyNumber
        this.FronoAPI.init(this.FronoCompanyNumber)

        if(!this.TallyAPI.isConnectedtoTally) return

        this.FronoAPI.getConfig().subscribe({
            next: (res:any) => {
                this.ConfigOptions = res.data 
            },
            error: error => {
                //this.TallyGroupsData = []

            }                
        })

        this.FronoAPI.getMappingData().subscribe({
            next: (res:any) => {
                this.mappingData = res.data 
            },
            error: error => {
                this.mappingData = []

            }                
        })

        //console.log("Tally Data started")
        


        if(this.ConfigOptions.ledgerMasters) {
            this.TallyAPI.GetTallyGroups.subscribe({
                next: (res:any) => {
                    this.TallyGroupsData = res.data               
                    this.TallyGroupsData.forEach((Item) => {
                        let mData = new MastersStageData()
                        mData.FronoCompanyId =this.FronoCompanyNumber
                        mData.MasterType = 'Ledger Groups'
                        mData.MasterName = Item.GROUPNAME
                        mData.ParentId = 0
                        mData.ParentName = Item.Parent
                        mData.isSelected = false
                        mData.Action = 'Create' 
                        mData.Status = ""
                        mData.Message = "" 
//                        {MasterType : 'Ledger Groups', MasterName : Item.GROUPNAME, isSelected: false, Action : 'Create', Status : "", Message: "", Parent : ""  }
                        this.TallyMastersStageData.push(mData)
                    });
                },
                error: error => {
                    this.TallyGroupsData = []
                }                
            })
        
            this.TallyAPI.GetTallyLedger.subscribe({
                next: (res:any) => {
                    this.TallyLedgerData = res.data
                    //console.log(this.TallyLedgerData)
                    this.TallyLedgerData.forEach((Item) => {
                        this.TallyMastersStageData.push({MasterType : 'Ledgers', MasterName : Item.LEDGERNAME, isSelected: false, Action : 'Create', Status : "", Message: ""  })
                    });
                },
                error: error => this.TallyLedgerData = [] 
            })
        }

        if(this.ConfigOptions.stockMasters) {       
            this.TallyAPI.GetTallyUOM.subscribe({
                next: (res:any) => {                        
                        this.TallyUOMsData = res.data 
                        console.log(this.TallyUOMsData)
                        this.TallyUOMsData.forEach((Item) => {
                            this.TallyMastersStageData.push({MasterType : 'Units', MasterName : Item.UNITNAME , isSelected: false, Action : 'Create', Status : "", Message: ""  })
                        });    
                    },
                error: error => this.TallyUOMsData = [] 
            })
    
    
            this.TallyAPI.GetTallyStockGroups.subscribe({
                next: (res:any) => {
                    this.TallyStockGroupsData = res.data 
                    this.TallyStockGroupsData.forEach((Item) => {
                        this.TallyMastersStageData.push({MasterType : 'Stock Groups', MasterName : Item.STOCKGROUPNAME , isSelected: false, Action : 'Create', Status : "", Message: ""  })
                    });    
                },
                error: error => this.TallyStockGroupsData = [] 
            })
    
            this.TallyAPI.GetTallyStockCategories.subscribe({
                next: (res:any) => {
                    this.TallyStockCategories = res.data 
                    this.TallyStockCategories.forEach((Item) => {
                        this.TallyMastersStageData.push({MasterType : 'Stock Categories', MasterName : Item.STOCKCATEGORYNAME , isSelected: false, Action : 'Create', Status : "", Message: ""  })
                    });
                },
                error: error => this.TallyStockCategories = [] 
            })
    
            this.TallyAPI.GetTallyStockItem.subscribe({
                next: (res:any) => {
                    this.TallyStockItemsData = res.data 
                    this.TallyStockItemsData.forEach((Item) => {
                        this.TallyMastersStageData.push({MasterType : 'Stock Items', MasterName : Item.STOCKNAME , isSelected: false, Action : 'Create', Status : "", Message: ""  })
                    });
                },
                error: error => this.TallyStockItemsData = [] 
            })


        }
    
        if(this.ConfigOptions.costCenters) {       
            this.TallyAPI.GetTallyCostCenters.subscribe({
                next: (res:any) => {
                    this.TallyCostCenters = res.data
                    this.TallyCostCenters.forEach((Item) => {
                        this.TallyMastersStageData.push({MasterType : 'Cost Centers', MasterName : Item.COSTCENTERNAME , isSelected: false, Action : 'Create', Status : "", Message: ""  })
                    });
                },
                error: error => this.TallyCostCenters = [] 
            })
        }
    
        if(this.ConfigOptions.costCategories) {       
            this.TallyAPI.GetTallyCostCategory.subscribe({
                next: (res:any) => {
                    this.TallyCostCategories = res.data
                    this.TallyCostCategories.forEach((Item) => {
                        this.TallyMastersStageData.push({MasterType : 'Cost Categories', MasterName : Item.COSTCATEGORYNAME , isSelected: false, Action : 'Create', Status : "", Message: ""  })
                    });
                },
                error: error => this.TallyCostCategories = [] 
            })
        }
    
        if(this.ConfigOptions.locations) {       
            this.TallyAPI.GetTallyLocations.subscribe({
                next: (res:any) => {
                    this.TallyLocations = res.data 
                    this.TallyLocations.forEach((Item) => {
                        this.TallyMastersStageData.push({MasterType : 'Locations', MasterName : Item.LOCATIONNAME , isSelected: false, Action : 'Create', Status : "", Message: ""  })
                    });
                },
                error: error => this.TallyLocations = [] 
            })
        }  
        
        
    }

    public CreateVoucher(){

        const vchrData:any[] =[]

        vchrData.push({Action:"Create", VoucherTypeName: "Receipt", HeaderLedger: "Cash", VoucherNumber: "001", VoucherDate : new Date(2021, 3, 1), VoucherRef :"TEST001", VoucherRefDate :new Date(2021, 3, 1), 
                       BillRef1 : '1', Led1 : "Debtor 1" , Amount1 : 1500, BillRef2 : '2', Led2 : "Debtor 2" , Amount2 : 3500  })



        const Vchr = new VoucherData()
        Vchr.Action="Create"
        Vchr.VoucherTypeName = "Receipt"
        Vchr.HeaderLedger = "Cash"
        Vchr.VoucherNumber = "001"
        Vchr.VoucherDate = new Date(2021, 3, 1)  //3 is April Month
        Vchr.VoucherRef = "TEST"
        Vchr.VoucherRefDate = new Date(2021, 3, 1)

        const ledgerEntry1:LedgerEntry = new LedgerEntry()
        ledgerEntry1.LedgerName = "Debtor 1"
        ledgerEntry1.DebitCredit = "DR" 
        ledgerEntry1.LineAmount = 1000
        ledgerEntry1.BillRef="1"

        Vchr.LedgerEntriesData.push(ledgerEntry1)

        this.TallyAPI.ReceiptVoucher(Vchr).subscribe({
            next: (res:any) => {
                console.log(res)
            },
            error: error => {
                //this.TallyGroupsData = []
                console.log(error)
            }                
        })

        let Vchr1 = new VoucherData()
        Vchr1.Action="Delete"
        Vchr1.VoucherTypeName = "Receipt"
        Vchr1.HeaderLedger = "Cash"
        Vchr1.VoucherNumber = "001"
        Vchr1.VoucherDate = new Date(2021, 4, 1)  //3 is April Month

        this.TallyAPI.ReceiptVoucher(Vchr1).subscribe({
            next: (res:any) => {
                console.log(res)
            },
            error: error => {
                //this.TallyGroupsData = []
                console.log(error)

            }                
        })


        const Vchr3 = new VoucherData()
        Vchr3.Action = "xxx"
        Vchr3.VoucherTypeName = "Payment"
        Vchr3.HeaderLedger = "Cash"
        Vchr3.VoucherNumber = "001"
        Vchr3.VoucherDate = new Date(2021, 3, 1)  //3 is April Month
        Vchr3.VoucherRef = "TEST"        
        Vchr3.VoucherDate = new Date(2021, 3,1)
        Vchr3.Narration = "Voucher created from Frono"

        const ledgerEntry3:LedgerEntry = new LedgerEntry()
        ledgerEntry3.LedgerName = "Creditor 1"
        ledgerEntry3.DebitCredit = "CR" 
        ledgerEntry3.LineAmount = 1000
//        ledgerEntry3.BillRef="1"

        Vchr3.LedgerEntriesData.push(ledgerEntry3)

        this.TallyAPI.PaymentVoucher(Vchr3).subscribe({
            next: (res:any) => {
                console.log(res)
            },
            error: error => {
                //this.TallyGroupsData = []
                console.log(error)
            }                
        })


        const Vchr4 = new VoucherData()
        Vchr4.Action = "Create"
        Vchr4.VoucherTypeName = "Journal"
        Vchr4.HeaderLedger = "Cash"
        Vchr4.VoucherNumber = "001"
        Vchr4.VoucherDate = new Date(2021, 3, 1)  //3 is April Month
        Vchr4.VoucherRef = "TEST"        
        Vchr4.VoucherRefDate = new Date(2021, 3,1)
        Vchr4.Narration = "Voucher created from Frono"

        const ledgerEntry4:LedgerEntry = new LedgerEntry()
        ledgerEntry4.LedgerName = "Debtor 1"
        ledgerEntry4.DebitCredit = "CR" 
        ledgerEntry4.LineAmount = 1000
//        ledgerEntry3.BillRef="1"

        const ledgerEntry41:LedgerEntry = new LedgerEntry()
        ledgerEntry41.LedgerName = "Discount Given"
        ledgerEntry41.DebitCredit = "DR" 
        ledgerEntry41.LineAmount = 1000

        Vchr4.LedgerEntriesData.push(ledgerEntry4)
        Vchr4.LedgerEntriesData.push(ledgerEntry41)

        this.TallyAPI.JournalVoucher(Vchr4).subscribe({
            next: (res:any) => {
                console.log(res)
            },
            error: error => {
                //this.TallyGroupsData = []
                console.log(error)
            }                
        })


        const Vchr5 = new VoucherData()
        Vchr5.Action = "Create"
        Vchr5.VoucherTypeName = "Sales"
        Vchr5.HeaderLedger = "Debtor 1"
        Vchr5.VoucherNumber = "001"
        Vchr5.VoucherDate = new Date(2021, 3, 1)  //3 is April Month
        Vchr5.VoucherRef = "TEST"        
        Vchr5.VoucherDate = new Date(2021, 3,1)
        Vchr5.VoucherInvoiceView ="Invoice Voucher View"
        Vchr5.VoucherEntryMode="Item Invoice"
        Vchr5.Narration = "Voucher created from Frono"

        const inventotyData1:InventoryEntry = new InventoryEntry()
        inventotyData1.StockName="Stock Item 1"
        inventotyData1.Qty = 1
        inventotyData1.Rate = 100
        inventotyData1.UOM ="PCS"
        inventotyData1.LineAmount = 100
        inventotyData1.LedgerName = "Sales Account"

        const inventotyData2:InventoryEntry = new InventoryEntry()
        inventotyData2.StockName="Stock Item 2"
        inventotyData2.Qty = 2
        inventotyData2.Rate = 500
        inventotyData2.UOM ="PCS"
        inventotyData2.LineAmount = 1000
        inventotyData2.LedgerName = "Sales Account"

        Vchr5.InventoryEntriesData.push(inventotyData1)
        Vchr5.InventoryEntriesData.push(inventotyData2)

        const ledgerEntry51:LedgerEntry = new LedgerEntry()
        ledgerEntry51.LedgerName = "SGST 9 %"
        ledgerEntry51.DebitCredit = "CR" 
        ledgerEntry51.LineAmount = 1000
//        ledgerEntry3.BillRef="1"

        const ledgerEntry52:LedgerEntry = new LedgerEntry()
        ledgerEntry52.LedgerName = "CGST 9%"
        ledgerEntry52.DebitCredit = "CR" 
        ledgerEntry52.LineAmount = 1000

        Vchr5.LedgerEntriesData.push(ledgerEntry51)
        Vchr5.LedgerEntriesData.push(ledgerEntry52)

        this.TallyAPI.SaleVoucher(Vchr5).subscribe({
            next: (res:any) => {
                console.log(res)
            },
            error: error => {
                //this.TallyGroupsData = []
                console.log(error)
            }                
        })


        const Vchr6 = new VoucherData()
        Vchr6.Action = "Create"
        Vchr6.VoucherTypeName = "Purchase"
        Vchr6.HeaderLedger = "Creditor 1"
        Vchr6.VoucherNumber = "001"
        Vchr6.VoucherDate = new Date(2021, 3, 1)  //3 is April Month
        Vchr6.VoucherRef = "TEST"        
        Vchr6.VoucherDate = new Date(2021, 3,1)
        Vchr6.VoucherInvoiceView ="Invoice Voucher View"
        Vchr6.VoucherEntryMode="Item Invoice"
        Vchr6.Narration = "Voucher created from Frono"

        const inventotyData3:InventoryEntry = new InventoryEntry()
        inventotyData3.StockName="Stock Item 1"
        inventotyData3.Qty = 5
        inventotyData3.Rate = 80
        inventotyData3.UOM ="PCS"
        inventotyData3.LineAmount = 400
        inventotyData3.LedgerName = "Purchase Account"

        const inventotyData4:InventoryEntry = new InventoryEntry()
        inventotyData4.StockName="Stock Item 2"
        inventotyData4.Qty = 5
        inventotyData4.Rate = 300
        inventotyData4.UOM ="PCS"
        inventotyData4.LineAmount = 1500
        inventotyData4.LedgerName = "Purchase Account"

        Vchr6.InventoryEntriesData.push(inventotyData3)
        Vchr6.InventoryEntriesData.push(inventotyData4)

        const ledgerEntry61:LedgerEntry = new LedgerEntry()
        ledgerEntry61.LedgerName = "SGST 9 %"
        ledgerEntry61.DebitCredit = "DR" 
        ledgerEntry61.LineAmount = 1000
//        ledgerEntry3.BillRef="1"

        const ledgerEntry62:LedgerEntry = new LedgerEntry()
        ledgerEntry62.LedgerName = "CGST 9%"
        ledgerEntry62.DebitCredit = "DR" 
        ledgerEntry62.LineAmount = 1000

        Vchr6.LedgerEntriesData.push(ledgerEntry61)
        Vchr6.LedgerEntriesData.push(ledgerEntry62)

        this.TallyAPI.PurchaseVoucher(Vchr6).subscribe({
            next: (res:any) => {
                console.log(res)
            },
            error: error => {
                //this.TallyGroupsData = []
                console.log(error)
            }                
        })




    }


}  