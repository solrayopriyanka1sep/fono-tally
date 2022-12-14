import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TallyDataService } from '../webtally/tallydata.service';
import { TallyIntService } from '../webtally/tallyint.service';
import { FronoIntService } from '../webtally/fronoint.service';
import { MastersStageData } from '../model/MastersStageData';
import { VoucherStageData } from '../model/VoucherStageData';
import {  TALLYGROUP , LedgerInfo, ItemInfo, StockGroupInfo, VoucherData, LedgerEntry, InventoryEntry } from '../webtally/tallyInterfaces';
import { CanceledError } from 'axios';
import { clear } from 'console';
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
  VoucherTypeList:string[]=[]
  selectedVoucherType = "All"

  MastersTypeList:string[]=[]
  selectedMasterType = "All"

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
    this.VoucherTypeList = ['All', 'Sales', 'Purchase', 'Debit Note', 'Credit Note', 'Receipt', 'Payment', 'Journal']
    this.MastersTypeList = ['All', 'Ledger Groups', 'Ledgers', 'Units', 'Stock Groups', 'Stock Categories', 'Stock Items', 'Locations', 'Cost Centers', 'Cost Categories' ]
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })
      

      this.FronoAPI.getGroups().subscribe({
        next: (res:any) => {
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                //if(item.isDisabled == false && item.underAccountGroupsId > 1) {
                if(item.underAccountGroupsId > 1) {  
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
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
                  mData.Address1 = item.city
//                  mData.Address2
//                  mData.Address3
//                  mData.Address4
                  mData.GSTApplicable = item.gstNumber != "" 
                  mData.StateName = "Maharashtra"
                  mData.CountryName = 'India'
                  mData.GSTRegistrationType = "Regular"
                  mData.PartyGSTIN = item.gstNumber        
                  mData.IsBillwiseOn = true
                  mData.IsCostCentresOn = false
                  mData.isPersonCompany = true           

                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
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
                  mData.Taxability = item.taxability
                  mData.HSNCode = item.hsnCode
                  mData.IGST = item.igst
                  mData.CGST = item.cgst
                  mData.SGST = item.sgst
                  mData.CESS = item.cess             
                  this.TallyData.MastersStageData.push(mData) 
              });
            } else {
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
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
    //console.log(typeof this.mFromDt)
    const fromDtMMDDYYYY = this.FronoAPI.strDateToStrMMDDYYYY(this.mFromDt)
    const toDtMMDDYYYY = this.FronoAPI.strDateToStrMMDDYYYY(this.mToDt)
    this.TallyData.TransactionsStageData = []

    if(this.selectedVoucherType == "All" || this.selectedVoucherType == "Sales" ) {
      this.FronoAPI.getSalesVouchersList(fromDtMMDDYYYY, toDtMMDDYYYY).subscribe({        
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })          
    }

    if(this.selectedVoucherType == "All" || this.selectedVoucherType == "Journal" ) {
      this.FronoAPI.getJrnlVouchersList(fromDtMMDDYYYY, toDtMMDDYYYY).subscribe({        
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
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })
    }

    //Receipts
/*    
    this.FronoAPI.getPDCCollectionList().subscribe({        
      next: (res:any) => {
          if(res.messageText == "") {
            res.data.forEach( (item:any) => {
                let mData = new VoucherStageData()
                mData.Action = "Create"
                mData.VoucherType = "Receipt"
                mData.VoucherNumber = item.collectionId
                mData.VoucherDate = item.depositDate.substring(0, 10)
                mData.VoucherAmt = item.amount
                mData.VoucherRef = item.collectionNumber                
                mData.VoucherRefDate = item.depositDate.substring(0, 10)
                mData.HeaderLedger = item.bankDisplayName
                mData.isPDCCollection = true
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
*/

    if(this.selectedVoucherType == "All" || this.selectedVoucherType == "Receipt" ) {
      this.FronoAPI.getBankCollectionList(fromDtMMDDYYYY, toDtMMDDYYYY).subscribe({        
        next: (res:any) => {
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                // Receipt Status : 1 - pending,  2 - Canceled  3 - delete,  4-  Deposit  5 - clear 6 - Bounce
                if(item.statusType == 4 || item.statusType == 5 ) {                              
                  let mData = new VoucherStageData()
                  mData.Action = "Create"
                  mData.VoucherType = "Receipt"
                  mData.VoucherNumber = item.collectionId
                  mData.VoucherDate = item.collectionDate.substring(0, 10)
                  mData.VoucherAmt = item.amount
                  mData.VoucherRef = item.collectionNumber
                  mData.VoucherRefDate = item.collectionDate.substring(0, 10)
                  mData.HeaderLedger = item.bankDisplayName
                  mData.PartyLedger = item.companyName
                  this.TallyData.TransactionsStageData.push(mData) 
                }
              });
            } else {
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })
    }  

    if(this.selectedVoucherType == "All" || this.selectedVoucherType == "Purchase" ) {
      this.FronoAPI.getPurchaseVouchersList(fromDtMMDDYYYY, toDtMMDDYYYY).subscribe({        
        next: (res:any) => {
            if(res.messageText == "") {
              console.log(res)
              res.data.forEach( (item:any) => {
                  let mData = new VoucherStageData()
                  mData.Action = "Create"
                  mData.VoucherType = "Purchase"
                  mData.VoucherNumber = item.invoiceId
                  mData.VoucherDate = item.invoiceDate.substring(0, 10)
                  mData.VoucherAmt = item.invoiceTotal
                  mData.VoucherRef = item.invoiceNumber
                  mData.VoucherRefDate = item.invoiceDate.substring(0, 10)
                  mData.HeaderLedger = item.vendorName
                  mData.PartyLedger = item.vendorName
                  this.TallyData.TransactionsStageData.push(mData) 
              });
            } else {
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })
    }

    if(this.selectedVoucherType == "All" || this.selectedVoucherType == "Credit Note" ) {
      this.FronoAPI.getCreditNotesList(fromDtMMDDYYYY, toDtMMDDYYYY).subscribe({        
        next: (res:any) => {
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                  let mData = new VoucherStageData()
                  mData.Action = "Create"
                  mData.VoucherType = "Credit Note"
                  mData.VoucherNumber = item.creditNoteId
                  mData.VoucherDate = item.creditNoteDate.substring(0, 10)
                  mData.VoucherAmt = item.creditNoteTotal
                  mData.VoucherRef = item.creditNoteNumber
                  mData.VoucherRefDate = item.creditNoteDate.substring(0, 10)
                  mData.HeaderLedger = item.customerName
                  mData.PartyLedger = item.customerName
                  this.TallyData.TransactionsStageData.push(mData) 
              });
            } else {
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })
    }

    if(this.selectedVoucherType == "All" || this.selectedVoucherType == "Debit Note" ) {
      this.FronoAPI.getDebitNotesList(fromDtMMDDYYYY, toDtMMDDYYYY).subscribe({        
        next: (res:any) => {
            if(res.messageText == "") {
              res.data.forEach( (item:any) => {
                  let mData = new VoucherStageData()
                  mData.Action = "Create"
                  mData.VoucherType = "Debit Note"
                  mData.VoucherNumber = item.debitNoteId
                  mData.VoucherDate = item.debitNoteDate.substring(0, 10)
                  mData.VoucherAmt = item.debitNoteTotal
                  mData.VoucherRef = item.debitNoteNumber
                  mData.VoucherRefDate = item.debitNoteDate.substring(0, 10)
                  mData.HeaderLedger = item.customerName
                  mData.PartyLedger = item.customerName
                  this.TallyData.TransactionsStageData.push(mData) 
              });
            } else {
              console.log(res)
              //dataRow.Status = "Failed" 
              //dataRow.Message = res.messageText
            }              
          },
          error: error => {
              console.log( error);
              //dataRow.Status = "Failed" 
              //dataRow.Message = error.messageText
          }                
      })
    }





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
      if (dataRow.isSelected && dataRow.MasterType == "Ledger Groups"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) { 
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

      if (dataRow.isSelected && dataRow.MasterType == "Ledger Groups"  && dataRow.Action == "Delete"  ) { 
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
          Id : dataRow.Id, 
          LedName : dataRow.MasterName,
          LedGroup : dataRow.ParentName,
        }

        if(dataRow.isPersonCompany) {
          ledgerData.Add1 = dataRow.Address1
          ledgerData.State = dataRow.StateName
          ledgerData.Country = dataRow.CountryName
          ledgerData.Email = dataRow.Email
          ledgerData.PANNo = dataRow.IncomeTaxNumber
          ledgerData.GSTINNo = dataRow.PartyGSTIN
          ledgerData.GSTApplicable = dataRow.GSTApplicable
          ledgerData.GSTRegistrationType  = dataRow.GSTRegistrationType
          ledgerData.IsBillwise = dataRow.IsBillwiseOn
          ledgerData.CostCenterOn = dataRow.IsCostCentresOn
        }


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

      if (dataRow.isSelected && dataRow.MasterType == "Ledgers"  && dataRow.Action == "Delete"  ) { 
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

      if (dataRow.isSelected && dataRow.MasterType == "Godowns"  && dataRow.Action == "Delete"  ) { 
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

      if (dataRow.isSelected && dataRow.MasterType == "Units"  && dataRow.Action == "Delete"  ) { 
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

      if (dataRow.isSelected && dataRow.MasterType == "Stock Groups"  && dataRow.Action == "Delete"  ) { 
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
      
      if (dataRow.isSelected && dataRow.MasterType == "Stock Categories"  && dataRow.Action == "Delete"  ) { 
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
          BaseUOM : !dataRow.UOM ? "UNT" : dataRow.UOM,
          Parent : dataRow.ParentName,
          GSTApplicable: (dataRow.TaxType == "" ? false : true ),
          Taxability: dataRow.Taxability,
          Category: dataRow.category,
          HSC_SAC : dataRow.HSNCode,
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

      if (dataRow.isSelected && dataRow.MasterType == "Stock Items"  && dataRow.Action == "Delete"  ) { 
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


  GetGSTLedgerName(VoucherType:string, GSTType:String, GSTRate:number ):string{
    let defaultLed = ""
    if(VoucherType == "Sales") defaultLed = GSTType == "State Tax" ? "SGST Output Account" : GSTType == "Central Tax" ? "CGST Output Account" : "IGST Output Account"
    if(VoucherType == "Purchase") defaultLed = GSTType == "State Tax" ? "SGST Input Account" : GSTType == "Central Tax" ? "CGST Input Account" : "IGST Input Account"

    const LedInfo = this.TallyData.mappingData.filter(el => el.fronoCompanyId == this.TallyData.FronoCompanyNumber && el.voucherType == VoucherType && el.transactionType == "GST" && el.gstType == GSTType  && el.gstRate == GSTRate)
    const GSTLedger = LedInfo.length > 0 ? LedInfo[0].tallyLedgerName : defaultLed

    return GSTLedger
  }


  ExportVoucherstoTally(){
    console.log("Export voucher started...")
    //this.TallyData.CreateVoucher()

    const SaleDistLedInfo:any[] = this.TallyData.mappingData.filter(el => el.fronoCompanyId == this.TallyData.FronoCompanyNumber && el.voucherType == "Sales" && el.transactionType == "Discount" )
    const SaleDiscountLedger = SaleDistLedInfo.length > 0 ? SaleDistLedInfo[0].tallyLedgerName : "Discount Given"

    const SaleRoundOffLedInfo:any[] = this.TallyData.mappingData.filter(el => el.fronoCompanyId == this.TallyData.FronoCompanyNumber && el.voucherType == "Sales" && el.transactionType == "Round Off" )
    const SaleRoundOffLedger = SaleRoundOffLedInfo.length > 0 ? SaleRoundOffLedInfo[0].tallyLedgerName : "RoundOff"

    const SaleTDSLedInfo:any[] = this.TallyData.mappingData.filter(el => el.fronoCompanyId == this.TallyData.FronoCompanyNumber && el.voucherType == "Sales" && el.transactionType == "TDS" )
    const SaleTDSLedger = SaleTDSLedInfo.length > 0  ? SaleTDSLedInfo[0].tallyLedgerName : "TDS"


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
              VchData.PartyGSTNo = res.data.customerDetails.billingCustomerGSTNumber
              VchData.DestinationState = res.data.customerDetails.shippingStateName
              VchData.DestinationCountry = res.data.customerDetails.shippingCountry

      
              let LedgerEntriesData: LedgerEntry[] = []
              let InventoryEntriesData: InventoryEntry[] = []
              for (const itemsRow of res.data.itemDetails) {
                //itemsRow.isCharge  are actually LedgerEntires
                //Must come under ledger entries. Frono need to create mapping between those items with Ledgers
                InventoryEntriesData.push({StockName : itemsRow.itemName, UOM: !itemsRow.unitShortName ? "UNT" : itemsRow.unitShortName , Qty : itemsRow.qty, Rate: itemsRow.rate, LineAmount: itemsRow.taxableAmount, LedgerName: "Sales Account" })
              } 
              VchData.InventoryEntriesData = InventoryEntriesData



              if(res.data.invoiceDetails.totalDiscount != 0) {
                LedgerEntriesData.push({LedgerName : SaleDiscountLedger, CashLedger : "", DebitCredit : "CR" , LineAmount : res.data.invoiceDetails.totalDiscount })
              }

              if(res.data.invoiceDetails.tdsAmount != 0) {
                LedgerEntriesData.push({LedgerName : SaleTDSLedger, CashLedger : "", DebitCredit : "CR" , LineAmount : res.data.invoiceDetails.tdsAmount })
              }

              for (const taxRow of res.data.taxDetails) {
                if( taxRow.sgst != 0)  LedgerEntriesData.push({LedgerName : this.GetGSTLedgerName("Sales", "State Tax", taxRow.sgstPercent), CashLedger : "", DebitCredit : "DR" , LineAmount : taxRow.sgst })
                if( taxRow.cgst != 0)  LedgerEntriesData.push({LedgerName : this.GetGSTLedgerName("Sales", "Central Tax", taxRow.cgstPercent), CashLedger : "", DebitCredit : "DR" , LineAmount : taxRow.cgst })
                if( taxRow.igst != 0)  LedgerEntriesData.push({LedgerName : this.GetGSTLedgerName("Sales", "Integrated Tax", taxRow.igstPercent), CashLedger : "", DebitCredit : "DR" , LineAmount : taxRow.igst })                
              } 

              if(res.data.invoiceDetails.roundOff != 0) {
                LedgerEntriesData.push({LedgerName : SaleRoundOffLedger, CashLedger : "", DebitCredit : "CR" , LineAmount : res.data.invoiceDetails.roundOff })
              }
              
              VchData.LedgerEntriesData = LedgerEntriesData

              console.log(VchData)
              this.TallyAPI.SaleVoucher(VchData  ).subscribe({
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

      if (VchDataRow.isSelected && VchDataRow.VoucherType == "Receipt"  && (VchDataRow.Action == "Create" || VchDataRow.Action == "Modify" )  ) {         
        this.FronoAPI.getSingleReceiptData(VchDataRow.VoucherNumber).subscribe({
          next: (res:any) => {
            if(res.messageText == "") {
              let VchData:VoucherData  = new VoucherData()
              VchData.Action = "Create"
              VchData.VoucherTypeName = "Receipt"
  //              VchData.VoucherDate = this.FronoAPI.stringToDate(VchDataRow.VoucherDate)
              //Temp change date to 1st of Dec 2021  
              VchData.VoucherDate = this.FronoAPI.stringToDate("2021-12-01")

              VchData.VoucherNumber = VchDataRow.VoucherNumber
              VchData.VoucherRef = VchDataRow.VoucherRef
              VchData.VoucherRefDate = VchDataRow.VoucherRefDate
              VchData.Narration  = "Created from Frono API" 
      
              let LedgerEntriesData: LedgerEntry[] = []
  //            let InventoryEntriesData: InventoryEntry[] = []           
              for (const itemsRow of res.data) {
                //let ledInfo:any[] = this.TallyData.MastersStageData.filter( (el:any) => el.MasterType == "Ledgers" && el.Id == itemsRow.ledgerAccountId )                
                LedgerEntriesData.push({    
                  LedgerName :  VchDataRow.PartyLedger,
                  CashLedger  : "" ,
                  DebitCredit : "DR",
                  LineAmount  : itemsRow.collectionAmount ,
                  BillRef : itemsRow.invoiceNumber
                })
              } 
              VchData.LedgerEntriesData = LedgerEntriesData

              this.TallyAPI.ReceiptVoucher(VchData ).subscribe({
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

      if (VchDataRow.isSelected && VchDataRow.VoucherType == "Credit Note"  && (VchDataRow.Action == "Create" || VchDataRow.Action == "Modify" )  ) {         
        this.FronoAPI.getSingleCreditNoteData(VchDataRow.VoucherNumber).subscribe({
        next: (res:any) => {
           if(res.messageText == "") {
            let VchData:VoucherData  = new VoucherData()
            VchData.Action = "Create"
            VchData.VoucherTypeName = "Credit Note"
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
              InventoryEntriesData.push({StockName : itemsRow.itemName, UOM: itemsRow.unitShortName, Qty : itemsRow.qty, Rate: itemsRow.rate, LineAmount: itemsRow.amount, LedgerName: itemsRow.accountName })
            } 
            VchData.InventoryEntriesData = InventoryEntriesData
            this.TallyAPI.CreditNoteVoucher(VchData  ).subscribe({
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

      if (VchDataRow.isSelected && VchDataRow.VoucherType == "Debit Note"  && (VchDataRow.Action == "Create" || VchDataRow.Action == "Modify" )  ) {         
        this.FronoAPI.getSingleDebitNoteData(VchDataRow.VoucherNumber).subscribe({
        next: (res:any) => {
           if(res.messageText == "") {
            let VchData:VoucherData  = new VoucherData()
            VchData.Action = "Create"
            VchData.VoucherTypeName = "Debit Note"
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
              InventoryEntriesData.push({StockName : itemsRow.itemName, UOM: itemsRow.unitShortName, Qty : itemsRow.qty, Rate: itemsRow.rate, LineAmount: itemsRow.amount, LedgerName: itemsRow.accountName })
            } 
            VchData.InventoryEntriesData = InventoryEntriesData
            this.TallyAPI.DebitNoteVoucher(VchData  ).subscribe({
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
      

    }    
  }


  toggleSelect(){
    if(this.selectedMasterType == "All") {
      this.TallyData.MastersStageData.forEach(item => item.isSelected = !item.isSelected )
    } else {
      this.TallyData.MastersStageData.forEach(item => item.isSelected = !item.isSelected && item.MasterType == this.selectedMasterType)
    }
    
  }


  toggleSelectVchr(){
    if(this.selectedVoucherType == "All") {
      this.TallyData.TransactionsStageData.forEach(item => item.isSelected = !item.isSelected )
    } else {
      this.TallyData.TransactionsStageData.forEach(item => item.isSelected = !item.isSelected && item.VoucherType == this.selectedVoucherType)
    }


  }

  backToHome(){
    this.route.navigate(['tally-integration/home']);
  }





}
