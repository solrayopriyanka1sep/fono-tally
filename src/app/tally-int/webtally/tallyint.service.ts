import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
//import { catchError, retry } from 'rxjs/operators';
import { XMLParser}  from 'fast-xml-parser'
import { TallyMastersXML } from './tallymastersxml';
import { TallyVouchersXML } from './tallyvouchersxml';
import { LedgerInfo, StockGroupInfo, ItemInfo, VoucherTypeInfo, IVoucherData, COSTINGMETHOD, GSTAPPLICABLE, TAXABILITY, TALLYGROUP } from "./tallyInterfaces"

import { VoucherData, LedgerEntry } from '../webtally/tallyInterfaces';

export interface IResponseData {
    Error : boolean; 
    Message : string;
    data : any
}
  

@Injectable({
  providedIn: 'root'
})

export class TallyIntService {
  private tallyURL:string = 'http://localhost:9000';
  private CompanyName:string = ""
  private companyMatched:boolean = false
  isConnectedtoTally:boolean = false



  constructor(private http: HttpClient, private TXMLMast:TallyMastersXML, private TXMLVch:TallyVouchersXML) { 
    this.TXMLMast = new TallyMastersXML()
    this.TXMLVch = new TallyVouchersXML()
    //this.XMLP = new XMLParser()
  }
  

  init(URLforTally :string, CurrentCompanyName:string) {
    return new Observable<any>((observer) => {
      this.tallyURL = URLforTally
      this.CompanyName = CurrentCompanyName

      this.GetCurrentCompany.subscribe({
        next: (data:any) => {
          const companyOpenedinTally = data.data
          this.companyMatched = (this.CompanyName == companyOpenedinTally)
          let rtnVal:any = { Error : false, Message : "Successfully connected to Tally" , data : "" }  
          if(this.companyMatched) {
            this.isConnectedtoTally = true
            this.TXMLVch.init(this.CompanyName)
            rtnVal = { Error : false, Message : "Successfully connected to Tally" , data : "" }
          } else {
            this.isConnectedtoTally = false
            rtnVal = { Error : true, Message : "Company '" + this.CompanyName + "' not Opened in Tally!" , data : "" }
          }  
          observer.next(rtnVal)
        },
        error: error => {
          this.isConnectedtoTally = false
          const rtnVal = { Error : true, Message : "Could not Connect! Check if Company name is Valid and Tally is Opened !" , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    })
  }
  
  SingleTagAsArray(Val:any):any{
    let rtnVal = []
    if(!Array.isArray(Val)) {
      rtnVal.push(Val)
    } else {
      rtnVal = Val
    }
    return rtnVal
  }

//===================================================================================================    
// Tally Company Info
//=================================================================================================== 
  GetCurrentCompany = new Observable((observer) => {
    const StrTallyRequest = this.TXMLMast.GetCurrentCompanyXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        let jObj:any = XMLP.parse(res)
        //console.log(res)
        const rtnVal = { Error : false, Message : "" , data : jObj.ENVELOPE.AVSGETCOFLD }
        observer.next(rtnVal)
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });


//===================================================================================================    
// Tally Groups
//===================================================================================================    
  GetTallyGroups = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetGroupsXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.GROUP ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.GROUP)
          }
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          //const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.GROUP }
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });

  CreateModifyGroup(GrpName:string, TallyGroup:TALLYGROUP=TALLYGROUP.Non_Tally_Group ,  ModifiedName:string ="", GroupUnder:string = "" , GrpId:string ="", GrpAlias:string=""  ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }

      const StrTallyRequest = this.TXMLMast.GroupCreateModifyXML(GrpName, TallyGroup, ModifiedName, GroupUnder, GrpId, GrpAlias)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data Updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteGroup(GrpName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.GroupDeleteXML(GrpName)
      
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data Deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


//===================================================================================================    
// Tally Ledger
//===================================================================================================    
  GetTallyLedger = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetLedgersXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.LEDGER ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.LEDGER)
          }
          //const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.LEDGER)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
//          const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.LEDGER }
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });

  CreateModifyLedger(LedgerInfo:LedgerInfo, isModify:boolean=false, ModifiedName:string = "" ) {    
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyLedgerXML(LedgerInfo, isModify, ModifiedName)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data Updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteLedger(LedgerName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.LedgerDeleteXML(LedgerName)
      
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data Deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


//===================================================================================================    
// Tally Units of Measurement
//===================================================================================================    
  GetTallyUOM = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetUOMsXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.UNIT ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.UNIT)
          }

          //const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.UNIT)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          // const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.UNIT }
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });

  CreateModifyUOM(UOMid:string, UOMName:string, isModify:boolean=false, ModifiedId:string = "" ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyUOMXML(UOMid, UOMName, isModify, ModifiedId )
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data Updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteUOM(UOMId:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteUOMXML(UOMId)
      
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

//=========================================================================
// Locations / Godowns
//=========================================================================
  GetTallyLocations = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetLocationsXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.GODOWN ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.GODOWN)
          }
          //const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.GODOWN)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          //const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.GODOWN }
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });

  CreateModifyLocation(LocationName:string, isModify:boolean = false, ModifiedName:string="",  Parent:string = "", Alias:string ="", Add1:string ="", Add2:string ="", Add3: string ="", isExternal:boolean =false, isInternal:boolean = true) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyLocationXML(LocationName, isModify, ModifiedName, Parent, Alias, Add1, Add2, Add3, isExternal, isInternal)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteLocation(LocationName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteLocationXML(LocationName)
      
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


//=========================================================================
// Cost Centers
//=========================================================================
  GetTallyCostCenters = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetCostCentersXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          //console.log(jObj)
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.COSTCENTRE ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.COSTCENTRE)
          }
          
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          //const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.COSTCENTRE }
          //console.log(rtnVal);
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });
                        
  CreateModifyCostCenter(CostCenterName:string, isModify:boolean = false, ModifiedName:string="",  Parent:string = "", Alias:string ="", costCategory:string = "Primary Cost Category", isForPayroll:boolean = false, isForJobCosting:boolean = false) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyCostCenterXML(CostCenterName, isModify, ModifiedName,  Parent, Alias, costCategory, isForPayroll, isForJobCosting)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteCostCenter(CostCenterName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteCostCenterXML(CostCenterName)
      
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


//=========================================================================
// Cost Categories
//=========================================================================
  GetTallyCostCategory = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetCostCategoryXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.COSTCATEGORY ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.COSTCATEGORY)
          }
          //const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.COSTCATEGORY)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          //const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.COSTCATEGORY }
          //console.log(rtnVal);
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });
                        
  CreateModifyCategory(CostCategoryName:string, isModify:boolean = false, ModifiedName:string="", Alias:string ="", isRevenue:boolean = false, isNonRevenue:boolean = false) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyCostCategoryXML(CostCategoryName, isModify, ModifiedName, Alias, isRevenue, isNonRevenue)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteCategory(CostCategoryName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteCostCategoryXML(CostCategoryName)
      
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


//=========================================================================
// Stock Groups
//=========================================================================
  GetTallyStockGroups = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetStockGroupsXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKGROUP ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKGROUP)
          }

          // const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKGROUP)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });
                        
  CreateModifyStockGroup(StockGroup:StockGroupInfo, isModify:boolean = false, ModifiedName:string ="" ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyStockGroupXML(StockGroup, isModify, ModifiedName )
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteStockGroup(StockGroupName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteStockGroupXML(StockGroupName)    
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

//=========================================================================
// Stock Categories
//=========================================================================
  GetTallyStockCategories = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetStockCategoriesXML()

    /*
    const options:any = {
      arrayMode: (a:any) => a.match(/STOCKCATEGORY/) 
      //arrayMode: (tagName:any) => tagName === 'STOCKCATEGORY'
      //arrayMode: 'strict'
    };
    */

    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        //let jObj:any = XMLP.parse(res, options )
        let jObj:any = XMLP.parse(res )
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKCATEGORY ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKCATEGORY)
          }
          //const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKCATEGORY)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          //const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKCATEGORY  }
          //console.log(rtnVal);
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });
                        
  CreateModifyStockCategory(StockCategoryName:string, isModify:boolean = false, ModifiedName:string ="", Alias:string="", Parent:string="") {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyStockCategoriesXML(StockCategoryName, isModify, ModifiedName, Alias, Parent)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteStockCategory(StockCategoryName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteCostCategoryXML(StockCategoryName)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


//'=========================================================================
//' Stock Items
//'=========================================================================
  GetTallyStockItem = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetItemsXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM)
          }
          // const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          //const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM }
          //console.log(rtnVal);
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });
                        
  CreateModifyStockItem(StockItemInfo:ItemInfo, isModify:boolean = false, ModifiedName:string ="") {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyItemXML(StockItemInfo, isModify, ModifiedName)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteStockItem(StockItemName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteItemXML(StockItemName )
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

//'=========================================================================
//' Voucher Types 
//'=========================================================================
  GetTallyVoucherTypes = new Observable((observer) => {
    if(this.companyMatched == false ) {          
      const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
      observer.error(rtnVal)
    }
    const StrTallyRequest = this.TXMLMast.GetVchTypesXML()
    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
      next: res => {
        res = res.replace(/&#4; /g, "")
        let jObj:any = XMLP.parse(res)
        if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
          //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
          const rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
          observer.next(rtnVal)
        } else {
          let finalVal = []
          if(!jObj.ENVELOPE.BODY.DATA.COLLECTION.VOUCHERTYPE ) {
            finalVal = []
          } else {
            finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.VOUCHERTYPE)
          }

          //const finalVal = this.SingleTagAsArray(jObj.ENVELOPE.BODY.DATA.COLLECTION.VOUCHERTYPE)
          const rtnVal = { Error : false, Message : "Data retrived" , data : finalVal  }
          //const rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.VOUCHERTYPE }
          //console.log(rtnVal);
          observer.next(rtnVal)
        }
      },
      error: error => {
        const rtnVal = { Error : true, Message : error.message , data : "" }
        //console.error('There was an error!', error);
        observer.error(rtnVal)
      }      
    })  
  });
                        
  CreateModifyVoucherType(VoucherTypeInfo:VoucherTypeInfo, isModify:boolean = false, ModifiedName:string ="" ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.CreateModifyVoucherTypeXML(VoucherTypeInfo, isModify, ModifiedName )
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data updated" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DeleteVoucherType(VoucherTypeName:string ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLMast.DeleteVoucherTypeXML(VoucherTypeName)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            //console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)          
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            const rtnVal = { Error : false, Message : "Data deleted" , data : jObj.RESPONSE }
            //console.log(rtnVal);
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


//'=========================================================================
//' Create Update Vouchers
//'=========================================================================
  ReceiptVoucher(ReceiptData:VoucherData ) {    
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLVch.ReceiptVouchXML(ReceiptData)

      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          //console.log(res)
          if(jObj.RESPONSE.LINEERROR) {
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            let responseStr:string = ""
            if(jObj.RESPONSE.CREATED != 0 ) responseStr = "Created " + jObj.RESPONSE.CREATED + " Vouchers."
            if(jObj.RESPONSE.ALTERED != 0 ) responseStr = "Altered " + jObj.RESPONSE.ALTERED + " Vouchers."
            if(jObj.RESPONSE.DELETED != 0 ) responseStr = "Deleted " + jObj.RESPONSE.DELETED + " Vouchers."
            if(jObj.RESPONSE.IGNORED != 0 ) responseStr = "Ignored " + jObj.RESPONSE.IGNORED + " Vouchers."
            if(jObj.RESPONSE.CANCELLED != 0 ) responseStr = "Cancelled " + jObj.RESPONSE.CANCELLED + " Vouchers."
            if(jObj.RESPONSE.ERRORS != 0 ) responseStr = jObj.RESPONSE.ERRORS + " Vouchers in Error."

            const rtnVal = { Error : false, Message : "Data updated" , data : responseStr }
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  PaymentVoucher(PaymentData:VoucherData ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLVch.PaymentVouchXML(PaymentData)

      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            let responseStr:string = ""
            if(jObj.RESPONSE.CREATED != 0 ) responseStr = "Created " + jObj.RESPONSE.CREATED + " Vouchers."
            if(jObj.RESPONSE.ALTERED != 0 ) responseStr = "Altered " + jObj.RESPONSE.ALTERED + " Vouchers."
            if(jObj.RESPONSE.DELETED != 0 ) responseStr = "Deleted " + jObj.RESPONSE.DELETED + " Vouchers."
            if(jObj.RESPONSE.IGNORED != 0 ) responseStr = "Ignored " + jObj.RESPONSE.IGNORED + " Vouchers."
            if(jObj.RESPONSE.CANCELLED != 0 ) responseStr = "Cancelled " + jObj.RESPONSE.CANCELLED + " Vouchers."
            if(jObj.RESPONSE.ERRORS != 0 ) responseStr = jObj.RESPONSE.ERRORS + " Vouchers in Error."

            const rtnVal = { Error : false, Message : "Data updated" , data : responseStr }
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  JournalVoucher(JournalData:VoucherData ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLVch.JournalVouchXML(JournalData)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            let responseStr:string = ""
            if(jObj.RESPONSE.CREATED != 0 ) responseStr = "Created " + jObj.RESPONSE.CREATED + " Vouchers."
            if(jObj.RESPONSE.ALTERED != 0 ) responseStr = "Altered " + jObj.RESPONSE.ALTERED + " Vouchers."
            if(jObj.RESPONSE.DELETED != 0 ) responseStr = "Deleted " + jObj.RESPONSE.DELETED + " Vouchers."
            if(jObj.RESPONSE.IGNORED != 0 ) responseStr = "Ignored " + jObj.RESPONSE.IGNORED + " Vouchers."
            if(jObj.RESPONSE.CANCELLED != 0 ) responseStr = "Cancelled " + jObj.RESPONSE.CANCELLED + " Vouchers."
            if(jObj.RESPONSE.ERRORS != 0 ) responseStr = jObj.RESPONSE.ERRORS + " Vouchers in Error."

            const rtnVal = { Error : false, Message : "Data updated" , data : responseStr }
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  SaleVoucher(SaleData:VoucherData ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLVch.SaleVouchXML(SaleData)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            let responseStr:string = ""
            if(jObj.RESPONSE.CREATED != 0 ) responseStr = "Created " + jObj.RESPONSE.CREATED + " Vouchers."
            if(jObj.RESPONSE.ALTERED != 0 ) responseStr = "Altered " + jObj.RESPONSE.ALTERED + " Vouchers."
            if(jObj.RESPONSE.DELETED != 0 ) responseStr = "Deleted " + jObj.RESPONSE.DELETED + " Vouchers."
            if(jObj.RESPONSE.IGNORED != 0 ) responseStr = "Ignored " + jObj.RESPONSE.IGNORED + " Vouchers."
            if(jObj.RESPONSE.CANCELLED != 0 ) responseStr = "Cancelled " + jObj.RESPONSE.CANCELLED + " Vouchers."
            if(jObj.RESPONSE.ERRORS != 0 ) responseStr = jObj.RESPONSE.ERRORS + " Vouchers in Error."

            const rtnVal = { Error : false, Message : "Data updated" , data : responseStr }
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  PurchaseVoucher(PurchaseData:VoucherData ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLVch.PurchaseVouchXML(PurchaseData)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            let responseStr:string = ""
            if(jObj.RESPONSE.CREATED != 0 ) responseStr = "Created " + jObj.RESPONSE.CREATED + " Vouchers."
            if(jObj.RESPONSE.ALTERED != 0 ) responseStr = "Altered " + jObj.RESPONSE.ALTERED + " Vouchers."
            if(jObj.RESPONSE.DELETED != 0 ) responseStr = "Deleted " + jObj.RESPONSE.DELETED + " Vouchers."
            if(jObj.RESPONSE.IGNORED != 0 ) responseStr = "Ignored " + jObj.RESPONSE.IGNORED + " Vouchers."
            if(jObj.RESPONSE.CANCELLED != 0 ) responseStr = "Cancelled " + jObj.RESPONSE.CANCELLED + " Vouchers."
            if(jObj.RESPONSE.ERRORS != 0 ) responseStr = jObj.RESPONSE.ERRORS + " Vouchers in Error."

            const rtnVal = { Error : false, Message : "Data updated" , data : responseStr }
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  CreditNoteVoucher(SalesReturnData:VoucherData ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLVch.CreditNoteVouchXML(SalesReturnData)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            let responseStr:string = ""
            if(jObj.RESPONSE.CREATED != 0 ) responseStr = "Created " + jObj.RESPONSE.CREATED + " Vouchers."
            if(jObj.RESPONSE.ALTERED != 0 ) responseStr = "Altered " + jObj.RESPONSE.ALTERED + " Vouchers."
            if(jObj.RESPONSE.DELETED != 0 ) responseStr = "Deleted " + jObj.RESPONSE.DELETED + " Vouchers."
            if(jObj.RESPONSE.IGNORED != 0 ) responseStr = "Ignored " + jObj.RESPONSE.IGNORED + " Vouchers."
            if(jObj.RESPONSE.CANCELLED != 0 ) responseStr = "Cancelled " + jObj.RESPONSE.CANCELLED + " Vouchers."
            if(jObj.RESPONSE.ERRORS != 0 ) responseStr = jObj.RESPONSE.ERRORS + " Vouchers in Error."

            const rtnVal = { Error : false, Message : "Data updated" , data : responseStr }
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }

  DebitNoteVoucher(PurchaseReturnData:VoucherData ) {
    return new Observable<any>((observer) => {
      if(this.companyMatched == false ) {          
        const rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        observer.error(rtnVal)
      }
      const StrTallyRequest = this.TXMLVch.DebitNoteVouchXML(PurchaseReturnData)
      const XMLP = new XMLParser()

      this.http.post(this.tallyURL, StrTallyRequest, { responseType:'text' }).subscribe({
        next: res => {
          let jObj:any = XMLP.parse(res)
          if(jObj.RESPONSE.LINEERROR) {
            const rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
            observer.next(rtnVal)
          } else {
            let responseStr:string = ""
            if(jObj.RESPONSE.CREATED != 0 ) responseStr = "Created " + jObj.RESPONSE.CREATED + " Vouchers."
            if(jObj.RESPONSE.ALTERED != 0 ) responseStr = "Altered " + jObj.RESPONSE.ALTERED + " Vouchers."
            if(jObj.RESPONSE.DELETED != 0 ) responseStr = "Deleted " + jObj.RESPONSE.DELETED + " Vouchers."
            if(jObj.RESPONSE.IGNORED != 0 ) responseStr = "Ignored " + jObj.RESPONSE.IGNORED + " Vouchers."
            if(jObj.RESPONSE.CANCELLED != 0 ) responseStr = "Cancelled " + jObj.RESPONSE.CANCELLED + " Vouchers."
            if(jObj.RESPONSE.ERRORS != 0 ) responseStr = jObj.RESPONSE.ERRORS + " Vouchers in Error."

            const rtnVal = { Error : false, Message : "Data updated" , data : responseStr }
            observer.next(rtnVal)
          }
        },
        error: error => {
          const rtnVal = { Error : true, Message : error.message , data : "" }
          //console.error('There was an error!', error);
          observer.error(rtnVal)
        }      
      })  
    });
  }


}