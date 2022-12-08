import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TallyDataService } from '../webtally/tallydata.service';
import { TallyIntService } from '../webtally/tallyint.service';
import { FronoIntService } from '../webtally/fronoint.service';
import { MastersStageData } from '../model/MastersStageData';
import { VoucherStageData } from '../model/VoucherStageData';
import {  TALLYGROUP , LedgerInfo, ItemInfo, StockGroupInfo, VoucherData, LedgerEntry, InventoryEntry } from '../webtally/tallyInterfaces';
//import { Observable } from 'rxjs';
//import * as e from 'cors';



@Component({
  selector: 'app-stagging',
  templateUrl: './stagging.component.html',
  styleUrls: ['./stagging.component.css']
})
export class StaggingComponent implements OnInit {
  TallyData:TallyDataService
  MasterTypes:string[] = []
  ActionList:string[] = []
//  UOMList:any[] = []
//  stockGroupsList:any[] = []
//  stockCategoriesList:any[] = []
   LedgersList:any[] = []

   mFromDt:any;
   mToDt:any;
//  datePipe: any;

  constructor(private TallyAPI:TallyIntService, private FronoAPI:FronoIntService, private TallyDataSrv:TallyDataService,  private route:Router, private datePipe: DatePipe) { 
    this.TallyData = this.TallyDataSrv
    this.MasterTypes = this.TallyData.MasterTypes
    this.ActionList = ['Create', 'Modify', 'Delete' ]
  }

  ngOnInit(): void {
    //this.TallyData.ExportImport = 0
    //console.log(this.TallyData.ExportImport)

    this.TallyData.MastersStageData  = []
    //Collect frono data to be exported to Tally
    if(this.TallyData.ExportImport == 0){


      this.FronoAPI.getUOM().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
              //this.UOMList = res.data.data
              res.data.data.forEach( (item:any) => {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Units"
                  mData.MasterName = item.unitShortName
                  mData.Description = item.unitName
                  mData.Id = item.unitId
                  mData.Address1 = item.address1
                  this.TallyData.MastersStageData.push(mData) 
              });              
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          },
//          complete() {
//            setTimeout(() => {
//              console.log('sleep');        
//            }, 5000);                   
//          },
      })          


      this.FronoAPI.getStockGroups().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
//              this.stockGroupsList = res.data
              res.data.forEach( (item:any) => {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Stock Groups"
                  mData.MasterName = item.departmentName
                  mData.Id = item.departmentId                   
                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })


      this.FronoAPI.getStockCategories().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
//              this.stockCategoriesList = res.data
              res.data.forEach( (item:any) => {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Stock Categories"
                  mData.MasterName = item.categoryName
                  mData.Id = item.id
                  mData.ParentName = item.parent == "Primary" ? "" : item.parent
                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })
      

      this.FronoAPI.getGroups().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                if(item.isSuperAdmin == false && item.underAccountGroupsId != 0) {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Ledger Groups"
                  mData.MasterName = item.groupName
                  const parentData = res.data.filter( (el:any) =>  el.accountGroupsId  == item.underAccountGroupsId)
                  mData.ParentId = item.underAccountGroupsId
                  mData.ParentName = parentData[0].groupName
                  mData.Id = item.accountGroupsId
                  this.TallyData.MastersStageData.push(mData) 
                } 
              });
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })          

      
      this.FronoAPI.getAccounts().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
              //this.LedgersList = res.data
              res.data.forEach( (item:any) => {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Ledgers"
                  mData.MasterName = item.accountName
                  mData.ParentName = item.groupName
                  mData.Id = item.sagstLedgerId == 0 ? item.glAccountId : item.glAccountGSTLedgersId
                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })          


      this.FronoAPI.getCustomersVendors().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Ledgers"
                  mData.MasterName = item.companyName
                  mData.ParentName = item.contactType == 1 ? "Sundry Debtors" : "Sundry Creditors"
                  mData.Id = item.customerId 
                  mData.IncomeTaxNumber = !item.panNumber ? "" : item.panNumber
                  mData.Email = !item.email ? "" : item.email
                  mData.Contact = !item.mobile ? "" : item.mobile
                  mData.PartyGSTIN = !item.gstNumber ? "" : item.gstNumber 
                  
                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })          


      this.FronoAPI.getGodowns().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Godowns"
                  mData.MasterName = item.warehouseName
                  const parentInfo:any[] = res.data.filter((el:any) => el.warehouseId == item.parentWarehouseId )
                  const parentName = parentInfo.length == 0 ? "" : parentInfo[0].warehouseName
                  //mData.ParentName = item.parentWarehouseId == 0 ? "Primary" : parentName
                  mData.ParentName = parentName
                  mData.Id = item.warehouseId                   
                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })          
      
      
      this.FronoAPI.getStockItems().subscribe({        
        next: (res:any) => {
            // if(this.UOMList.length == 0) {          }
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                  let mData = new MastersStageData()
                  mData.Action = "Create"
                  mData.MasterType = "Stock Items"
                  mData.MasterName = item.itemName
                  mData.Alias = item.itemCode
                  mData.Description = item.itemDescription
//                  const UOMInfo:any[] = this.UOMList.filter((el:any) => el.saUnitId == item.unitId )
//                  const UOMName = UOMInfo.length == 0 ? "" : UOMInfo[0].unitShortName
//                  mData.UOM = UOMName
                  mData.UOM = item.unitShortName
                  mData.ParentName = item.departmentName
                  mData.category = item.subCategoryName
                  mData.Id = item.itemId 
                  mData.GstItemType = item.itemType
                  mData.TaxType = item.taxability
                  mData.HSNCode = item.hsnCode
                  mData.IGST = item.igst
                  mData.CGST = item.cgst
                  mData.SGST = item.sgst
                  mData.CESS = item.cess             
                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.error( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })          

    
     this.TallyDataSrv.vouchersFromDate.setDate(this.TallyDataSrv.vouchersToDate.getDate() - 30) 
     this.mFromDt = this.datePipe.transform(this.TallyDataSrv.vouchersFromDate, 'yyyy-MM-dd');
     this.mToDt = this.datePipe.transform(this.TallyDataSrv.vouchersToDate, 'yyyy-MM-dd');
     

    }
  }

  getFronoVoucherstoExport(){
    //Start Getting Vouchers Data

    this.FronoAPI.getSalesVouchersList().subscribe({        
      next: (res:any) => {
          // if(this.UOMList.length == 0) {          }
          if(res.messageText == "") {
            res.data.forEach( (item:any) => {
                let mData = new VoucherStageData()
                mData.Action = "Create"
                mData.VoucherType = "Sales"
                mData.VoucherNumber = item.invoiceId
                mData.VoucherDate = item.invoiceDate.substring(0, 10)
                mData.VoucherAmt = item.invoiceTotal
                mData.VoucherRef = item.invoiceNumber
                mData.VoucherRefDate = item.invoiceDate.substring(0, 10)
                mData.HeaderLedger = item.customerName            
                this.TallyData.TransactionsStageData.push(mData) 
            });
          } else {
            //dataRow.Status = "Failed" 
            //dataRow.Message = res.messageText
          }              
        },
        error: error => {
            console.error( error);
            //dataRow.Status = "Failed" 
            //dataRow.Message = error.messageText
        }                
    })          


    this.FronoAPI.getJrnlVouchersList().subscribe({        
      next: (res:any) => {
          if(res.messageText == "") {
            res.data.forEach( (item:any) => {
                let mData = new VoucherStageData()
                mData.Action = "Create"
                mData.VoucherType = "Journal"
                mData.VoucherNumber = item.accountsId
                mData.VoucherDate = item.entryDate.substring(0, 10)
                mData.VoucherAmt = 0
                mData.VoucherRef = item.voucherNo
                mData.VoucherRefDate = item.entryDate.substring(0, 10)
                this.TallyData.TransactionsStageData.push(mData) 
            });
          } else {
            //dataRow.Status = "Failed" 
            //dataRow.Message = res.messageText
          }              
        },
        error: error => {
            console.error( error);
            //dataRow.Status = "Failed" 
            //dataRow.Message = error.messageText
        }                
    })          


  }

  async SaveMasterstoFrono() {    
    //TallyData.MastersStageData
    for (const dataRow of this.TallyData.MastersStageData) {
      //await sendPromoCode(user);
//      console.log(dataRow)

      if (dataRow.MasterType == "Ledger Groups"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) { 
        this.FronoAPI.AddUpdateGroup(dataRow).subscribe({
          next: (res:any) => {
              //console.log(res.data)           
              if(res.messageText == "") {
                dataRow.Status = "Success" 
                dataRow.Message = res.messageText
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.messageText
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })          
      } 


      //console.log(dataRow);
    }

  }


  ExportMasterstoTally(){
    for (const dataRow of this.TallyData.MastersStageData) {
      if (dataRow.MasterType == "Ledger Groups"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) { 
        this.TallyAPI.CreateModifyGroup(dataRow.MasterName, TALLYGROUP.Non_Tally_Group,"" ,dataRow.ParentName, dataRow.Id, "" ).subscribe({
          next: (res:any) => {            
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Created " + res.data.CREATED + ", Modified " + res.data.ALTERED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }

      if (dataRow.MasterType == "Ledger Groups"  && dataRow.Action == "Delete"  ) { 
        this.TallyAPI.DeleteGroup(dataRow.MasterName ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Deleted " + res.data.DELETED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }

      if (dataRow.isSelected && dataRow.MasterType == "Ledgers"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) {         
        let ledgerData:LedgerInfo = {
          LedName : "",
          LedGroup : ""
        }
        ledgerData.Id =  dataRow.Id
        ledgerData.LedName = dataRow.MasterName
        ledgerData.LedGroup = dataRow.ParentName

//        console.log("Stagging component", ledgerData)
      
        this.TallyAPI.CreateModifyLedger(ledgerData, false, "" ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Created " + res.data.CREATED + ", Modified " + res.data.ALTERED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            },
        })      
      }

      if (dataRow.MasterType == "Ledgers"  && dataRow.Action == "Delete"  ) { 
        this.TallyAPI.DeleteLedger(dataRow.MasterName ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Deleted " + res.data.DELETED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }

      if (dataRow.isSelected && dataRow.MasterType == "Godowns"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) {         
        this.TallyAPI.CreateModifyLocation(dataRow.MasterName, false,"", dataRow.ParentName, "" , dataRow.Address1 ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Created " + res.data.CREATED + ", Modified " + res.data.ALTERED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            },
        })      
      }

      if (dataRow.MasterType == "Godowns"  && dataRow.Action == "Delete"  ) { 
        this.TallyAPI.DeleteLocation( dataRow.MasterName ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Deleted " + res.data.DELETED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }

      if (dataRow.isSelected && dataRow.MasterType == "Units"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) {         
        this.TallyAPI.CreateModifyUOM( dataRow.MasterName, dataRow.Description, false, "" ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Created " + res.data.CREATED + ", Modified " + res.data.ALTERED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            },
        })      
      }

      if (dataRow.MasterType == "Units"  && dataRow.Action == "Delete"  ) { 
        this.TallyAPI.DeleteUOM( dataRow.MasterName ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Deleted " + res.data.DELETED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }

      if (dataRow.isSelected && dataRow.MasterType == "Stock Groups"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) { 
        let stockGroupData:StockGroupInfo = {
          StockGroupName: dataRow.MasterName,
        }
        this.TallyAPI.CreateModifyStockGroup(  stockGroupData,  false, "" ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Created " + res.data.CREATED + ", Modified " + res.data.ALTERED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            },
        })      
      }

      if (dataRow.MasterType == "Stock Groups"  && dataRow.Action == "Delete"  ) { 
        this.TallyAPI.DeleteStockGroup( dataRow.MasterName  ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Deleted " + res.data.DELETED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }
      
      if (dataRow.isSelected && dataRow.MasterType == "Stock Categories"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) { 
        this.TallyAPI.CreateModifyStockCategory(  dataRow.MasterName,  false, "" , "", dataRow.ParentName ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Created " + res.data.CREATED + ", Modified " + res.data.ALTERED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            },
        })      
      }
      
      if (dataRow.MasterType == "Stock Categories"  && dataRow.Action == "Delete"  ) { 
        this.TallyAPI.DeleteStockCategory( dataRow.MasterName  ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Deleted " + res.data.DELETED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }

      if (dataRow.isSelected && dataRow.MasterType == "Stock Items"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) {         
        let itemData:ItemInfo = {          
          ItemName : dataRow.MasterName,
          Alias : dataRow.Alias,
          ItemDescription : dataRow.Description,
          BaseUOM : dataRow.UOM,
          Parent : dataRow.ParentName,
          GSTApplicable: (dataRow.TaxType == "" ? false : true ),
          Category: dataRow.category,
          HSC_SAC : dataRow.hsnCode,
          SGST_Rate : dataRow.SGST,
          CGST_Rate : dataRow.CGST,
          IGST_Rate : dataRow.IGST
        }
        
        this.TallyAPI.CreateModifyStockItem( itemData, false, ""  ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Created " + res.data.CREATED + ", Modified " + res.data.ALTERED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            },
        })      
      }

      if (dataRow.MasterType == "Stock Items"  && dataRow.Action == "Delete"  ) { 
        this.TallyAPI.DeleteStockItem( dataRow.MasterName  ).subscribe({
          next: (res:any) => {
              if(res.Error == false) {
                dataRow.Status = "Success" 
                dataRow.Message = "Deleted " + res.data.DELETED
              } else {
                dataRow.Status = "Failed" 
                dataRow.Message = res.Message
              }              
            },
            error: error => {
                console.error( error);
                dataRow.Status = "Failed" 
                dataRow.Message = error.messageText
            }                
        })
      }

     
      //console.log(dataRow);
    }

  }


  ExportVoucherstoTally(){
    console.log("Export voucher started...")
    //this.TallyData.CreateVoucher()
    for (const VchDataRow of this.TallyData.TransactionsStageData) {
//      console.log(VchDataRow)
      if (VchDataRow.isSelected && VchDataRow.VoucherType == "Sales"  && (VchDataRow.Action == "Create" || VchDataRow.Action == "Modify" )  ) {         
          this.FronoAPI.getSingleSalesVoucherData(VchDataRow.VoucherNumber).subscribe({
          next: (res:any) => {
             if(res.messageText == "") {
              let VchData:VoucherData  = new VoucherData()
              VchData.Action = "Create"
              VchData.VoucherTypeName = "Sales"
//              VchData.VoucherDate = this.FronoAPI.stringToDate(VchDataRow.VoucherDate)

              //Temp change date to 1st of Dec 2021  
              VchData.VoucherDate = this.FronoAPI.stringToDate("2021-12-01")

              VchData.VoucherNumber = VchDataRow.VoucherNumber
              VchData.VoucherRef = VchDataRow.VoucherRef             
              VchData.HeaderLedger = VchDataRow.HeaderLedger
              VchData.Narration  = "Created from Frono API" 
              VchData.VoucherInvoiceView ="Invoice Voucher View"
              VchData.VoucherEntryMode="Item Invoice"
      
              let LedgerEntriesData: LedgerEntry[] = []
              let InventoryEntriesData: InventoryEntry[] = []
              for (const itemsRow of res.data.itemDetails) {
                InventoryEntriesData.push({StockName : itemsRow.itemName, UOM: itemsRow.unitShortName, Qty : itemsRow.qty, Rate: itemsRow.rate, LineAmount: itemsRow.amount, LedgerName: "Sales Account" })
              } 
              VchData.InventoryEntriesData = InventoryEntriesData

              this.TallyAPI.SaleVoucher(VchData  ).subscribe({
                next: (response:any) => {
                    console.log(response)
                    if(response.Error == false) {
                      VchDataRow.Status = "Success" 
                      VchDataRow.Message = response.data
                      //dataRow.Message = "Created " + response.data.CREATED + ", Modified " + res.data.ALTERED
                    } else {
                      VchDataRow.Status = "Failed" 
                      VchDataRow.Message = response.Message
                    }
                  },
                  error: error => {
                      console.error( error);
                      VchDataRow.Status = "Failed" 
                      VchDataRow.Message = error.messageText
                  },
              })            
            }
          },
            error: error => {
                console.error( error);
                VchDataRow.Status = "Failed" 
                VchDataRow.Message = error.messageText
            },
        })      
      }

      if (VchDataRow.isSelected && VchDataRow.VoucherType == "Journal"  && (VchDataRow.Action == "Create" || VchDataRow.Action == "Modify" )  ) {         
        this.FronoAPI.getSingleJournalData(VchDataRow.VoucherNumber).subscribe({
          next: (res:any) => {
            if(res.messageText == "") {
              let VchData:VoucherData  = new VoucherData()
              VchData.Action = "Create"
              VchData.VoucherTypeName = "Journal"
  //              VchData.VoucherDate = this.FronoAPI.stringToDate(VchDataRow.VoucherDate)
              //Temp change date to 1st of Dec 2021  
              VchData.VoucherDate = this.FronoAPI.stringToDate("2021-12-01")

              VchData.VoucherNumber = VchDataRow.VoucherNumber
              VchData.VoucherRef = VchDataRow.VoucherRef
              VchData.VoucherRefDate = VchDataRow.VoucherRefDate
              VchData.Narration  = "Created from Frono API" 
      
              let LedgerEntriesData: LedgerEntry[] = []
  //            let InventoryEntriesData: InventoryEntry[] = []           
              for (const itemsRow of res.data.accountDetailsList) {
                let ledInfo:any[] = this.TallyData.MastersStageData.filter( (el:any) => el.MasterType == "Ledgers" && el.Id == itemsRow.ledgerAccountId )
                
                LedgerEntriesData.push({    
                  LedgerName :  ledInfo[0].MasterName ,
                  CashLedger  : "" ,
                  DebitCredit : itemsRow.drCr.toUpperCase(),
                  LineAmount  : itemsRow.debitAmount + itemsRow.creditAmount
                })
              } 
              VchData.LedgerEntriesData = LedgerEntriesData

              this.TallyAPI.JournalVoucher(VchData ).subscribe({
                next: (response:any) => {
                    if(response.Error == false) {
                      VchDataRow.Status = "Success" 
                      VchDataRow.Message = response.data
                      //dataRow.Message = "Created " + response.data.CREATED + ", Modified " + res.data.ALTERED
                    } else {
                      VchDataRow.Status = "Failed" 
                      VchDataRow.Message = response.Message
                    }
                  },
                  error: error => {
                      console.error( error);
                      VchDataRow.Status = "Failed" 
                      VchDataRow.Message = error.messageText
                  },
              })            
            }
          },
          error: error => {
              console.error( error);
              VchDataRow.Status = "Failed" 
              VchDataRow.Message = error.messageText
          },
        })      
      }

      

    }    
  }



  TallyImport(){
    

  }
  

  toggleSelect(){
    this.TallyData.MastersStageData.forEach(item => item.isSelected = !item.isSelected)

  }

  backToHome(){
    this.route.navigate(['tally-integration/home']);
  }





}
