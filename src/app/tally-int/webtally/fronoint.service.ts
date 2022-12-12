import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { configData } from '../model/configData';

  

@Injectable({
  providedIn: 'root'
})

export class FronoIntService {
  private fronoURL:string = 'https://localhost:5001/api';

  private fronoURL1:string = 'http://103.212.143.188:5000/api';
  private fronoTranURL1:string = 'http://103.212.143.188:5001/api';

  private FronoCompany: number = 0

  constructor(private http: HttpClient ) { 
    //this.FronoCompany = FronoCompanyId
    //this.XMLP = new XMLParser()
  }
  
  init(FronoCompanyId:number):void{
    this.FronoCompany = FronoCompanyId
  }

  stringToDate(strYYYYMMDD:string):Date {
    strYYYYMMDD.replace(/-/g,"")
    const mYear:string = strYYYYMMDD.substring(0, 4)
    const mMonth:string = strYYYYMMDD.substring(5, 7)
    const mDay:string = strYYYYMMDD.substring(8, 10)
    let rtnDt:Date = new Date(Number(mYear), Number(mMonth)-1, Number(mDay) )
    return rtnDt
  }

  stringToDate1(strYYYYMMDD:string):Date {
    const parts = strYYYYMMDD.split('-');
    const rtnDt:Date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); 
    return rtnDt
  }




  private pad2(n:number):string { 
    return n < 10 ? '0' + n.toString() : n.toString() 
  }


  DateToStr(mDate:Date):string {
    return mDate.getFullYear().toString() + "-" +
          this.pad2(mDate.getMonth() + 1) + "-" +
          this.pad2(mDate.getDate())     
  }

  DateToStrMMDDYYYY(mDate:Date):string {
    return this.pad2(mDate.getMonth() + 1) + "-" +
            this.pad2(mDate.getDate()) + "-" +    
            mDate.getFullYear().toString()           
  }

  strDateToStrMMDDYYYY(strYYYYMMDD:string):string {
    const parts = strYYYYMMDD.split('-');
    const rtnDt =  parts[1] + "-" + parts[2] + "-" + parts[0]    
    return rtnDt
  }


  getConfig(): Observable<any> {
    return this.http.get<any>(this.fronoURL + '/configData/' + this.FronoCompany )
  }

  AddUpdateConfig(configData:configData): Observable<any> {
    return this.http.post<any>(this.fronoURL + '/configData/' + this.FronoCompany , configData)
  }




  getGroups(): Observable<any> {
    //return this.http.get<any>(this.fronoURL1 + '/AccountGroups/GetAllAccountGroups/' + this.FronoCompany )

    //http://103.212.143.188:5000/api/AccountGroups/GetAllAccountGroupsList/43
    return this.http.get<any>(this.fronoURL1 + '/AccountGroups/GetAllAccountGroupsList/' + this.FronoCompany )

  }

  AddUpdateGroup(reqData:any): Observable<any> {
    const postData = {
      "companyProfileId": this.FronoCompany,
      "displayOrder": 0,
      "isActive": true,
      "isDelete": false,
      "isDefault": true,
      "createdBy": 25,
      "modifiedBy": 0,
      "accountGroupsId": 0,
      "underAccountGroupsId": 4,
      "drCr": "",
      "isDisabled": false,
      "groupName": reqData.MasterName
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoURL1 + '/AccountGroups/AddUpdate' , postData, {'headers':headers})
  }

  DeleteGroup(reqData:any): Observable<any> {
    const postData = {
      "accountGroupsId": 503,
      "modifiedBy": 25
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoURL1 + '/AccountGroups/Delete'  , postData, {'headers':headers})
  }


  getAccounts(): Observable<any> {
    //http://103.212.143.188:5000/api/GLAccount/GetAllGLAccountByCompanyId/43/25/0
    
    return this.http.get<any>(this.fronoURL1 + '/GLAccount/GetAllGLAccountByCompanyId/' + this.FronoCompany + '/25/0' )
  }

  getCustomersVendors(): Observable<any> {
    //http://103.212.143.188:5000/api/CustomerMaster/GetAllCustomerMaster/43
    return this.http.get<any>(this.fronoURL1 + '/CustomerMaster/GetAllCustomerMaster/' + this.FronoCompany  )
  }

  getUOM(): Observable<any> {
    //http://103.212.143.188:5000/api/UnitMaster/GetAll/43
    //return this.http.get<any>(this.fronoURL1 + '/UnitMaster/GetAll/' + this.FronoCompany  )
    return this.http.get<any>(this.fronoURL + '/UnitsMaster'  )
    
  }

  getGodowns(): Observable<any> {
    //http://103.212.143.188:5000/api/WarehouseMaster/GetAll/43
    return this.http.get<any>(this.fronoURL1 + '/WarehouseMaster/GetAll/' + this.FronoCompany  )
  }

  getStockGroups(): Observable<any> {
    //http://103.212.143.188:5000/api/DepartmentMaster/GetAll/43
    //return this.http.get<any>(this.fronoURL1 + '/DepartmentMaster/GetAll/' + this.FronoCompany  )
    return this.http.get<any>(this.fronoURL + '/masterData/GetStockGroups/' + this.FronoCompany  )
  }

  getStockCategories(): Observable<any> {
    //http://103.212.143.188:5000/api/CategoryMaster/GetAll/43
    //and
    //http://103.212.143.188:5000/api/SubCategory/GetAll/43
    //return this.http.get<any>(this.fronoURL1 + '/CategoryMaster/GetAll/' + this.FronoCompany  )

    return this.http.get<any>(this.fronoURL + '/masterData/GetStockCategories/' + this.FronoCompany  )
  }

  
  getStockItems(): Observable<any> {
    //http://103.212.143.188:5000/api/ItemMaster/GetAllItemResponses/43/0
    //return this.http.get<any>(this.fronoURL1 + '/ItemMaster/GetAllItemResponses/' + this.FronoCompany  + "/0" )

    return this.http.get<any>(this.fronoURL + '/masterData/GetStockItems/' + this.FronoCompany  )
  }





  getSalesVouchersList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/SalesInvoice/GetAllInvoice/43/12-01-2022/01-31-2023/false
  
    return this.http.get<any>(this.fronoTranURL1 + '/SalesInvoice/GetAllInvoice/' + this.FronoCompany  + "/" + fromDtStr + "/" + ToDtStr + "/false" )
  }

  getSingleSalesVoucherData(VoucherNumber:number): Observable<any> {
    const postData = {
      "branchId": 0,
      "companyProfileId": this.FronoCompany,
      "isPerformaInvoice": false,
      "salesInvoiceId": VoucherNumber
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoTranURL1 + '/SalesInvoice/GetInvoiceTemplate' , postData, {'headers':headers})
  }

  getSalesOrdersList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/SalesOrder/GetAllOrder/43/12-01-2022/01-31-2023/true
    return this.http.get<any>(this.fronoTranURL1 + '/SalesOrder/GetAllOrder/' + this.FronoCompany  + "/" + fromDtStr + "/" + ToDtStr + "/true" )
  }

  getSingleSalesOrderData(OrderNumber:number): Observable<any> {
    //http://103.212.143.188:5001/api/SalesOrder/GetOrderTemplate
    const postData = {
      "branchId": 0,
      "companyProfileId": this.FronoCompany,
      "salesOrderId": OrderNumber
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoTranURL1 + '/SalesOrder/GetOrderTemplate' , postData, {'headers':headers})
  }
  

  getJrnlVouchersList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/Accounts/GetAllAccounts/43/0/1
    return this.http.get<any>(this.fronoTranURL1 + '/Accounts/GetAllAccounts/' + this.FronoCompany  + "/0/1"  )
  }

  getSingleJournalData(VoucherNumber:number): Observable<any> {
    //http://103.212.143.188:5001/api/Accounts/GetAccountsById/722
    return this.http.get<any>(this.fronoTranURL1 + '/Accounts/GetAccountsById/' + VoucherNumber ) 
  }

  

  /*
  getPDCCollectionList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/Collections/GetAllDepositCheque/43/0
    fromDtStr = "12-01-2022"
    ToDtStr = "01-31-2023"
    return this.http.get<any>(this.fronoTranURL1 + '/Collections/GetAllDepositCheque/' + this.FronoCompany  + "/0"  )
  }
  */

  getBankCollectionList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/Collections/GetAll/43/12-01-2022/12-31-2022
    return this.http.get<any>(this.fronoTranURL1 + '/Collections/GetAll/' + this.FronoCompany  + "/" + fromDtStr + "/" + ToDtStr  )
  }
 
  getSingleReceiptData(VoucherNumber:number): Observable<any> {
    //http://103.212.143.188:5001/api/Collections/GetInvoiceAdjustedDetails/224
    const headers = { 'content-type': 'application/json'} 

    return this.http.get<any>(this.fronoTranURL1 + '/Collections/GetInvoiceAdjustedDetails/' + VoucherNumber )
  }



  getPurchaseVouchersList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/PurchaseInvoice/GetAllInvoice/43
    return this.http.get<any>(this.fronoTranURL1 + '/PurchaseInvoice/GetAllInvoice/' + this.FronoCompany  ) //+ "/" + fromDtStr + "/" + ToDtStr + "/false" )
  }

  getSinglePurchaseVoucherData(VoucherNumber:number): Observable<any> {
    //http://103.212.143.188:5001/api/PurchaseInvoice/GetItemDetails/97

    return this.http.get<any>(this.fronoTranURL1 + '/PurchaseInvoice/GetItemDetails/' + VoucherNumber)
  }
 

  getCreditNotesList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/Notes/GetAllCreditNote/43/11-01-2022/12-31-2022/true
    return this.http.get<any>(this.fronoTranURL1 + '/Notes/GetAllCreditNote/' + this.FronoCompany  + "/" + fromDtStr + "/" + ToDtStr + "/true" )
  }

  getSingleCreditNoteData(VoucherNumber:number): Observable<any> {
    //http://103.212.143.188:5001/api/Notes/GetCreditNoteTemplate
    const postData = {
      "branchId": 0,
      "companyProfileId": this.FronoCompany,
      "creditNoteId": VoucherNumber
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoTranURL1 + '/Notes/GetCreditNoteTemplate' , postData, {'headers':headers})
  }
 

  getDebitNotesList(fromDtStr:string = "", ToDtStr:string = ""): Observable<any> {
    //http://103.212.143.188:5001/api/Notes/GetAllDebitNote/43/10-01-2022/11-30-2022
    return this.http.get<any>(this.fronoTranURL1 + '/Notes/GetAllDebitNote/' + this.FronoCompany  + "/" + fromDtStr + "/" + ToDtStr  )
  }

  getSingleDebitNoteData(VoucherNumber:number): Observable<any> {
    //http://103.212.143.188:5001/api/Notes/GetDebitNoteTemplate
    const postData = {
      "branchId": 0,
      "companyProfileId": this.FronoCompany,
      "debitNoteId": VoucherNumber
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoTranURL1 + '/Notes/GetDebitNoteTemplate' , postData, {'headers':headers})
  }




  
  
  
  

  
}