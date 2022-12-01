
import axios, { AxiosStatic, AxiosRequestConfig, AxiosPromise } from 'axios'
import {XMLParser}  from 'fast-xml-parser'

import {TallyMastersXML} from './tallymastersxml'
import {TallyVouchersXML} from './tallyvouchersxml'

import { TALLYGROUP } from "./tallyInterfaces"


//import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
//const axios = new axios()

interface IResponseData {
  Error : boolean; 
  Message : string;
  data : any
}


export const TallyIntegration = class {
    //protected  axiosinstance: AxiosInstance;
    private tallyURL = 'http://localhost:9000'
    private companyMatched = false
    private CompanyName:string = ""
    // TXMLMast = new TallyMastersXML()
    private TXMLMast:TallyMastersXML
    //private ax:Axios
    private XMLP:XMLParser
    //private type: { new (): T, parse(data: any): any }

    //Constructor Class
    constructor() {
      //console.log("Started ...")
      this.TXMLMast = new TallyMastersXML()
      //this.ax = new Axios()
      this.XMLP = new XMLParser()
      //this.axiosinstance = axios.create();     
    }

    async init(URLforTally :string, CurrentCompanyName:string){
      this.tallyURL = URLforTally
      this.CompanyName = CurrentCompanyName

      const companyInfoData:IResponseData = await this.GetCurrentCompany()      
      const companyOpenedinTally = companyInfoData.data
      //console.log(companyOpenedinTally)
      this.companyMatched = (this.CompanyName == companyOpenedinTally)

      //console.log("Init done...")
      return 
    }


//===================================================================================================    
// Tally Company Info
//===================================================================================================          
    async GetCurrentCompany():Promise<IResponseData> {
        const StrTallyRequest = this.TXMLMast.GetCurrentCompanyXML()
        let rtnVal:IResponseData
        rtnVal = { Error : true, Message : "Something Went Wrong !" , data : "" }

        console.log(this.tallyURL)

        //rtnVal = await axios.post(this.tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})

        await axios.post(this.tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res => {
              let jObj:any = this.XMLP.parse(res.data);
              //console.log(jObj.ENVELOPE.AVSGETCOFLD);
              //return jObj.ENVELOPE.AVSGETCOFLD
              //return { Error : false, Message : "" , data : jObj.ENVELOPE.AVSGETCOFLD }
              rtnVal = { Error : false, Message : "" , data : jObj.ENVELOPE.AVSGETCOFLD }
              //Promise.resolve(rtnVal)
              return rtnVal 
           })
           .catch(err=>{
              console.log(err)
              console.log("Tally not opened or Something went wrong")
              //return { Error : true, Message : err.message , data : "" }
              rtnVal = { Error : true, Message : err.message , data : "" }
              //Promise.resolve(rtnVal)
              return rtnVal
           });
        return rtnVal
    }

    async GetTallySerial():Promise<IResponseData>{
        const StrTallyRequest = this.TXMLMast.GetTSerialXML()
        let rtnVal:IResponseData
        rtnVal = { Error : true, Message : "Something Went Wrong !" , data : "" }

        await axios.post(this.tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res=>{
              let jObj = this.XMLP.parse(res.data);
              //console.log(jObj.ENVELOPE.AVSGETSERIALFLD);
              //return jObj.ENVELOPE.AVSGETSERIALFLD
              rtnVal = { Error : false, Message : "" , data : jObj.ENVELOPE.AVSGETSERIALFLD }
           })
           .catch(err=>{
            console.log("Tally not opened or Something went wrong")
            //return { Error : true, Message : err.message }
            rtnVal = { Error : true, Message : err.message , data : "" }
           });
        return rtnVal
    }

//===================================================================================================    
// Tally Groups
//===================================================================================================    
    async GetTallyGroups():Promise<IResponseData>{
        let rtnVal:IResponseData
        rtnVal = { Error : true, Message : "Something Went Wrong !" , data : "" }

        if(this.companyMatched == false ) {          
          rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
          return rtnVal
        }

        const StrTallyRequest = this.TXMLMast.GetGroupsXML()

        await axios.post(this.tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res=>{
              let jObj = this.XMLP.parse(res.data);
              if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
                console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
                //return { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR }
                rtnVal = { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR, data : "" }
                return rtnVal 
              }              
              rtnVal = { Error : false, Message : "Data retrived" , data : jObj.ENVELOPE.BODY.DATA.COLLECTION.GROUP }
              console.log(rtnVal);
              return rtnVal
           })
           .catch(err=>{
            console.log("Tally not opened or Something went wrong")
            rtnVal = { Error : true, Message : err.message , data : "" }            
           });
        return rtnVal
    }


    async CreateGroup(GrpName:string, TallyGroup:TALLYGROUP = TALLYGROUP.Non_Tally_Group, GroupUnder:string = ""):Promise<IResponseData> {
      let rtnVal:IResponseData
      rtnVal = { Error : true, Message : "Something Went Wrong !" , data : "" }

      if(this.companyMatched == false ) {          
        rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        return rtnVal
      }

        const StrTallyRequest = this.TXMLMast.GroupCreateXML(GrpName, TallyGroup, GroupUnder )

        await axios.post(this.tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res=>{
              let jObj = this.XMLP.parse(res.data);
              if(jObj.RESPONSE.LINEERROR) {
                 //console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS })   
                 rtnVal ={ Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
                 return rtnVal
              }
              //console.log({ Error : false, data : jObj.RESPONSE });
              rtnVal = { Error : false, Message : "Data retrived" , data : jObj.RESPONSE }
              return rtnVal
           })
           .catch(err=>{
              console.log("Tally not opened or Something went wrong")
              rtnVal = { Error : true, Message : err.message , data : "" }
              return rtnVal
           });
        return rtnVal
    }

    async ModifyGroup(GrpOldName:string, GrpNewName:string = "", TallyGroup:TALLYGROUP = TALLYGROUP.Non_Tally_Group, GroupUnder:string = "") {
      let rtnVal:IResponseData
      rtnVal = { Error : true, Message : "Something Went Wrong !" , data : "" }

      if(this.companyMatched == false ) {          
        rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        return rtnVal
      }
      
      const StrTallyRequest = this.TXMLMast.GroupModifyXML(GrpOldName, GrpNewName, TallyGroup,  GroupUnder  )

      await axios.post(this.tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
          .then(res=>{
            let jObj = this.XMLP.parse(res.data);
            if(jObj.RESPONSE.LINEERROR) {
               //console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS })   
               rtnVal = { Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
               return rtnVal
            }
            //console.log({ Error : false, data : jObj.RESPONSE });
            rtnVal = { Error : false, Message : "Data retrived" , data : jObj.RESPONSE }
            return rtnVal
         })
         .catch(err=>{
          console.log("Tally not opened or Something went wrong")
          rtnVal = { Error : true, Message : err.message, data : "" }
          return rtnVal
         });
      return rtnVal
    }

    async DeleteGroup(GrpName:string) {
      let rtnVal:IResponseData
      rtnVal = { Error : true, Message : "Something Went Wrong !" , data : "" }

      if(this.companyMatched == false ) {          
        rtnVal = { Error : true, Message : "Company opened in Tally does not match with current Company", data : "" }
        return rtnVal
      }

      const StrTallyRequest = this.TXMLMast.GroupDeleteXML(GrpName)

      await axios.post(this.tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
          .then(res=>{
            let jObj = this.XMLP.parse(res.data);
            if(jObj.RESPONSE.LINEERROR) {
               //console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS })   
               rtnVal = { Error : true, Message : jObj.RESPONSE.LINEERROR , data : jObj.RESPONSE.ERRORS }
              return rtnVal
            }
            //console.log({ Error : false, data : jObj.RESPONSE });
            rtnVal = { Error : false, Message : "Data retrived" , data : jObj.RESPONSE }
            return rtnVal
         })
         .catch(err=>{
          console.log("Tally not opened or Something went wrong")
          rtnVal = { Error : true, Message : err.message , data : "" }
          return rtnVal
         });
      return rtnVal         
    }


//===================================================================================================    
// Tally Ledgers
//===================================================================================================    
  
/*
    async GetTallyLedgers(){
        if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
        const StrTallyRequest = this.TXMLMast.GetLedgersXML()

        await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res=>{             
              let jObj = XMLParser.parse(res.data);
              //console.log(jObj)
              if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
                console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
                return { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR }
              }
              console.log(jObj.ENVELOPE.BODY.DATA.COLLECTION.LEDGER);
              return { Error : false, data : jObj.ENVELOPE.BODY.DATA.COLLECTION.LEDGER }
           })
           .catch(err=>{
            console.log("Tally not opened or Something went wrong")
            return { Error : true, Message : err.message }
           });
    }

    async CreateLedger(LederInfo) {
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
      const StrTallyRequest = this.TXMLMast.CreateModifyLedgerXML(LederInfo, false )

      await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
          .then(res=>{
            let jObj = XMLParser.parse(res.data);
            if(jObj.RESPONSE.LINEERROR) {
               console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS })   
              return { Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS }
            }
            //console.log({ Error : false, data : jObj.RESPONSE });
            return { Error : false, data : jObj.RESPONSE }
         })
         .catch(err=>{
          console.log("Tally not opened or Something went wrong")
          return { Error : true, Message : err.message }
         });
    }

    async ModifyLedger(LederInfo) {
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
      const StrTallyRequest = this.TXMLMast.CreateModifyLedgerXML(LederInfo, true )

      await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
        .then(res=>{
          let jObj = XMLParser.parse(res.data);
          if(jObj.RESPONSE.LINEERROR) {
             console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS })   
            return { Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS }
          }
          //console.log({ Error : false, data : jObj.RESPONSE });
          return { Error : false, data : jObj.RESPONSE }
       })
       .catch(err=>{
        console.log("Tally not opened or Something went wrong")
        return { Error : true, Message : err.message }
       });
    }

    async DeleteLedger(LedgerName) {
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
      const StrTallyRequest = this.TXMLMast.LedgerDeleteXML(LedgerName)

      await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
          .then(res=>{
            let jObj = XMLParser.parse(res.data);
            if(jObj.RESPONSE.LINEERROR) {
               console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS })   
              return { Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS }
            }
            //console.log({ Error : false, data : jObj.RESPONSE });
            return { Error : false, data : jObj.RESPONSE }
         })
         .catch(err=>{
          console.log("Tally not opened or Something went wrong")
          return { Error : true, Message : err.message }
         });      
    }
*/

//===================================================================================================    
// Tally Units of Measurement
//===================================================================================================    
/*
async GetTallyUOM(){
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
        const StrTallyRequest = this.TXMLMast.GetUOMsXML()

        await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res=>{             
              let jObj = XMLParser.parse(res.data);
              //if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
              //  console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
              //  return { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR }
              //}

              if(jObj.LISTOFUOMS == ""){
                return { Error : false, data : [] }
              }              
              console.log(jObj.LISTOFUOMS.ITEMDATA);
              return { Error : false, data : jObj.LISTOFUOMS.ITEMDATA }
           })
           .catch(err=>{
            console.log("Tally not opened or Something went wrong")
            return { Error : true, Message : err.message }
           });
    }

    async CreateUOM(UOMid, UOMName) {
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
      const StrTallyRequest = this.TXMLMast.CreateUOMXML(UOMid, UOMName )

      await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
          .then(res=>{
            let jObj = XMLParser.parse(res.data);
            if(jObj.RESPONSE.LINEERROR) {
               console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS })   
              return { Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS }
            }
            //console.log({ Error : false, data : jObj.RESPONSE });
            return { Error : false, data : jObj.RESPONSE }
         })
         .catch(err=>{
          console.log("Tally not opened or Something went wrong")
          return { Error : true, Message : err.message }
         });
    }

    async ModifyUOM(UOMidOld, UOMName ) {
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
      const StrTallyRequest = this.TXMLMast.ModifyUOMXML(UOMidOld, UOMName )

      await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
          .then(res=>{
            let jObj = XMLParser.parse(res.data);
            if(jObj.RESPONSE.LINEERROR) {
               console.log({ Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS })   
              return { Error : true, Message : jObj.RESPONSE.LINEERROR , NoOfErrors : jObj.RESPONSE.ERRORS }
            }
            //console.log({ Error : false, data : jObj.RESPONSE });
            return { Error : false, data : jObj.RESPONSE }
         })
         .catch(err=>{
          console.log("Tally not opened or Something went wrong")
          return { Error : true, Message : err.message }
         });
    }

 */   
//===================================================================================================    
// Tally Stock Groups
//===================================================================================================    
/*

    async GetTallyStockGroups(){
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
        const StrTallyRequest = this.TXMLMast.GetStockGroupsXML()

        await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res=>{             
              let jObj = XMLParser.parse(res.data);
              //console.log(jObj)
              if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
                console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
                return { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR }
              }
              if(jObj.ENVELOPE.BODY.DATA.COLLECTION == "") return { Error : false, data : [] }
              console.log(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKGROUP);
              return { Error : false, data : jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKGROUP }
           })
           .catch(err=>{
            console.log("Tally not opened or Something went wrong")
            return { Error : true, Message : err.message }
           });
    }

*/
//===================================================================================================    
// Tally Stock Category
//===================================================================================================    



//===================================================================================================    
// Tally Stock Items
//===================================================================================================    

/*
    async GetTallyStockItems(){
      if(this.companyMatched == false ) return { Error : true, Message : "Company opened in Tally does not match with current Company" }
      const StrTallyRequest = this.TXMLMast.GetItemsXML()

      await axios.post(tallyURL, StrTallyRequest, {headers: {'Content-Type': 'text/xml'}})
            .then(res=>{             
              let jObj = XMLParser.parse(res.data);
              //console.log(jObj)
              if(jObj.ENVELOPE.BODY.DATA.LINEERROR) {
                console.log(jObj.ENVELOPE.BODY.DATA.LINEERROR)
                return { Error : true, Message : jObj.ENVELOPE.BODY.DATA.LINEERROR }
              }
              if(jObj.ENVELOPE.BODY.DATA.COLLECTION == "") return { Error : false, data : [] }
              console.log(jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM);

              return { Error : false, data : jObj.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM }
      })
      .catch(err=>{
        console.log("Tally not opened or Something went wrong")
        return { Error : true, Message : err.message }
      });
    }
*/

} 

