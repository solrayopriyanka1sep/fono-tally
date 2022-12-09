//import {IVoucherData , ILedgerEntries, ILedgerEntry, IInventoryEntries, IInventoryEntry } from "./tallyInterfaces"
import { VoucherData, LedgerEntry, InventoryEntry } from '../webtally/tallyInterfaces';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class TallyVouchersXML {
  private companyName:string = ""
  private hdrXML:string  = ""

  private bottomXML:string = `         </TALLYMESSAGE>
                    </REQUESTDATA>
                  </IMPORTDATA>
                </BODY>
              </ENVELOPE>`


  constructor() {
  }
  
  init(TallyCompanyName:string){
    this.companyName = TallyCompanyName

    this.hdrXML = `<ENVELOPE>
                <HEADER>
                  <TALLYREQUEST>Import Data</TALLYREQUEST>
                </HEADER>
                <BODY>
                <IMPORTDATA>
                <REQUESTDESC>
                <REPORTNAME>All Masters</REPORTNAME>
                <STATICVARIABLES>`

    if( this.companyName == "" ) {
      this.hdrXML = this.hdrXML + "<SVCURRENTCOMPANY></SVCURRENTCOMPANY>"
    } else {
      this.hdrXML = this.hdrXML + "<SVCURRENTCOMPANY>" + this.STR2XML(this.companyName) + "</SVCURRENTCOMPANY>"
    }

    this.hdrXML = this.hdrXML + `</STATICVARIABLES>
                      </REQUESTDESC>
                      <REQUESTDATA>
                      <TALLYMESSAGE xmlns:UDF="TallyUDF">`


  }



  STR2XML(strName:string):string {
    let sRtnVal:string = ""
    if(strName != "") {
      sRtnVal = strName.replace(/&/g, "&amp;")
      sRtnVal = sRtnVal.replace(/'/g, "&apos;") 
      sRtnVal = sRtnVal.replace(/"/g, "&quot;")
      sRtnVal = sRtnVal.trim()
    }
    return sRtnVal
  }

  private pad2(n:number):string { 
    return n < 10 ? '0' + n.toString() : n.toString() 
  }


  private TallyDateFormat(mDate:Date):string {
    return mDate.getFullYear().toString() + 
          this.pad2(mDate.getMonth() + 1) + 
          this.pad2(mDate.getDate())     
  }

//  ReceiptVouchXML(ReceiptData:IVoucherData):string {
  ReceiptVouchXML(ReceiptData:VoucherData):string {  
    let VoucherTotal:number = 0
    ReceiptData.HeaderLedger = this.STR2XML(ReceiptData.HeaderLedger)
    ReceiptData.VoucherTypeName = this.STR2XML(ReceiptData.VoucherTypeName)
//    ReceiptData.VoucherNumber = this.STR2XML(ReceiptData.VoucherNumber)
    ReceiptData.VoucherRef = !ReceiptData.VoucherRef ? "" : this.STR2XML(ReceiptData.VoucherRef)
    ReceiptData.Narration = !ReceiptData.Narration ? "" : this.STR2XML(ReceiptData.Narration)

    const VchrDate:string = this.TallyDateFormat(ReceiptData.VoucherDate)
    const sGUID = "AVSolutions-" + ReceiptData.VoucherTypeName + "-" + VchrDate + "-" + ReceiptData.VoucherNumber

    let rtnSTR :string = ""

    if(ReceiptData.Action == "DELETE") {
      rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + ReceiptData.VoucherTypeName + `" ACTION="` + ReceiptData.Action + `">`
      rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
      rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
      rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + ReceiptData.VoucherTypeName + "</VOUCHERTYPENAME>"
      rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + ReceiptData.VoucherNumber + "</VOUCHERNUMBER>"
      rtnSTR = rtnSTR + "</VOUCHER>"
      return rtnSTR 
    }

    rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + ReceiptData.VoucherTypeName +  `" ACTION="` + ReceiptData.Action + `" OBJVIEW="` + ReceiptData.VoucherInvoiceView + `">`
    rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
    rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
    rtnSTR = rtnSTR + "<NARRATION>" + ReceiptData.Narration + "</NARRATION>"
    rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + ReceiptData.VoucherTypeName + "</VOUCHERTYPENAME>"
    rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + ReceiptData.VoucherNumber + "</VOUCHERNUMBER>"

    if(ReceiptData.VoucherRef != "" ) {
      rtnSTR = rtnSTR + "<REFERENCE>" + ReceiptData.VoucherRef + "</REFERENCE>"
    }
    rtnSTR = rtnSTR + "<PARTYLEDGERNAME>" + ReceiptData.HeaderLedger + "</PARTYLEDGERNAME>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>" + ReceiptData.VoucherInvoiceView + "</PERSISTEDVIEW>"
//'            rtnSTR = rtnSTR + "<AUDITED>No</AUDITED>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>"
/*    
'      <VCHGSTCLASS/>
'      <DIFFACTUALQTY>No</DIFFACTUALQTY>
'      <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
'      <ASORIGINAL>No</ASORIGINAL>
'      <AUDITED>No</AUDITED>
'      <FORJOBCOSTING>No</FORJOBCOSTING>
'      <ISOPTIONAL>No</ISOPTIONAL>
*/
      rtnSTR = rtnSTR + "<EFFECTIVEDATE>" + VchrDate + "</EFFECTIVEDATE>"
/*      
'      <USEFOREXCISE>No</USEFOREXCISE>
'      <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
'      <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
'      <USEFORINTEREST>No</USEFORINTEREST>
'      <USEFORGAINLOSS>No</USEFORGAINLOSS>
'      <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
'      <USEFORCOMPOUND>No</USEFORCOMPOUND>
'      <USEFORSERVICETAX>No</USEFORSERVICETAX>
'      <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
'      <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
'      <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
'      <EXCISEOPENING>No</EXCISEOPENING>
'      <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
'      <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
'      <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
'      <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
'      <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
'      <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
'      <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
'      <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
'      <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
'      <ISISDVOUCHER>No</ISISDVOUCHER>
'      <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
'      <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
'      <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
'      <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
'      <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
'      <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
*/
      rtnSTR = rtnSTR + "<ISCANCELLED>No</ISCANCELLED>"
      rtnSTR = rtnSTR + "<HASCASHFLOW>Yes</HASCASHFLOW>"
/*      
'      <ISPOSTDATED>No</ISPOSTDATED>
'      <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
'      <ISINVOICE>No</ISINVOICE>
'      <MFGJOURNAL>No</MFGJOURNAL>
'      <HASDISCOUNTS>No</HASDISCOUNTS>
'      <ASPAYSLIP>No</ASPAYSLIP>
'      <ISCOSTCENTRE>No</ISCOSTCENTRE>
'      <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
'      <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
'      <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
'      <ISVOID>No</ISVOID>
'      <ISONHOLD>No</ISONHOLD>
'      <ORDERLINESTATUS>No</ORDERLINESTATUS>
'      <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
'      <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
'      <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
'      <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
'      <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
'      <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
'      <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
'      <ISDELETED>No</ISDELETED>
'      <CHANGEVCHMODE>No</CHANGEVCHMODE>
'        rtnSTR = rtnSTR + "      <ALTERID> 413</ALTERID>"
*/
      rtnSTR = rtnSTR + "      <MASTERID> 337</MASTERID>"
      rtnSTR = rtnSTR + "      <VOUCHERKEY>" + sGUID + "</VOUCHERKEY>"
    
//    'Get the Total of the Bill
//    '==============================
      ReceiptData.LedgerEntriesData.forEach(LedgerEntry=> {
        VoucherTotal += LedgerEntry.LineAmount
      });

      rtnSTR = rtnSTR + "      <ALLLEDGERENTRIES.LIST>"
      rtnSTR = rtnSTR + "       <LEDGERNAME>" + ReceiptData.HeaderLedger + "</LEDGERNAME>"
      rtnSTR = rtnSTR + "       <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "       <LEDGERFROMITEM>No</LEDGERFROMITEM>"
      rtnSTR = rtnSTR + "       <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
      rtnSTR = rtnSTR + "       <ISPARTYLEDGER>No</ISPARTYLEDGER>"
      rtnSTR = rtnSTR + "       <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "       <AMOUNT>-" + VoucherTotal + "</AMOUNT>"
/*        
        if(LedgerEntry.CashLedger) {
          '       <BANKALLOCATIONS.LIST>
          '        <DATE>20170801</DATE>
          '        <INSTRUMENTDATE>20170801</INSTRUMENTDATE>
          '        <NAME>da029d9b-2ad0-41ff-bd6e-4b44d60268be</NAME>
          '        <TRANSACTIONTYPE>Cheque/DD</TRANSACTIONTYPE>
          '        <BANKNAME>Bank of Maharashtra</BANKNAME>
          '        <PAYMENTFAVOURING>AP Traders (Coimbatore)</PAYMENTFAVOURING>
          '        <UNIQUEREFERENCENUMBER>3W3HTuHhCK8jXnzW</UNIQUEREFERENCENUMBER>
          '        <STATUS>No</STATUS>
          '        <PAYMENTMODE>Transacted</PAYMENTMODE>
          '        <BANKPARTYNAME>AP Traders (Coimbatore)</BANKPARTYNAME>
          '        <ISCONNECTEDPAYMENT>No</ISCONNECTEDPAYMENT>
          '        <ISSPLIT>No</ISSPLIT>
          '        <ISCONTRACTUSED>No</ISCONTRACTUSED>
          '        <ISACCEPTEDWITHWARNING>No</ISACCEPTEDWITHWARNING>
          '        <ISTRANSFORCED>No</ISTRANSFORCED>
          '        <CHEQUEPRINTED> 1</CHEQUEPRINTED>
          '        <AMOUNT>-5000.00</AMOUNT>
          '        <CONTRACTDETAILS.LIST>        </CONTRACTDETAILS.LIST>
          '        <BANKSTATUSINFO.LIST>        </BANKSTATUSINFO.LIST>
          '       </BANKALLOCATIONS.LIST>
        }  
*/
      rtnSTR = rtnSTR + "      </ALLLEDGERENTRIES.LIST>"


      ReceiptData.LedgerEntriesData.forEach(LedgerEntry => {
        rtnSTR = rtnSTR + "      <ALLLEDGERENTRIES.LIST>"
        rtnSTR = rtnSTR + "       <LEDGERNAME>" + this.STR2XML(LedgerEntry.LedgerName) + "</LEDGERNAME>"
        rtnSTR = rtnSTR + "       <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "       <LEDGERFROMITEM>No</LEDGERFROMITEM>"
        rtnSTR = rtnSTR + "       <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
        rtnSTR = rtnSTR + "       <ISPARTYLEDGER>Yes</ISPARTYLEDGER>"
        rtnSTR = rtnSTR + "       <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "       <AMOUNT>" + LedgerEntry.LineAmount + "</AMOUNT>"
        if(LedgerEntry.BillRef) {
          rtnSTR = rtnSTR + "       <BILLALLOCATIONS.LIST>"
          rtnSTR = rtnSTR + "        <NAME>" + this.STR2XML(LedgerEntry.BillRef) + "</NAME>"
          rtnSTR = rtnSTR + "        <BILLTYPE>Agst Ref</BILLTYPE>"
          rtnSTR = rtnSTR + "        <TDSDEDUCTEEISSPECIALRATE>No</TDSDEDUCTEEISSPECIALRATE>"
          rtnSTR = rtnSTR + "        <AMOUNT>" + LedgerEntry.LineAmount + "</AMOUNT>"
          rtnSTR = rtnSTR + "       </BILLALLOCATIONS.LIST>"
        }
        rtnSTR = rtnSTR + "      </ALLLEDGERENTRIES.LIST>"
      });
        
      rtnSTR = rtnSTR + "</VOUCHER>"

      rtnSTR = this.hdrXML + rtnSTR + this.bottomXML
      return rtnSTR
  }

  PaymentVouchXML(PaymentData:VoucherData):string {
    let VoucherTotal:number = 0
    PaymentData.HeaderLedger = this.STR2XML(PaymentData.HeaderLedger)
    PaymentData.VoucherTypeName = this.STR2XML(PaymentData.VoucherTypeName)
//    PaymentData.VoucherNumber = this.STR2XML(PaymentData.VoucherNumber)
    PaymentData.VoucherRef = !PaymentData.VoucherRef ? "" : this.STR2XML(PaymentData.VoucherRef)
    PaymentData.Narration = !PaymentData.Narration ? "" : this.STR2XML(PaymentData.Narration)

    const VchrDate:string = this.TallyDateFormat(PaymentData.VoucherDate)
    const sGUID = "AVSolutions-" + PaymentData.VoucherTypeName + "-" + VchrDate + "-" + PaymentData.VoucherNumber

    let rtnSTR :string = ""

    if(PaymentData.Action == "DELETE" ) {
        rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + PaymentData.VoucherTypeName + `" ACTION="` + PaymentData.Action + `">`
        rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
        rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
        rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + PaymentData.VoucherTypeName + "</VOUCHERTYPENAME>"
        rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + PaymentData.VoucherNumber + "</VOUCHERNUMBER>"
        rtnSTR = rtnSTR + "</VOUCHER>"
        return rtnSTR 
    }

    rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + PaymentData.VoucherTypeName + `" ACTION="` + PaymentData.Action + `" OBJVIEW="` + PaymentData.VoucherInvoiceView + `">`
    rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
    rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
    rtnSTR = rtnSTR + "<NARRATION>" + PaymentData.Narration + "</NARRATION>"
    rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + PaymentData.VoucherTypeName + "</VOUCHERTYPENAME>"
    rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + PaymentData.VoucherNumber + "</VOUCHERNUMBER>"

    if(!PaymentData.VoucherRef || PaymentData.VoucherRef != "") {
      rtnSTR = rtnSTR + "<REFERENCE>" + PaymentData.VoucherRef + "</REFERENCE>"
    } 


    rtnSTR = rtnSTR + "<PARTYLEDGERNAME>" + PaymentData.HeaderLedger + "</PARTYLEDGERNAME>"
//    rtnSTR = rtnSTR + "<PERSISTEDVIEW>" + PaymentData.VoucherInvoiceView + "</PERSISTEDVIEW>"
//'            rtnSTR = rtnSTR + "<AUDITED>No</AUDITED>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>"
/*
'      <VCHGSTCLASS/>
'      <DIFFACTUALQTY>No</DIFFACTUALQTY>
'      <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
'      <ASORIGINAL>No</ASORIGINAL>
'      <AUDITED>No</AUDITED>
'      <FORJOBCOSTING>No</FORJOBCOSTING>
'      <ISOPTIONAL>No</ISOPTIONAL>
*/
      rtnSTR = rtnSTR + "<EFFECTIVEDATE>" + VchrDate + "</EFFECTIVEDATE>"
/*      
'      <USEFOREXCISE>No</USEFOREXCISE>
'      <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
'      <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
'      <USEFORINTEREST>No</USEFORINTEREST>
'      <USEFORGAINLOSS>No</USEFORGAINLOSS>
'      <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
'      <USEFORCOMPOUND>No</USEFORCOMPOUND>
'      <USEFORSERVICETAX>No</USEFORSERVICETAX>
'      <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
'      <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
'      <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
'      <EXCISEOPENING>No</EXCISEOPENING>
'      <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
'      <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
'      <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
'      <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
'      <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
'      <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
'      <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
'      <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
'      <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
'      <ISISDVOUCHER>No</ISISDVOUCHER>
'      <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
'      <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
'      <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
'      <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
'      <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
'      <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
*/
      rtnSTR = rtnSTR + "<ISCANCELLED>No</ISCANCELLED>"
      rtnSTR = rtnSTR + "<HASCASHFLOW>Yes</HASCASHFLOW>"
/*      
'      <ISPOSTDATED>No</ISPOSTDATED>
'      <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
'      <ISINVOICE>No</ISINVOICE>
'      <MFGJOURNAL>No</MFGJOURNAL>
'      <HASDISCOUNTS>No</HASDISCOUNTS>
'      <ASPAYSLIP>No</ASPAYSLIP>
'      <ISCOSTCENTRE>No</ISCOSTCENTRE>
'      <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
'      <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
'      <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
'      <ISVOID>No</ISVOID>
'      <ISONHOLD>No</ISONHOLD>
'      <ORDERLINESTATUS>No</ORDERLINESTATUS>
'      <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
'      <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
'      <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
'      <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
'      <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
'      <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
'      <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
'      <ISDELETED>No</ISDELETED>
'      <CHANGEVCHMODE>No</CHANGEVCHMODE>
'        rtnSTR = rtnSTR + "      <ALTERID> 413</ALTERID>"
*/
      rtnSTR = rtnSTR + "      <MASTERID> 337</MASTERID>"
      rtnSTR = rtnSTR + "      <VOUCHERKEY>" + sGUID + "</VOUCHERKEY>"
    
//          'Get the Total of the Bill
//          '==============================
      PaymentData.LedgerEntriesData.forEach(LedgerEntry => {
        VoucherTotal += LedgerEntry.LineAmount
      });

      rtnSTR = rtnSTR + "      <ALLLEDGERENTRIES.LIST>"
      rtnSTR = rtnSTR + "       <LEDGERNAME>" + PaymentData.HeaderLedger + "</LEDGERNAME>"
      rtnSTR = rtnSTR + "       <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "       <LEDGERFROMITEM>No</LEDGERFROMITEM>"
      rtnSTR = rtnSTR + "       <REMOVEZEROENTRIES>Yes</REMOVEZEROENTRIES>"
      rtnSTR = rtnSTR + "       <ISPARTYLEDGER>No</ISPARTYLEDGER>"
      rtnSTR = rtnSTR + "       <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "       <AMOUNT>" + VoucherTotal + "</AMOUNT>"

      /*
      if(LedgerEntry.CashLedger) {
      '       <BANKALLOCATIONS.LIST>
      '        <DATE>20170801</DATE>
      '        <INSTRUMENTDATE>20170801</INSTRUMENTDATE>
      '        <NAME>da029d9b-2ad0-41ff-bd6e-4b44d60268be</NAME>
      '        <TRANSACTIONTYPE>Cheque/DD</TRANSACTIONTYPE>
      '        <BANKNAME>Bank of Maharashtra</BANKNAME>
      '        <PAYMENTFAVOURING>AP Traders (Coimbatore)</PAYMENTFAVOURING>
      '        <UNIQUEREFERENCENUMBER>3W3HTuHhCK8jXnzW</UNIQUEREFERENCENUMBER>
      '        <STATUS>No</STATUS>
      '        <PAYMENTMODE>Transacted</PAYMENTMODE>
      '        <BANKPARTYNAME>AP Traders (Coimbatore)</BANKPARTYNAME>
      '        <ISCONNECTEDPAYMENT>No</ISCONNECTEDPAYMENT>
      '        <ISSPLIT>No</ISSPLIT>
      '        <ISCONTRACTUSED>No</ISCONTRACTUSED>
      '        <ISACCEPTEDWITHWARNING>No</ISACCEPTEDWITHWARNING>
      '        <ISTRANSFORCED>No</ISTRANSFORCED>
      '        <CHEQUEPRINTED> 1</CHEQUEPRINTED>
      '        <AMOUNT>-5000.00</AMOUNT>
      '        <CONTRACTDETAILS.LIST>        </CONTRACTDETAILS.LIST>
      '        <BANKSTATUSINFO.LIST>        </BANKSTATUSINFO.LIST>
      '       </BANKALLOCATIONS.LIST>
      }
      */
      rtnSTR = rtnSTR + "      </ALLLEDGERENTRIES.LIST>"

      PaymentData.LedgerEntriesData.forEach(LedgerEntry => {
        rtnSTR = rtnSTR + "      <ALLLEDGERENTRIES.LIST>"
        rtnSTR = rtnSTR + "       <LEDGERNAME>" + this.STR2XML(LedgerEntry.LedgerName) + "</LEDGERNAME>"
        rtnSTR = rtnSTR + "       <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "       <LEDGERFROMITEM>No</LEDGERFROMITEM>"
        rtnSTR = rtnSTR + "       <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
        rtnSTR = rtnSTR + "       <ISPARTYLEDGER>Yes</ISPARTYLEDGER>"
        rtnSTR = rtnSTR + "       <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "       <AMOUNT>-" + LedgerEntry.LineAmount + "</AMOUNT>"
        if(LedgerEntry.BillRef != "" ) {
          rtnSTR = rtnSTR + "       <BILLALLOCATIONS.LIST>"
          rtnSTR = rtnSTR + "        <NAME>" + this.STR2XML(LedgerEntry.LedgerName) + "</NAME>"
          rtnSTR = rtnSTR + "        <BILLTYPE>Agst Ref</BILLTYPE>"
          rtnSTR = rtnSTR + "        <TDSDEDUCTEEISSPECIALRATE>No</TDSDEDUCTEEISSPECIALRATE>"
          rtnSTR = rtnSTR + "        <AMOUNT>-" + LedgerEntry.LineAmount + "</AMOUNT>"
          rtnSTR = rtnSTR + "       </BILLALLOCATIONS.LIST>"
        }
        rtnSTR = rtnSTR + "      </ALLLEDGERENTRIES.LIST>"
      });

      rtnSTR = rtnSTR + "</VOUCHER>"

      rtnSTR = this.hdrXML + rtnSTR + this.bottomXML
      return rtnSTR
  }

  JournalVouchXML(JournalData:VoucherData):string {
    let VoucherTotal:number = 0

    JournalData.HeaderLedger = this.STR2XML(JournalData.HeaderLedger)
    JournalData.VoucherTypeName = this.STR2XML(JournalData.VoucherTypeName)
//    JournalData.VoucherNumber = this.STR2XML(JournalData.VoucherNumber)
    JournalData.VoucherRef = !JournalData.VoucherRef ? "" : this.STR2XML(JournalData.VoucherRef)
    JournalData.Narration = !JournalData.Narration ? "" : this.STR2XML(JournalData.Narration)

    const VchrDate:string = this.TallyDateFormat(JournalData.VoucherDate)
    const sGUID = "AVSolutions-" + JournalData.VoucherTypeName + "-" + VchrDate + "-" + JournalData.VoucherNumber

    let rtnSTR :string = ""
    
//    const HeaderLedger = STR2XML(JournalData.HeaderLedger)
//    const sGUID = STR2XML("AVSolutions-" + JournalData.VoucherTypeName + "-" + JournalData.VoucherDate + "-" + JournalData.VoucherNumber)
  
    if(JournalData.Action == "DELETE" ) {
      rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + JournalData.VoucherTypeName + `" ACTION="` + JournalData.Action + `">`
      rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
      rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
      rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + JournalData.VoucherTypeName + "</VOUCHERTYPENAME>"
      rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + JournalData.VoucherNumber + "</VOUCHERNUMBER>"
      rtnSTR = rtnSTR + "</VOUCHER>"
      return rtnSTR   
    }

    rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + JournalData.VoucherTypeName + `" ACTION="` + JournalData.Action + `" OBJVIEW="` + JournalData.VoucherInvoiceView + `">`
    rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
    rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
    rtnSTR = rtnSTR + "<NARRATION>" + JournalData.Narration + "</NARRATION>"
    rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + JournalData.VoucherTypeName + "</VOUCHERTYPENAME>"
    rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + JournalData.VoucherNumber + "</VOUCHERNUMBER>"
    if(JournalData.VoucherRef != "") rtnSTR = rtnSTR + "<REFERENCE>" + JournalData.VoucherRef + "</REFERENCE>"
    rtnSTR = rtnSTR + "<PARTYLEDGERNAME>" + JournalData.HeaderLedger + "</PARTYLEDGERNAME>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>" + JournalData.VoucherInvoiceView + "</PERSISTEDVIEW>"

/*    
'        rtnSTR = rtnSTR + "<AUDITED>No</AUDITED>"
'        rtnSTR = rtnSTR + "<PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>"
'      <VCHGSTCLASS/>
'      <DIFFACTUALQTY>No</DIFFACTUALQTY>
'      <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
'      <ASORIGINAL>No</ASORIGINAL>
'      <AUDITED>No</AUDITED>
'      <FORJOBCOSTING>No</FORJOBCOSTING>
'      <ISOPTIONAL>No</ISOPTIONAL>
*/

      rtnSTR = rtnSTR + "<EFFECTIVEDATE>" + VchrDate + "</EFFECTIVEDATE>"
/*
'      <USEFOREXCISE>No</USEFOREXCISE>
'      <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
'      <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
'      <USEFORINTEREST>No</USEFORINTEREST>
'      <USEFORGAINLOSS>No</USEFORGAINLOSS>
'      <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
'      <USEFORCOMPOUND>No</USEFORCOMPOUND>
'      <USEFORSERVICETAX>No</USEFORSERVICETAX>
'      <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
'      <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
'      <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
'      <EXCISEOPENING>No</EXCISEOPENING>
'      <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
'      <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
'      <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
'      <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
'      <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
'      <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
'      <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
'      <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
'      <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
'      <ISISDVOUCHER>No</ISISDVOUCHER>
'      <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
'      <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
'      <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
'      <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
'      <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
'      <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
*/
      rtnSTR = rtnSTR + "<ISCANCELLED>No</ISCANCELLED>"
      rtnSTR = rtnSTR + "<HASCASHFLOW>Yes</HASCASHFLOW>"
/*      
'      <ISPOSTDATED>No</ISPOSTDATED>
'      <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
'      <ISINVOICE>No</ISINVOICE>
'      <MFGJOURNAL>No</MFGJOURNAL>
'      <HASDISCOUNTS>No</HASDISCOUNTS>
'      <ASPAYSLIP>No</ASPAYSLIP>
'      <ISCOSTCENTRE>No</ISCOSTCENTRE>
'      <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
'      <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
'      <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
'      <ISVOID>No</ISVOID>
'      <ISONHOLD>No</ISONHOLD>
'      <ORDERLINESTATUS>No</ORDERLINESTATUS>
'      <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
'      <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
'      <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
'      <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
'      <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
'      <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
'      <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
'      <ISDELETED>No</ISDELETED>
'      <CHANGEVCHMODE>No</CHANGEVCHMODE>
'        rtnSTR = rtnSTR + "      <ALTERID> 413</ALTERID>"
*/
      rtnSTR = rtnSTR + "      <ISINVOICE>No</ISINVOICE>"
      rtnSTR = rtnSTR + "      <MASTERID> 337</MASTERID>"
      rtnSTR = rtnSTR + "      <VOUCHERKEY>" + sGUID + "</VOUCHERKEY>"
    
      JournalData.LedgerEntriesData.forEach(LedgerEntry => {
        LedgerEntry.LineAmount = LedgerEntry.DebitCredit == "DR" ? -1 * LedgerEntry.LineAmount : LedgerEntry.LineAmount
        rtnSTR = rtnSTR + "    <ALLLEDGERENTRIES.LIST>"
        rtnSTR = rtnSTR + "       <LEDGERNAME>" + this.STR2XML(LedgerEntry.LedgerName) + "</LEDGERNAME>"
//'            rtnSTR = rtnSTR + "       <GSTCLASS/>"
        rtnSTR = rtnSTR + "       <ISDEEMEDPOSITIVE>" + (LedgerEntry.DebitCredit == "DR" ? "Yes" : "No") +  "</ISDEEMEDPOSITIVE>"
//'            rtnSTR = rtnSTR + "       <LEDGERFROMITEM>No</LEDGERFROMITEM>"
//'            rtnSTR = rtnSTR + "       <REMOVEZEROENTRIES>No</RE6MOVEZEROENTRIES>"
        rtnSTR = rtnSTR + "       <ISPARTYLEDGER>Yes</ISPARTYLEDGER>"
        rtnSTR = rtnSTR + "       <ISLASTDEEMEDPOSITIVE>" + (LedgerEntry.DebitCredit == "DR" ? "Yes" : "No") +  "</ISLASTDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "       <AMOUNT>" + LedgerEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "   </ALLLEDGERENTRIES.LIST>"
      });
      
      rtnSTR = rtnSTR + "</VOUCHER>"
      rtnSTR = this.hdrXML + rtnSTR + this.bottomXML
      return rtnSTR
  }

  SaleVouchXML(SaleData:VoucherData):string {
    let VoucherTotal:number = 0

    SaleData.HeaderLedger = this.STR2XML(SaleData.HeaderLedger)
    SaleData.VoucherTypeName = this.STR2XML(SaleData.VoucherTypeName)
//    SaleData.VoucherNumber = SaleData.VoucherNumber
    SaleData.VoucherRef = !SaleData.VoucherRef ? "" : this.STR2XML(SaleData.VoucherRef)
    SaleData.Narration = !SaleData.Narration ? "" : this.STR2XML(SaleData.Narration)

    const VchrDate:string = this.TallyDateFormat(SaleData.VoucherDate)
    const sGUID = "AVSolutions-" + SaleData.VoucherTypeName + "-" + VchrDate + "-" + SaleData.VoucherNumber

    let rtnSTR :string = ""
 
    if(SaleData.Action == "DELETE") {
      rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + SaleData.VoucherTypeName + `" ACTION="` + SaleData.Action + `">`
      rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
      rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
      rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + SaleData.VoucherTypeName + "</VOUCHERTYPENAME>"
      rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + SaleData.VoucherNumber + "</VOUCHERNUMBER>"
      rtnSTR = rtnSTR + "</VOUCHER>"
      return rtnSTR
    }

    rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + SaleData.VoucherTypeName + `" ACTION="` + SaleData.Action + `" OBJVIEW="` + SaleData.VoucherInvoiceView + `">`

    if(SaleData.HeaderAddress && SaleData.HeaderAddress.length > 0) {
      rtnSTR = rtnSTR + `<ADDRESS.LIST TYPE="String">`
      for (let i = 0; i < SaleData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<ADDRESS>" + this.STR2XML(SaleData.HeaderAddress[i]) + "</ADDRESS>"
      }
      rtnSTR = rtnSTR + "</ADDRESS.LIST>"
              
      rtnSTR = rtnSTR + `<BASICBUYERADDRESS.LIST TYPE="String">`
      for (let i = 0; i < SaleData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<BASICBUYERADDRESS>" + this.STR2XML(SaleData.HeaderAddress[i]) + "</BASICBUYERADDRESS>"
      }
      rtnSTR = rtnSTR + "</BASICBUYERADDRESS.LIST>"
    }
    rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
    rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
    rtnSTR = rtnSTR + "<NARRATION>" + SaleData.Narration + "</NARRATION>"
    rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + SaleData.VoucherTypeName + "</VOUCHERTYPENAME>"
    rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + SaleData.VoucherNumber + "</VOUCHERNUMBER>"
    if(SaleData.VoucherRef != "")  rtnSTR = rtnSTR + "<REFERENCE>" + SaleData.VoucherRef + "</REFERENCE>"
    rtnSTR = rtnSTR + "<PARTYLEDGERNAME>" + SaleData.HeaderLedger + "</PARTYLEDGERNAME>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>" + SaleData.VoucherInvoiceView + "</PERSISTEDVIEW>"
    rtnSTR = rtnSTR + "<VCHENTRYMODE>"  + SaleData.VoucherEntryMode + "</VCHENTRYMODE>"

//'            rtnSTR = rtnSTR + "<AUDITED>No</AUDITED>"
//'            rtnSTR = rtnSTR + "<FORJOBCOSTING>No</FORJOBCOSTING>"
    rtnSTR = rtnSTR + "<ISOPTIONAL>No</ISOPTIONAL>"
    rtnSTR = rtnSTR + "<EFFECTIVEDATE>" + VchrDate + "</EFFECTIVEDATE>"
    rtnSTR = rtnSTR + "<ALTERID> 4</ALTERID>"
    rtnSTR = rtnSTR + "<ISINVOICE>Yes</ISINVOICE>"
    rtnSTR = rtnSTR + "<ISDELETED>No</ISDELETED>"
    rtnSTR = rtnSTR + "<MASTERID> 1</MASTERID>"
    rtnSTR = rtnSTR + "<VOUCHERKEY>" + sGUID + "</VOUCHERKEY>"
    if(SaleData.StateName) rtnSTR = rtnSTR + "<STATENAME>" + this.STR2XML(SaleData.StateName) + "</STATENAME>"
    if(SaleData.GSTRegistrationType) rtnSTR = rtnSTR + "<GSTREGISTRATIONTYPE>" + this.STR2XML(SaleData.GSTRegistrationType) + "</GSTREGISTRATIONTYPE>"
    if(SaleData.PartyGSTNo) rtnSTR = rtnSTR + "<PARTYGSTIN>" + this.STR2XML(SaleData.PartyGSTNo) + "</PARTYGSTIN>"
    if(SaleData.VoucherTypeClass ) rtnSTR = rtnSTR + "<CLASSNAME>" + this.STR2XML(SaleData.VoucherTypeClass) + "</CLASSNAME>"
    rtnSTR = rtnSTR + "<BASICBASEPARTYNAME>" + SaleData.HeaderLedger + "</BASICBASEPARTYNAME>"

    SaleData.LedgerEntriesData.forEach(LedgerEntry => {
      VoucherTotal += LedgerEntry.LineAmount
    });

    SaleData.InventoryEntriesData.forEach(InventoryEntry => {
      VoucherTotal += InventoryEntry.LineAmount
    });


//  'Add LedgerEntry for Party
//  '==============================
    rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
    rtnSTR = rtnSTR + "  <LEDGERNAME>" + SaleData.HeaderLedger + "</LEDGERNAME>"
    rtnSTR = rtnSTR + "  <GSTCLASS/>"
    rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
    rtnSTR = rtnSTR + "  <ISPARTYLEDGER>Yes</ISPARTYLEDGER>"
    rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <AMOUNT>-" + VoucherTotal + "</AMOUNT>"
 
//    'Add Billallocation details
    rtnSTR = rtnSTR + " <BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "   <NAME>" + SaleData.VoucherNumber + "</NAME>"
    rtnSTR = rtnSTR + "   <BILLTYPE>New Ref</BILLTYPE>"
    rtnSTR = rtnSTR + "   <AMOUNT>-" + VoucherTotal + "</AMOUNT>"
//'                rtnSTR = rtnSTR + "   <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>"
//'                rtnSTR = rtnSTR + "   <STBILLCATEGORIES.LIST>        </STBILLCATEGORIES.LIST>"
    rtnSTR = rtnSTR + " </BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"

// 'Add LedgerEntries for Non Item Accounts
// '=========================================
    SaleData.LedgerEntriesData.forEach(LedgerEntry => {
      rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
//      '                rtnSTR = rtnSTR + "  <ROUNDTYPE>Normal Rounding</ROUNDTYPE>"
      rtnSTR = rtnSTR + "  <LEDGERNAME>" + this.STR2XML(LedgerEntry.LedgerName) + "</LEDGERNAME>"
      rtnSTR = rtnSTR + "  <METHODTYPE>GST</METHODTYPE>"
      rtnSTR = rtnSTR + "  <GSTCLASS/>"
      rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
//      '                rtnSTR = rtnSTR + "  <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
      rtnSTR = rtnSTR + "  <ISPARTYLEDGER>No</ISPARTYLEDGER>"
      rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
//      '                rtnSTR = rtnSTR + "       <ROUNDLIMIT> 1</ROUNDLIMIT>"
      rtnSTR = rtnSTR + "  <AMOUNT>" + LedgerEntry.LineAmount + "</AMOUNT>"
      rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"
    });

       
//  'Add Inventory Entries
//  '=========================================
    if(SaleData.InventoryEntriesData.length == 0) {
      rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>      </ALLINVENTORYENTRIES.LIST>"
    } else {
      SaleData.InventoryEntriesData.forEach(InventoryEntry => {
        rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>"
        rtnSTR = rtnSTR + "  <STOCKITEMNAME>" + this.STR2XML(InventoryEntry.StockName) + "</STOCKITEMNAME>"
        rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
//'                rtnSTR = rtnSTR + "       <ISAUTONEGATE>No</ISAUTONEGATE>"
//'                rtnSTR = rtnSTR + "       <ISCUSTOMSCLEARANCE>No</ISCUSTOMSCLEARANCE>"
//'                rtnSTR = rtnSTR + "       <ISTRACKCOMPONENT>No</ISTRACKCOMPONENT>"
//'                rtnSTR = rtnSTR + "       <ISTRACKPRODUCTION>No</ISTRACKPRODUCTION>"
//'                rtnSTR = rtnSTR + "       <ISPRIMARYITEM>No</ISPRIMARYITEM>"
//'                rtnSTR = rtnSTR + "       <ISSCRAP>No</ISSCRAP>"
        rtnSTR = rtnSTR + "  <RATE>" + InventoryEntry.Rate + "/" + this.STR2XML(InventoryEntry.UOM) + "</RATE>"
        rtnSTR = rtnSTR + "  <AMOUNT>" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "  <ACTUALQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "  <BILLEDQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  <BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <GODOWNNAME>Main Location</GODOWNNAME>"
        rtnSTR = rtnSTR + "    <BATCHNAME>Primary Batch</BATCHNAME>"
        rtnSTR = rtnSTR + "    <INDENTNO/>"
        rtnSTR = rtnSTR + "    <ORDERNO/>"
        rtnSTR = rtnSTR + "    <TRACKINGNUMBER/>"
//'                rtnSTR = rtnSTR + "        <DYNAMICCSTISCLEARED>No</DYNAMICCSTISCLEARED>"
        rtnSTR = rtnSTR + "    <AMOUNT>" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <ACTUALQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "    <BILLEDQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  </BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "  <ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <LEDGERNAME>" + this.STR2XML(InventoryEntry.LedgerName) + "</LEDGERNAME>"
//'                rtnSTR = rtnSTR + "        <CLASSRATE>100.00000</CLASSRATE>"
//'                rtnSTR = rtnSTR + "        <GSTCLASS/>"
//'                rtnSTR = rtnSTR + "        <GSTOVRDNCLASSIFICATION>Item Rate Having Less Than 1000</GSTOVRDNCLASSIFICATION>"
//'                rtnSTR = rtnSTR + "        <GSTOVRDNINELIGIBLEITC> Not Applicable</GSTOVRDNINELIGIBLEITC>"
//'                rtnSTR = rtnSTR + "        <GSTOVRDNISREVCHARGEAPPL> Not Applicable</GSTOVRDNISREVCHARGEAPPL>"
        rtnSTR = rtnSTR + "    <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
//'                rtnSTR = rtnSTR + "        <LEDGERFROMITEM>No</LEDGERFROMITEM>"
        rtnSTR = rtnSTR + "    <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
        rtnSTR = rtnSTR + "    <ISPARTYLEDGER>No</ISPARTYLEDGER>"
        rtnSTR = rtnSTR + "    <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "    <AMOUNT>" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "      <GSTRATEDUTYHEAD>Integrated Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Central Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>State Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + " </ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "</ALLINVENTORYENTRIES.LIST>"
      });
    }
    
    rtnSTR = rtnSTR + "</VOUCHER>"
    rtnSTR = this.hdrXML + rtnSTR + this.bottomXML

    return rtnSTR
  }

  PurchaseVouchXML(PurchaseData:VoucherData):string {
    let VoucherTotal:number = 0

    PurchaseData.HeaderLedger = this.STR2XML(PurchaseData.HeaderLedger)
    PurchaseData.VoucherTypeName = this.STR2XML(PurchaseData.VoucherTypeName)
//    PurchaseData.VoucherNumber = this.STR2XML(PurchaseData.VoucherNumber)
    PurchaseData.VoucherRef = !PurchaseData.VoucherRef ? "" : this.STR2XML(PurchaseData.VoucherRef)
    PurchaseData.Narration = !PurchaseData.Narration ? "" : this.STR2XML(PurchaseData.Narration)

    const VchrDate:string = this.TallyDateFormat(PurchaseData.VoucherDate)
    const sGUID = "AVSolutions-" + PurchaseData.VoucherTypeName + "-" + VchrDate + "-" + PurchaseData.VoucherNumber

    let rtnSTR :string = ""
  
    if(PurchaseData.Action == "DELETE") {
      rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + PurchaseData.VoucherTypeName + `" ACTION="` + PurchaseData.Action + `">`
      rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
      rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
      rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + PurchaseData.VoucherTypeName + "</VOUCHERTYPENAME>"
      rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + PurchaseData.VoucherNumber + "</VOUCHERNUMBER>"
      rtnSTR = rtnSTR + "</VOUCHER>"
      return rtnSTR         
    }

    rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + PurchaseData.VoucherTypeName + `" ACTION="` + PurchaseData.Action + `" OBJVIEW="` + PurchaseData.VoucherInvoiceView + `">`
    if(PurchaseData.HeaderAddress && PurchaseData.HeaderAddress.length > 0) {
      rtnSTR = rtnSTR + `<ADDRESS.LIST TYPE="String">`
      for (let i = 0; i < PurchaseData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<ADDRESS>" + this.STR2XML(PurchaseData.HeaderAddress[i]) + "</ADDRESS>"
      }
      rtnSTR = rtnSTR + "</ADDRESS.LIST>"
              
      rtnSTR = rtnSTR + `<BASICBUYERADDRESS.LIST TYPE="String">`
      for (let i = 0; i < PurchaseData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<BASICBUYERADDRESS>" + this.STR2XML(PurchaseData.HeaderAddress[i]) + "</BASICBUYERADDRESS>"
      }
      rtnSTR = rtnSTR + "</BASICBUYERADDRESS.LIST>"
    }    
        
    rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
    rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
    rtnSTR = rtnSTR + "<NARRATION>" + PurchaseData.Narration + "</NARRATION>"
    rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + PurchaseData.VoucherTypeName + "</VOUCHERTYPENAME>"
    rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + PurchaseData.VoucherNumber + "</VOUCHERNUMBER>"
    if(PurchaseData.VoucherRef != "" )  rtnSTR = rtnSTR + "<REFERENCE>" + PurchaseData.VoucherRef + "</REFERENCE>"
    if(PurchaseData.VoucherRefDate ) rtnSTR = rtnSTR + "<REFERENCEDATE>" + this.TallyDateFormat(PurchaseData.VoucherRefDate) + "</REFERENCEDATE>"
    rtnSTR = rtnSTR + "<PARTYLEDGERNAME>" + PurchaseData.HeaderLedger + "</PARTYLEDGERNAME>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>" + PurchaseData.VoucherInvoiceView + "</PERSISTEDVIEW>"
    rtnSTR = rtnSTR + "<VCHENTRYMODE>"  + PurchaseData.VoucherEntryMode + "</VCHENTRYMODE>"

//'            rtnSTR = rtnSTR + "<AUDITED>No</AUDITED>"
//'            rtnSTR = rtnSTR + "<FORJOBCOSTING>No</FORJOBCOSTING>"
    rtnSTR = rtnSTR + "<ISOPTIONAL>No</ISOPTIONAL>"
    rtnSTR = rtnSTR + "<EFFECTIVEDATE>" + VchrDate + "</EFFECTIVEDATE>"
    rtnSTR = rtnSTR + "<ALTERID> 4</ALTERID>"
    rtnSTR = rtnSTR + "<ISINVOICE>Yes</ISINVOICE>"
    rtnSTR = rtnSTR + "<ISDELETED>No</ISDELETED>"
    rtnSTR = rtnSTR + "<MASTERID> 1</MASTERID>"
    rtnSTR = rtnSTR + "<VOUCHERKEY>" + sGUID + "</VOUCHERKEY>"
    if(PurchaseData.StateName) rtnSTR = rtnSTR + "<STATENAME>" + this.STR2XML(PurchaseData.StateName) + "</STATENAME>"
    if(PurchaseData.GSTRegistrationType) rtnSTR = rtnSTR + "<GSTREGISTRATIONTYPE>" + this.STR2XML(PurchaseData.GSTRegistrationType) + "</GSTREGISTRATIONTYPE>"
    if(PurchaseData.PartyGSTNo) rtnSTR = rtnSTR + "<PARTYGSTIN>" + this.STR2XML(PurchaseData.PartyGSTNo) + "</PARTYGSTIN>"
    if(PurchaseData.VoucherTypeClass ) rtnSTR = rtnSTR + "<CLASSNAME>" + this.STR2XML(PurchaseData.VoucherTypeClass) + "</CLASSNAME>"
    rtnSTR = rtnSTR + "<BASICBASEPARTYNAME>" + PurchaseData.HeaderLedger + "</BASICBASEPARTYNAME>"
          
//    'Get the Total of the Bill
//    '==============================
    PurchaseData.InventoryEntriesData.forEach(InventoryEntry => {
      VoucherTotal += InventoryEntry.LineAmount
    });

    PurchaseData.LedgerEntriesData.forEach(LedgerEntry => {
      VoucherTotal += LedgerEntry.LineAmount
    });

//    'Add LedgerEntry for Party
//    '==============================
    rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
    rtnSTR = rtnSTR + "  <LEDGERNAME>" + PurchaseData.HeaderLedger + "</LEDGERNAME>"
    rtnSTR = rtnSTR + "  <GSTCLASS/>"
    rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
    rtnSTR = rtnSTR + "  <ISPARTYLEDGER>Yes</ISPARTYLEDGER>"
    rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <AMOUNT>" + VoucherTotal + "</AMOUNT>"
//    'Add Billallocation details
    rtnSTR = rtnSTR + " <BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "   <NAME>" + PurchaseData.VoucherNumber + "</NAME>"
    rtnSTR = rtnSTR + "   <BILLTYPE>New Ref</BILLTYPE>"
    rtnSTR = rtnSTR + "   <AMOUNT>" + VoucherTotal + "</AMOUNT>"
//'                rtnSTR = rtnSTR + "   <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>"
//'                rtnSTR = rtnSTR + "   <STBILLCATEGORIES.LIST>        </STBILLCATEGORIES.LIST>"
    rtnSTR = rtnSTR + " </BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"


//  'Add LedgerEntries for Non Item Accounts
//  '=========================================
    PurchaseData.LedgerEntriesData.forEach(LedgerEntry => {
      rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
//      '                rtnSTR = rtnSTR + "  <ROUNDTYPE>Normal Rounding</ROUNDTYPE>"
      rtnSTR = rtnSTR + "  <LEDGERNAME>" + LedgerEntry.LedgerName + "</LEDGERNAME>"
      rtnSTR = rtnSTR + "  <METHODTYPE>GST</METHODTYPE>"
      rtnSTR = rtnSTR + "  <GSTCLASS/>"
      rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
//      '                rtnSTR = rtnSTR + "  <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
      rtnSTR = rtnSTR + "  <ISPARTYLEDGER>No</ISPARTYLEDGER>"
      rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
//      '                rtnSTR = rtnSTR + "       <ROUNDLIMIT> 1</ROUNDLIMIT>"
      if(LedgerEntry.LineAmount < 0 ) {
        rtnSTR = rtnSTR + "  <AMOUNT>" + Math.abs(LedgerEntry.LineAmount) + "</AMOUNT>"
      }else {
        rtnSTR = rtnSTR + "  <AMOUNT>-" + Math.abs(LedgerEntry.LineAmount) + "</AMOUNT>"
      }                    
      rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"      
    });

//    'Add Inventory Entries
//    '=========================================
    if(PurchaseData.InventoryEntriesData.length == 0 ) {
      rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>      </ALLINVENTORYENTRIES.LIST>"      
    } else {
      PurchaseData.InventoryEntriesData.forEach(InventoryEntry => {
//      'InvEntryNo||StockItem||UOM||ActQty||BilledQty||Rate||LedgerName||Amount
        rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>"
        rtnSTR = rtnSTR + "  <STOCKITEMNAME>" + this.STR2XML(InventoryEntry.StockName) + "</STOCKITEMNAME>"
        rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
//            '                rtnSTR = rtnSTR + "       <ISAUTONEGATE>No</ISAUTONEGATE>"
//            '                rtnSTR = rtnSTR + "       <ISCUSTOMSCLEARANCE>No</ISCUSTOMSCLEARANCE>"
//            '                rtnSTR = rtnSTR + "       <ISTRACKCOMPONENT>No</ISTRACKCOMPONENT>"
//            '                rtnSTR = rtnSTR + "       <ISTRACKPRODUCTION>No</ISTRACKPRODUCTION>"
//            '                rtnSTR = rtnSTR + "       <ISPRIMARYITEM>No</ISPRIMARYITEM>"
//            '                rtnSTR = rtnSTR + "       <ISSCRAP>No</ISSCRAP>"
        rtnSTR = rtnSTR + "  <RATE>" + InventoryEntry.Rate + "/" + this.STR2XML(InventoryEntry.UOM) + "</RATE>"
        rtnSTR = rtnSTR + "  <AMOUNT>-" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "  <ACTUALQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "  <BILLEDQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  <BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <GODOWNNAME>Main Location</GODOWNNAME>"
        rtnSTR = rtnSTR + "    <BATCHNAME>Primary Batch</BATCHNAME>"
        rtnSTR = rtnSTR + "    <INDENTNO/>"
        rtnSTR = rtnSTR + "    <ORDERNO/>"
        rtnSTR = rtnSTR + "    <TRACKINGNUMBER/>"
  //            '                rtnSTR = rtnSTR + "        <DYNAMICCSTISCLEARED>No</DYNAMICCSTISCLEARED>"
        rtnSTR = rtnSTR + "    <AMOUNT>-" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <ACTUALQTY>" + InventoryEntry.Qty +  " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "    <BILLEDQTY>" + InventoryEntry.Qty +  " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  </BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "  <ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <LEDGERNAME>" + this.STR2XML(InventoryEntry.LedgerName) + "</LEDGERNAME>"
  //      '                rtnSTR = rtnSTR + "        <CLASSRATE>100.00000</CLASSRATE>"
  //      '                rtnSTR = rtnSTR + "        <GSTCLASS/>"
  //      '                rtnSTR = rtnSTR + "        <GSTOVRDNCLASSIFICATION>Item Rate Having Less Than 1000</GSTOVRDNCLASSIFICATION>"
  //      '                rtnSTR = rtnSTR + "        <GSTOVRDNINELIGIBLEITC> Not Applicable</GSTOVRDNINELIGIBLEITC>"
  //      '                rtnSTR = rtnSTR + "        <GSTOVRDNISREVCHARGEAPPL> Not Applicable</GSTOVRDNISREVCHARGEAPPL>"
        rtnSTR = rtnSTR + "    <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
  //            '                rtnSTR = rtnSTR + "        <LEDGERFROMITEM>No</LEDGERFROMITEM>"
        rtnSTR = rtnSTR + "    <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
        rtnSTR = rtnSTR + "    <ISPARTYLEDGER>No</ISPARTYLEDGER>"
        rtnSTR = rtnSTR + "    <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "    <AMOUNT>-" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "      <GSTRATEDUTYHEAD>Integrated Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Central Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>State Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + " </ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "</ALLINVENTORYENTRIES.LIST>"
      });  
    }                            
    rtnSTR = rtnSTR + "</VOUCHER>"
    rtnSTR = this.hdrXML + rtnSTR + this.bottomXML
    return rtnSTR
  }


  
  // Sales Return
  CreditNoteVouchXML(SalesReturnData:VoucherData):string {
    let VoucherTotal:number = 0

    SalesReturnData.HeaderLedger = this.STR2XML(SalesReturnData.HeaderLedger)
    SalesReturnData.VoucherTypeName = this.STR2XML(SalesReturnData.VoucherTypeName)
//    SalesReturnData.VoucherNumber = this.STR2XML(SalesReturnData.VoucherNumber)
    SalesReturnData.VoucherRef = !SalesReturnData.VoucherRef ? "" : this.STR2XML(SalesReturnData.VoucherRef)
    SalesReturnData.Narration = !SalesReturnData.Narration ? "" : this.STR2XML(SalesReturnData.Narration)

    const VchrDate:string = this.TallyDateFormat(SalesReturnData.VoucherDate)
    const sGUID = "AVSolutions-" + SalesReturnData.VoucherTypeName + "-" + VchrDate + "-" + SalesReturnData.VoucherNumber

    let rtnSTR :string = ""
//    let VoucherTotal = 0
//    const HeaderLedger = STR2XML(HeaderLedger)
//    const sGUID = STR2XML("AVSolutions-" + SalesReturnData.VoucherTypeName + "-" + SalesReturnData.VoucherDate + "-" + SalesReturnData.VoucherNumber)
  
    if(SalesReturnData.Action == "DELETE" ) {
      rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + SalesReturnData.VoucherTypeName + `" ACTION="` + SalesReturnData.Action + `">`
      rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
      rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
      rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + SalesReturnData.VoucherTypeName + "</VOUCHERTYPENAME>"
      rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + SalesReturnData.VoucherNumber + "</VOUCHERNUMBER>"
      rtnSTR = rtnSTR + "</VOUCHER>"
      return rtnSTR
    }
      
    rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + SalesReturnData.VoucherTypeName + `" ACTION="` + SalesReturnData.Action + `" OBJVIEW="` + SalesReturnData.VoucherInvoiceView + `">`
    if(SalesReturnData.HeaderAddress && SalesReturnData.HeaderAddress.length > 0) {
      rtnSTR = rtnSTR + `<ADDRESS.LIST TYPE="String">`
      for (let i = 0; i < SalesReturnData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<ADDRESS>" + this.STR2XML(SalesReturnData.HeaderAddress[i]) + "</ADDRESS>"
      }
      rtnSTR = rtnSTR + "</ADDRESS.LIST>"
              
      rtnSTR = rtnSTR + `<BASICBUYERADDRESS.LIST TYPE="String">`
      for (let i = 0; i < SalesReturnData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<BASICBUYERADDRESS>" + this.STR2XML(SalesReturnData.HeaderAddress[i]) + "</BASICBUYERADDRESS>"
      }
      rtnSTR = rtnSTR + "</BASICBUYERADDRESS.LIST>"
    }    
    rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
    rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
    rtnSTR = rtnSTR + "<NARRATION>" + SalesReturnData.Narration +"</NARRATION>"
    rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + SalesReturnData.VoucherTypeName + "</VOUCHERTYPENAME>"
    rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + SalesReturnData.VoucherNumber + "</VOUCHERNUMBER>"
    if(SalesReturnData.VoucherRef != "" ) rtnSTR = rtnSTR + "<REFERENCE>" + SalesReturnData.VoucherRef + "</REFERENCE>"
    rtnSTR = rtnSTR + "<PARTYLEDGERNAME>" + SalesReturnData.HeaderLedger + "</PARTYLEDGERNAME>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>" + SalesReturnData.VoucherInvoiceView + "</PERSISTEDVIEW>"
    rtnSTR = rtnSTR + "<VCHENTRYMODE>"  + SalesReturnData.VoucherEntryMode + "</VCHENTRYMODE>"

//'            rtnSTR = rtnSTR + "<AUDITED>No</AUDITED>"
//'            rtnSTR = rtnSTR + "<FORJOBCOSTING>No</FORJOBCOSTING>"
    rtnSTR = rtnSTR + "<ISOPTIONAL>No</ISOPTIONAL>"
    rtnSTR = rtnSTR + "<EFFECTIVEDATE>" + VchrDate + "</EFFECTIVEDATE>"
    rtnSTR = rtnSTR + "<ALTERID> 4</ALTERID>"
    rtnSTR = rtnSTR + "<ISINVOICE>Yes</ISINVOICE>"
    rtnSTR = rtnSTR + "<ISDELETED>No</ISDELETED>"
    rtnSTR = rtnSTR + "<MASTERID> 1</MASTERID>"
    rtnSTR = rtnSTR + "<VOUCHERKEY>" + sGUID + "</VOUCHERKEY>"
    if(SalesReturnData.StateName) rtnSTR = rtnSTR + "<STATENAME>" + this.STR2XML(SalesReturnData.StateName) + "</STATENAME>"
    if(SalesReturnData.GSTRegistrationType) rtnSTR = rtnSTR + "<GSTREGISTRATIONTYPE>" + this.STR2XML(SalesReturnData.GSTRegistrationType) + "</GSTREGISTRATIONTYPE>"
    if(SalesReturnData.PartyGSTNo) rtnSTR = rtnSTR + "<PARTYGSTIN>" + this.STR2XML(SalesReturnData.PartyGSTNo) + "</PARTYGSTIN>"
    if(SalesReturnData.VoucherTypeClass ) rtnSTR = rtnSTR + "<CLASSNAME>" + this.STR2XML(SalesReturnData.VoucherTypeClass) + "</CLASSNAME>"
    rtnSTR = rtnSTR + "<BASICBASEPARTYNAME>" + SalesReturnData.HeaderLedger + "</BASICBASEPARTYNAME>"
          
//    'Get the Total of the Bill
//    '==============================
    SalesReturnData.InventoryEntriesData.forEach(InventoryEntry => {
      VoucherTotal += InventoryEntry.LineAmount
    });

    SalesReturnData.LedgerEntriesData.forEach(LedgerEntry => {
      VoucherTotal += LedgerEntry.LineAmount
    });

//  'Add LedgerEntry for Party
//  '==============================
    rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
    rtnSTR = rtnSTR + "  <LEDGERNAME>" + SalesReturnData.HeaderLedger + "</LEDGERNAME>"
    rtnSTR = rtnSTR + "  <GSTCLASS/>"
    rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
    rtnSTR = rtnSTR + "  <ISPARTYLEDGER>Yes</ISPARTYLEDGER>"
    rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <AMOUNT>" + VoucherTotal + "</AMOUNT>"     
    rtnSTR = rtnSTR + " <BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "   <NAME>" + SalesReturnData.VoucherNumber + "</NAME>"
    rtnSTR = rtnSTR + "   <BILLTYPE>New Ref</BILLTYPE>"
    rtnSTR = rtnSTR + "   <AMOUNT>" + VoucherTotal + "</AMOUNT>"
//'                rtnSTR = rtnSTR + "   <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>"
//'                rtnSTR = rtnSTR + "   <STBILLCATEGORIES.LIST>        </STBILLCATEGORIES.LIST>"
    rtnSTR = rtnSTR + " </BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"

    //  'Add LedgerEntries for Non Item Accounts
    //  '=========================================
    SalesReturnData.LedgerEntriesData.forEach(LedgerEntry => {
      rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
    //      '                rtnSTR = rtnSTR + "  <ROUNDTYPE>Normal Rounding</ROUNDTYPE>"
      rtnSTR = rtnSTR + "  <LEDGERNAME>" + this.STR2XML(LedgerEntry.LedgerName) + "</LEDGERNAME>"
      rtnSTR = rtnSTR + "  <METHODTYPE>GST</METHODTYPE>"
      rtnSTR = rtnSTR + "  <GSTCLASS/>"
      rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
    //      '                rtnSTR = rtnSTR + "  <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
      rtnSTR = rtnSTR + "  <ISPARTYLEDGER>No</ISPARTYLEDGER>"
      rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
    //      '                rtnSTR = rtnSTR + "       <ROUNDLIMIT> 1</ROUNDLIMIT>"                    
      rtnSTR = rtnSTR + "  <AMOUNT>" + Math.abs(LedgerEntry.LineAmount) + "</AMOUNT>"
      rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"      
    });


    //    'Add Inventory Entries
    //    '=========================================
    if(SalesReturnData.InventoryEntriesData.length == 0 ) {
      rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>      </ALLINVENTORYENTRIES.LIST>"      
    } else {
      SalesReturnData.InventoryEntriesData.forEach(InventoryEntry => {
        rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>"
        rtnSTR = rtnSTR + "  <STOCKITEMNAME>" + this.STR2XML(InventoryEntry.StockName) + "</STOCKITEMNAME>"
        rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
    //            '                rtnSTR = rtnSTR + "       <ISAUTONEGATE>No</ISAUTONEGATE>"
    //            '                rtnSTR = rtnSTR + "       <ISCUSTOMSCLEARANCE>No</ISCUSTOMSCLEARANCE>"
    //            '                rtnSTR = rtnSTR + "       <ISTRACKCOMPONENT>No</ISTRACKCOMPONENT>"
    //            '                rtnSTR = rtnSTR + "       <ISTRACKPRODUCTION>No</ISTRACKPRODUCTION>"
    //            '                rtnSTR = rtnSTR + "       <ISPRIMARYITEM>No</ISPRIMARYITEM>"
    //            '                rtnSTR = rtnSTR + "       <ISSCRAP>No</ISSCRAP>"
        rtnSTR = rtnSTR + "  <RATE>" + InventoryEntry.Rate + "/" + this.STR2XML(InventoryEntry.UOM) + "</RATE>"
        rtnSTR = rtnSTR + "  <AMOUNT>-" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "  <ACTUALQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "  <BILLEDQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  <BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <GODOWNNAME>Main Location</GODOWNNAME>"
        rtnSTR = rtnSTR + "    <BATCHNAME>Primary Batch</BATCHNAME>"
        rtnSTR = rtnSTR + "    <INDENTNO/>"
        rtnSTR = rtnSTR + "    <ORDERNO/>"
        rtnSTR = rtnSTR + "    <TRACKINGNUMBER/>"
    //            '                rtnSTR = rtnSTR + "        <DYNAMICCSTISCLEARED>No</DYNAMICCSTISCLEARED>"
        rtnSTR = rtnSTR + "    <AMOUNT>-" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <ACTUALQTY>" + InventoryEntry.Qty +  " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "    <BILLEDQTY>" + InventoryEntry.Qty +  " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  </BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "  <ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <LEDGERNAME>" + this.STR2XML(InventoryEntry.LedgerName) + "</LEDGERNAME>"
    //      '                rtnSTR = rtnSTR + "        <CLASSRATE>100.00000</CLASSRATE>"
    //      '                rtnSTR = rtnSTR + "        <GSTCLASS/>"
    //      '                rtnSTR = rtnSTR + "        <GSTOVRDNCLASSIFICATION>Item Rate Having Less Than 1000</GSTOVRDNCLASSIFICATION>"
    //      '                rtnSTR = rtnSTR + "        <GSTOVRDNINELIGIBLEITC> Not Applicable</GSTOVRDNINELIGIBLEITC>"
    //      '                rtnSTR = rtnSTR + "        <GSTOVRDNISREVCHARGEAPPL> Not Applicable</GSTOVRDNISREVCHARGEAPPL>"
        rtnSTR = rtnSTR + "    <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
    //            '                rtnSTR = rtnSTR + "        <LEDGERFROMITEM>No</LEDGERFROMITEM>"
        rtnSTR = rtnSTR + "    <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
        rtnSTR = rtnSTR + "    <ISPARTYLEDGER>No</ISPARTYLEDGER>"
        rtnSTR = rtnSTR + "    <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "    <AMOUNT>-" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "      <GSTRATEDUTYHEAD>Integrated Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Central Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>State Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + " </ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "</ALLINVENTORYENTRIES.LIST>"
      });  
    }                            
    rtnSTR = rtnSTR + "</VOUCHER>"
    rtnSTR = this.hdrXML + rtnSTR + this.bottomXML    
    return rtnSTR
  }

  // Purchase Return
  DebitNoteVouchXML(PurchaseReturnData:VoucherData):string {
    let VoucherTotal:number = 0

    PurchaseReturnData.HeaderLedger = this.STR2XML(PurchaseReturnData.HeaderLedger)
    PurchaseReturnData.VoucherTypeName = this.STR2XML(PurchaseReturnData.VoucherTypeName)
//    PurchaseReturnData.VoucherNumber = this.STR2XML(PurchaseReturnData.VoucherNumber)
    PurchaseReturnData.VoucherRef = !PurchaseReturnData.VoucherRef ? "" : this.STR2XML(PurchaseReturnData.VoucherRef)
    PurchaseReturnData.Narration = !PurchaseReturnData.Narration ? "" : this.STR2XML(PurchaseReturnData.Narration)

    const VchrDate:string = this.TallyDateFormat(PurchaseReturnData.VoucherDate)
    const sGUID = "AVSolutions-" + PurchaseReturnData.VoucherTypeName + "-" + VchrDate + "-" + PurchaseReturnData.VoucherNumber

    let rtnSTR :string = ""

//   let VoucherTotal = 0
//    const HeaderLedger = STR2XML(HeaderLedger)
//    const sGUID = STR2XML("AVSolutions-" + PurchaseReturnData.VoucherTypeName + "-" + PurchaseReturnData.VoucherDate + "-" + PurchaseReturnData.VoucherNumber)
  
    if(PurchaseReturnData.Action == "DELETE" ) {
      rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + PurchaseReturnData.VoucherTypeName + `" ACTION="` + PurchaseReturnData.Action + `">`
      rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
      rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
      rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + PurchaseReturnData.VoucherTypeName + "</VOUCHERTYPENAME>"
      rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + PurchaseReturnData.VoucherNumber + "</VOUCHERNUMBER>"
      rtnSTR = rtnSTR + "</VOUCHER>"
      return rtnSTR
    }
      
    rtnSTR = rtnSTR + `<VOUCHER REMOTEID="` + sGUID + `" VCHTYPE="` + PurchaseReturnData.VoucherTypeName + `" ACTION="` + PurchaseReturnData.Action + `" OBJVIEW="` + PurchaseReturnData.VoucherInvoiceView + `">`
    if(PurchaseReturnData.HeaderAddress && PurchaseReturnData.HeaderAddress.length > 0) {
      rtnSTR = rtnSTR + `<ADDRESS.LIST TYPE="String">`
      for (let i = 0; i < PurchaseReturnData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<ADDRESS>" + this.STR2XML(PurchaseReturnData.HeaderAddress[i]) + "</ADDRESS>"
      }
      rtnSTR = rtnSTR + "</ADDRESS.LIST>"              
      rtnSTR = rtnSTR + `<BASICBUYERADDRESS.LIST TYPE="String">`
      for (let i = 0; i < PurchaseReturnData.HeaderAddress.length; i++) {
        rtnSTR = rtnSTR + "<BASICBUYERADDRESS>" + this.STR2XML(PurchaseReturnData.HeaderAddress[i]) + "</BASICBUYERADDRESS>"
      }
      rtnSTR = rtnSTR + "</BASICBUYERADDRESS.LIST>"
    }    
    rtnSTR = rtnSTR + "<DATE>" + VchrDate + "</DATE>"
    rtnSTR = rtnSTR + "<GUID>" + sGUID + "</GUID>"
    rtnSTR = rtnSTR + "<NARRATION>" + PurchaseReturnData.Narration +"</NARRATION>"
    rtnSTR = rtnSTR + "<VOUCHERTYPENAME>" + PurchaseReturnData.VoucherTypeName + "</VOUCHERTYPENAME>"
    rtnSTR = rtnSTR + "<VOUCHERNUMBER>" + PurchaseReturnData.VoucherNumber + "</VOUCHERNUMBER>"
    if(PurchaseReturnData.VoucherRef != "" ) rtnSTR = rtnSTR + "<REFERENCE>" + PurchaseReturnData.VoucherRef + "</REFERENCE>"
    rtnSTR = rtnSTR + "<PARTYLEDGERNAME>" + PurchaseReturnData.HeaderLedger + "</PARTYLEDGERNAME>"
    rtnSTR = rtnSTR + "<PERSISTEDVIEW>" + PurchaseReturnData.VoucherInvoiceView + "</PERSISTEDVIEW>"
    rtnSTR = rtnSTR + "<VCHENTRYMODE>"  + PurchaseReturnData.VoucherEntryMode + "</VCHENTRYMODE>"

//'            rtnSTR = rtnSTR + "<AUDITED>No</AUDITED>"
//'            rtnSTR = rtnSTR + "<FORJOBCOSTING>No</FORJOBCOSTING>"
    rtnSTR = rtnSTR + "<ISOPTIONAL>No</ISOPTIONAL>"
    rtnSTR = rtnSTR + "<EFFECTIVEDATE>" + VchrDate + "</EFFECTIVEDATE>"
    rtnSTR = rtnSTR + "<ALTERID> 4</ALTERID>"
    rtnSTR = rtnSTR + "<ISINVOICE>Yes</ISINVOICE>"
    rtnSTR = rtnSTR + "<ISDELETED>No</ISDELETED>"
    rtnSTR = rtnSTR + "<MASTERID> 1</MASTERID>"
    rtnSTR = rtnSTR + "<VOUCHERKEY>" + sGUID + "</VOUCHERKEY>"
    if(PurchaseReturnData.StateName) rtnSTR = rtnSTR + "<STATENAME>" + this.STR2XML(PurchaseReturnData.StateName) + "</STATENAME>"
    if(PurchaseReturnData.GSTRegistrationType) rtnSTR = rtnSTR + "<GSTREGISTRATIONTYPE>" + this.STR2XML(PurchaseReturnData.GSTRegistrationType) + "</GSTREGISTRATIONTYPE>"
    if(PurchaseReturnData.PartyGSTNo) rtnSTR = rtnSTR + "<PARTYGSTIN>" + this.STR2XML(PurchaseReturnData.PartyGSTNo) + "</PARTYGSTIN>"
    if(PurchaseReturnData.VoucherTypeClass ) rtnSTR = rtnSTR + "<CLASSNAME>" + this.STR2XML(PurchaseReturnData.VoucherTypeClass) + "</CLASSNAME>"
    rtnSTR = rtnSTR + "<BASICBASEPARTYNAME>" + PurchaseReturnData.HeaderLedger + "</BASICBASEPARTYNAME>"
          
//    'Get the Total of the Bill
//    '==============================
    PurchaseReturnData.InventoryEntriesData.forEach(InventoryEntry => {
      VoucherTotal += InventoryEntry.LineAmount
    });
    PurchaseReturnData.LedgerEntriesData.forEach(LedgerEntry => {
      VoucherTotal += LedgerEntry.LineAmount
    });


//  'Add LedgerEntry for Party
//  '==============================
    rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
    rtnSTR = rtnSTR + "  <LEDGERNAME>" + PurchaseReturnData.HeaderLedger + "</LEDGERNAME>"
    rtnSTR = rtnSTR + "  <GSTCLASS/>"
    rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
    rtnSTR = rtnSTR + "  <ISPARTYLEDGER>Yes</ISPARTYLEDGER>"
    rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>"
    rtnSTR = rtnSTR + "  <AMOUNT>-" + VoucherTotal + "</AMOUNT>"     
    rtnSTR = rtnSTR + " <BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "   <NAME>" + PurchaseReturnData.VoucherNumber + "</NAME>"
    rtnSTR = rtnSTR + "   <BILLTYPE>New Ref</BILLTYPE>"
    rtnSTR = rtnSTR + "   <AMOUNT>-" + VoucherTotal + "</AMOUNT>"
//'                rtnSTR = rtnSTR + "   <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>"
//'                rtnSTR = rtnSTR + "   <STBILLCATEGORIES.LIST>        </STBILLCATEGORIES.LIST>"
    rtnSTR = rtnSTR + " </BILLALLOCATIONS.LIST>"
    rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"

    //  'Add LedgerEntries for Non Item Accounts
    //  '=========================================
    PurchaseReturnData.LedgerEntriesData.forEach(LedgerEntry => {
      rtnSTR = rtnSTR + "<LEDGERENTRIES.LIST>"
    //      '                rtnSTR = rtnSTR + "  <ROUNDTYPE>Normal Rounding</ROUNDTYPE>"
      rtnSTR = rtnSTR + "  <LEDGERNAME>" + this.STR2XML(LedgerEntry.LedgerName) + "</LEDGERNAME>"
      rtnSTR = rtnSTR + "  <METHODTYPE>GST</METHODTYPE>"
      rtnSTR = rtnSTR + "  <GSTCLASS/>"
      rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
      rtnSTR = rtnSTR + "  <LEDGERFROMITEM>No</LEDGERFROMITEM>"
    //      '                rtnSTR = rtnSTR + "  <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
      rtnSTR = rtnSTR + "  <ISPARTYLEDGER>No</ISPARTYLEDGER>"
      rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
    //      '                rtnSTR = rtnSTR + "       <ROUNDLIMIT> 1</ROUNDLIMIT>"                    
      rtnSTR = rtnSTR + "  <AMOUNT>" + Math.abs(LedgerEntry.LineAmount) + "</AMOUNT>"
      rtnSTR = rtnSTR + "</LEDGERENTRIES.LIST>"      
    });


    //    'Add Inventory Entries
    //    '=========================================
    if(PurchaseReturnData.InventoryEntriesData.length == 0 ) {
      rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>      </ALLINVENTORYENTRIES.LIST>"      
    } else {
      PurchaseReturnData.InventoryEntriesData.forEach(InventoryEntry => {
        rtnSTR = rtnSTR + "<ALLINVENTORYENTRIES.LIST>"
        rtnSTR = rtnSTR + "  <STOCKITEMNAME>" + this.STR2XML(InventoryEntry.StockName) + "</STOCKITEMNAME>"
        rtnSTR = rtnSTR + "  <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "  <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
    //            '                rtnSTR = rtnSTR + "       <ISAUTONEGATE>No</ISAUTONEGATE>"
    //            '                rtnSTR = rtnSTR + "       <ISCUSTOMSCLEARANCE>No</ISCUSTOMSCLEARANCE>"
    //            '                rtnSTR = rtnSTR + "       <ISTRACKCOMPONENT>No</ISTRACKCOMPONENT>"
    //            '                rtnSTR = rtnSTR + "       <ISTRACKPRODUCTION>No</ISTRACKPRODUCTION>"
    //            '                rtnSTR = rtnSTR + "       <ISPRIMARYITEM>No</ISPRIMARYITEM>"
    //            '                rtnSTR = rtnSTR + "       <ISSCRAP>No</ISSCRAP>"
        rtnSTR = rtnSTR + "  <RATE>" + InventoryEntry.Rate + "/" + this.STR2XML(InventoryEntry.UOM) + "</RATE>"
        rtnSTR = rtnSTR + "  <AMOUNT>" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "  <ACTUALQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "  <BILLEDQTY>" + InventoryEntry.Qty + " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  <BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <GODOWNNAME>Main Location</GODOWNNAME>"
        rtnSTR = rtnSTR + "    <BATCHNAME>Primary Batch</BATCHNAME>"
        rtnSTR = rtnSTR + "    <INDENTNO/>"
        rtnSTR = rtnSTR + "    <ORDERNO/>"
        rtnSTR = rtnSTR + "    <TRACKINGNUMBER/>"
    //            '                rtnSTR = rtnSTR + "        <DYNAMICCSTISCLEARED>No</DYNAMICCSTISCLEARED>"
        rtnSTR = rtnSTR + "    <AMOUNT>" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <ACTUALQTY>" + InventoryEntry.Qty +  " " + this.STR2XML(InventoryEntry.UOM) + "</ACTUALQTY>"
        rtnSTR = rtnSTR + "    <BILLEDQTY>" + InventoryEntry.Qty +  " " + this.STR2XML(InventoryEntry.UOM) + "</BILLEDQTY>"
        rtnSTR = rtnSTR + "  </BATCHALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "  <ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "    <LEDGERNAME>" + this.STR2XML(InventoryEntry.LedgerName) + "</LEDGERNAME>"
    //      '                rtnSTR = rtnSTR + "        <CLASSRATE>100.00000</CLASSRATE>"
    //      '                rtnSTR = rtnSTR + "        <GSTCLASS/>"
    //      '                rtnSTR = rtnSTR + "        <GSTOVRDNCLASSIFICATION>Item Rate Having Less Than 1000</GSTOVRDNCLASSIFICATION>"
    //      '                rtnSTR = rtnSTR + "        <GSTOVRDNINELIGIBLEITC> Not Applicable</GSTOVRDNINELIGIBLEITC>"
    //      '                rtnSTR = rtnSTR + "        <GSTOVRDNISREVCHARGEAPPL> Not Applicable</GSTOVRDNISREVCHARGEAPPL>"
        rtnSTR = rtnSTR + "    <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>"
    //            '                rtnSTR = rtnSTR + "        <LEDGERFROMITEM>No</LEDGERFROMITEM>"
        rtnSTR = rtnSTR + "    <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>"
        rtnSTR = rtnSTR + "    <ISPARTYLEDGER>No</ISPARTYLEDGER>"
        rtnSTR = rtnSTR + "    <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>"
        rtnSTR = rtnSTR + "    <AMOUNT>" + InventoryEntry.LineAmount + "</AMOUNT>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "      <GSTRATEDUTYHEAD>Integrated Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Central Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>State Tax</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "    <RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + "       <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>"
        rtnSTR = rtnSTR + "    </RATEDETAILS.LIST>"
        rtnSTR = rtnSTR + " </ACCOUNTINGALLOCATIONS.LIST>"
        rtnSTR = rtnSTR + "</ALLINVENTORYENTRIES.LIST>"
      });  
    }                            
    rtnSTR = rtnSTR + "</VOUCHER>"
    rtnSTR = this.hdrXML + rtnSTR + this.bottomXML
    return rtnSTR
  }



};


