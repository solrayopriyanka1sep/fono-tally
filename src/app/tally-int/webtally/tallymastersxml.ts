//import { LedgerEntries } from "./ledgerEntries"
import {LedgerInfo, StockGroupInfo, ItemInfo, COSTINGMETHOD, GSTAPPLICABLE, TAXABILITY, TALLYGROUP, VoucherTypeInfo } from "./tallyInterfaces"
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class  TallyMastersXML {
    XMLHeadImportMasters :string = `<ENVELOPE>
                              <HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>
                              <BODY>
                                <IMPORTDATA>
                                  <REQUESTDESC>
                                    <REPORTNAME>All Masters</REPORTNAME>
                                    <STATICVARIABLES>
                                      <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                                    </STATICVARIABLES>
                                  </REQUESTDESC>
                                  <REQUESTDATA>`
    XMLHeadImportVouchers:string = `<ENVELOPE>
                            <HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>
                            <BODY>
                              <IMPORTDATA>
                                <REQUESTDESC>
                                  <REPORTNAME>VOUCHERS</REPORTNAME>
                                  <STATICVARIABLES>
                                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                                  </STATICVARIABLES>
                                </REQUESTDESC>
                                <REQUESTDATA>`
    XMLBottomImport:string = `   </REQUESTDATA>
                         </IMPORTDATA>
                       </BODY>
                      </ENVELOPE>`

    XMLHeadExport:string = `<ENVELOPE>
                      <HEADER>
                        <TALLYREQUEST>Export Data</TALLYREQUEST>
                      </HEADER>
                      <BODY>
                        <EXPORTDATA>`
    XMLBottomExport:string = `</EXPORTDATA>
                      </BODY>
                    </ENVELOPE>`
    
    constructor() {
           
    }

    private pad2(n:number):string { 
      return n < 10 ? '0' + n.toString() : n.toString() 
    }

    XmlName(strName:string):string {
      let sRtnVal:string = ""
      if(strName != "") {
        sRtnVal = strName.replace(/&/g, "&amp;")
        sRtnVal = sRtnVal.replace(/'/g, "&apos;") 
        sRtnVal = sRtnVal.replace(/"/g, "&quot;")
        sRtnVal = sRtnVal.trim()
      }
      return sRtnVal
    }

    GetCompaniesXML():string {
        const rtnVal:string = `<ENVELOPE>
        <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>List of Companies</ID>
        </HEADER>
        <BODY>
        <DESC>
        <TDL>
        <TDLMESSAGE>
        <REPORT NAME="List of Companies" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
        <FORMS>List of Companies</FORMS>
        </REPORT>
        <FORM NAME="List of Companies" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
        <TOPPARTS>List of Companies</TOPPARTS>
        <XMLTAG>"List of Companies"</XMLTAG>
        </FORM>
        <PART NAME="List of Companies" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
        <TOPLINES>List of Companies</TOPLINES>
        <REPEAT>List of Companies : Collection of Companies</REPEAT>
        <SCROLLED>Vertical</SCROLLED>
        </PART>
        <LINE NAME="List of Companies" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
        <LEFTFIELDS>Name</LEFTFIELDS>
        </LINE>
        <FIELD NAME="Name" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
        <SET>$Name</SET>
        <XMLTAG>"NAME"</XMLTAG>
        </FIELD>        
        <COLLECTION NAME="Collection of Companies" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
        <TYPE>Company</TYPE>
        </COLLECTION>
        </TDLMESSAGE>
        </TDL>
        </DESC>
        </BODY>
        </ENVELOPE>`
        return rtnVal         
    }

    GetCurrentCompanyXML():string {
        const strRtnVal:string = `
        <ENVELOPE>
        <HEADER>
            <VERSION>1</VERSION>
            <TALLYREQUEST>Export</TALLYREQUEST>
            <TYPE>Data</TYPE>
            <ID>AVSGETCOREPORT</ID>
        </HEADER>
        <BODY>
        <DESC>
        <STATICVARIABLES>
            <EXPLODEFLAG>Yes</EXPLODEFLAG>
            <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        </STATICVARIABLES>
        <TDL>
            <TDLMESSAGE>
                <REPORT NAME="AVSGETCOREPORT" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                <FORMS>AVSGETCOFORM</FORMS>
                </REPORT>
                <FORM NAME="AVSGETCOFORM" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                    <TOPPARTS>AVSGETCOPART</TOPPARTS>
                </FORM>
                <PART NAME="AVSGETCOPART" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                <TOPLINES>AVSGETCOLINE</TOPLINES>
                <SCROLLED>Vertical</SCROLLED>
                </PART>
                <LINE NAME="AVSGETCOLINE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                <LEFTFIELDS>AVSGETCOFLD</LEFTFIELDS>
                </LINE>
                <FIELD NAME="AVSGETCOFLD" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                    <SET>##SVCurrentCompany</SET>
                </FIELD>
            </TDLMESSAGE>
        </TDL>
        </DESC>
        </BODY>
        </ENVELOPE>`
        return strRtnVal
    }

    GetTSerialXML():string {
        const strRtnVal:string = `
          <ENVELOPE>
              <HEADER>
                <VERSION>1</VERSION>
                <TALLYREQUEST>Export</TALLYREQUEST>
                <TYPE>Data</TYPE>
                <ID>AVSGETSERIALRPT</ID>
              </HEADER>
              <BODY>
                <DESC>
                    <STATICVARIABLES>
                        <EXPLODEFLAG>Yes</EXPLODEFLAG>
                        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                    </STATICVARIABLES>
                    <TDL>
                      <TDLMESSAGE>
                          <REPORT NAME="AVSGETSERIALRPT" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <FORMS>AVSGETSERIALFORM</FORMS>
                          </REPORT>
                          <FORM NAME="AVSGETSERIALFORM" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                              <TOPPARTS>AVSGETSERIALPART</TOPPARTS>
                          </FORM>
                          <PART NAME="AVSGETSERIALPART" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <TOPLINES>AVSGETSERIALLN</TOPLINES>
                            <SCROLLED>Vertical</SCROLLED>
                          </PART>
                          <LINE NAME="AVSGETSERIALLN" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <LEFTFIELDS>AVSGETSERIALFLD</LEFTFIELDS>
                          </LINE>
                          <FIELD NAME="AVSGETSERIALFLD" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                              <SET>$$LicenseInfo:SerialNumber</SET>
                          </FIELD>
                        </TDLMESSAGE>
                    </TDL>
                </DESC>
              </BODY>
          </ENVELOPE>`        
        return strRtnVal
    }    


//=========================================================================
// Ledger Groups
//=========================================================================
    GetGroupsXML():string {       

      const strRtnVal:string = `<ENVELOPE>
      <HEADER>
          <VERSION>1</VERSION>
          <TALLYREQUEST>Export</TALLYREQUEST>
          <TYPE>Collection</TYPE>
          <ID>AVSGroups</ID>
      </HEADER>
        <BODY>
            <DESC>
                <STATICVARIABLES>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
                <TDL>
                    <TDLMESSAGE>
                        <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVSGroups">
                            <TYPE>Groups</TYPE>                                                 
                            <NATIVEMETHOD>Parent</NATIVEMETHOD>
                            <NATIVEMETHOD>IsRevenue</NATIVEMETHOD>
                            <NATIVEMETHOD>GUID</NATIVEMETHOD>
                            <COMPUTE>GroupName : $Name[1].Name</COMPUTE>
                            <COMPUTE>Alias : $$alias:ledger</COMPUTE>
                        </COLLECTION>
                    </TDLMESSAGE>
                </TDL>
            </DESC>
        </BODY>
        </ENVELOPE>`

      const strRtnVal_old:string = `
        <ENVELOPE>
            <HEADER>
                <VERSION>1</VERSION>
                <TALLYREQUEST>Export</TALLYREQUEST>
                <TYPE>Collection</TYPE>
                <ID>List of Groups</ID>
            </HEADER>
            <BODY>
              <DESC>
                <STATICVARIABLES>
                    <EXPLODEFLAG>Yes</EXPLODEFLAG>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
              </DESC>
            </BODY>
        </ENVELOPE>`
      return strRtnVal
    }

    GroupCreateModifyXML(GrpName:string,  TallyGroup:TALLYGROUP=TALLYGROUP.Non_Tally_Group , ModifiedName:string ="", GroupUnder:string = "" , GrpId:string ="", GrpAlias:string="" ) {
      ModifiedName = ModifiedName != "" ? ModifiedName : GrpName
      ModifiedName = this.XmlName(ModifiedName)
      GrpName = this.XmlName(GrpName)
      
      GroupUnder = this.XmlName(GroupUnder)
      GroupUnder = (TallyGroup != TALLYGROUP.Non_Tally_Group) ? GroupUnder = TallyGroup  : this.XmlName(GroupUnder) 
      const guid = GrpId != "" ? "<GUID>AVS-Frono-Group-" + GrpId + "</GUID>" : ""
      const alias = GrpAlias != "" ? `<NAME>${GrpAlias}</NAME>` : ""

      const XMLstr:string = this.XMLHeadImportMasters + 
          `<TALLYMESSAGE xmlns:UDF="TallyUDF">
            <GROUP NAME="${GrpName}" >
              ${guid}
              <NAME.LIST>
                <NAME>${ModifiedName}</NAME>
                ${alias}
              </NAME.LIST>
              <PARENT>${GroupUnder}</PARENT>
            </GROUP>
          </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr
    }

/*
    GroupModifyXML(GrpOldName:string, GrpNewName:string = "", TallyGroup:TALLYGROUP = TALLYGROUP.Non_Tally_Group, GroupUnder:string = ""):string {
      //Blank Parameter Means No Changes
      GrpOldName = this.XmlName(GrpOldName)
      GrpNewName = this.XmlName(GrpNewName)

      GroupUnder = (TallyGroup != TALLYGROUP.Non_Tally_Group) ? GroupUnder = TallyGroup  : this.XmlName(GroupUnder) 

      const XMLstr:string = this.XMLHeadImportMasters +
              `<TALLYMESSAGE xmlns:UDF="TallyUDF">
                <GROUP NAME="${GrpOldName}" >
                  <NAME.LIST>
                    <NAME>${GrpNewName}</NAME>
                  </NAME.LIST>
                  <PARENT>${GroupUnder }</PARENT>
                </GROUP>
              </TALLYMESSAGE>`
            + this.XMLBottomImport

      return XMLstr
    }
*/

    GroupDeleteXML(GrpName:string):string {
      GrpName = this.XmlName(GrpName)
      const XMLstr = this.XMLHeadImportMasters +
            `<TALLYMESSAGE xmlns:UDF="TallyUDF">
              <GROUP NAME="${GrpName}" ACTION="DELETE">
                <NAME.LIST>
                  <NAME>${GrpName}</NAME>
                </NAME.LIST>
              </GROUP>
            </TALLYMESSAGE> `
            + this.XMLBottomImport

      return XMLstr
    }


//=========================================================================
//    ' Ledgers
//=========================================================================
    GetLedgersXML():string {
        const strRtnVal:string = `<ENVELOPE>
                            <HEADER>
                                <VERSION>1</VERSION>
                                <TALLYREQUEST>Export</TALLYREQUEST>
                                <TYPE>Collection</TYPE>
                                <ID>Ledgers</ID>
                            </HEADER>
                              <BODY>
                                  <DESC>
                                      <STATICVARIABLES>
                                          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                                      </STATICVARIABLES>
                                      <TDL>
                                          <TDLMESSAGE>
                                              <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Ledgers">
                                                  <TYPE>Ledger</TYPE>                                                 
                                                  <NATIVEMETHOD>Address</NATIVEMETHOD>
                                                  <NATIVEMETHOD>Parent</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>PinCode</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>LedStateName</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>CountryName</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>Email</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>LedgerPhone</NATIVEMETHOD>
                                                  <NATIVEMETHOD>LedgerMobile</NATIVEMETHOD>  
                                                  <NATIVEMETHOD>LedgerFax</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>LedgerContact</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>IncomeTaxNumber</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>PartyGSTIN</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>GSTApplicable</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>GSTRegistrationType</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>TaxType</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>GSTType</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>GSTDutyHead</NATIVEMETHOD>
                                                  <NATIVEMETHOD>GSTTypeOfSupply</NATIVEMETHOD>
                                                  <NATIVEMETHOD>RoundingMethod</NATIVEMETHOD>
                                                  <NATIVEMETHOD>RoundingLimit</NATIVEMETHOD>
                                                  <NATIVEMETHOD>IsBillwiseOn</NATIVEMETHOD>                                                  
                                                  <NATIVEMETHOD>IsCostCentresOn</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>IsInterestOn</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>AffectsStock</NATIVEMETHOD> 
                                                  <NATIVEMETHOD>_PrimaryGroup</NATIVEMETHOD>
                                                  <COMPUTE>LedgerName : $Name[1].Name</COMPUTE>
                                                  <COMPUTE>Alias : $$alias:ledger</COMPUTE>
                                                  <COMPUTE>ADDRESS1 : $Address[1].Address</COMPUTE>
                                                  <COMPUTE>ADDRESS2 : $Address[2].Address</COMPUTE>
                                                  <COMPUTE>ADDRESS3 : $Address[3].Address</COMPUTE>
                                                  <COMPUTE>ADDRESS4 : $Address[4].Address</COMPUTE>
                                                  <COMPUTE>MAILNAME : $MAILINGNAME[1].MAILINGNAME</COMPUTE>
                                              </COLLECTION>
                                              <SYSTEM TYPE="Formulae" NAME="LedgerName">$Name</SYSTEM>                                              
                                          </TDLMESSAGE>
                                      </TDL>
                                  </DESC>
                              </BODY>
                              </ENVELOPE>`

//                                         <NATIVEMETHOD>*</NATIVEMETHOD> 

          const strRtnVal_notinUse:string = `<ENVELOPE>
          <HEADER>
              <VERSION>1</VERSION>
              <TALLYREQUEST>Export</TALLYREQUEST>
              <TYPE>Collection</TYPE>
              <ID>Ledger</ID>
          </HEADER>
          <BODY>
            <DESC>
              <STATICVARIABLES>
                  <EXPLODEFLAG>Yes</EXPLODEFLAG>
                  <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
              </STATICVARIABLES>
            </DESC>
          </BODY>
          </ENVELOPE>`

        const strRtnVal_notinuse1:string = `<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST>
               <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <TYPE>Data</TYPE>
                <ID>AVSGETLEDLIST</ID>
             </HEADER>
             <BODY><DESC><TDL><TDLMESSAGE>
                <COLLECTION NAME="AVClnLedgers" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                  <TYPE>Ledger</TYPE>
                  <FETCH>*</FETCH>
                </COLLECTION>
                <REPORT NAME="AVSGETLEDLIST" >
                  <FORMS>AVSGETLEDLISTFRM</FORMS>
                </REPORT>
                <FORM NAME="AVSGETLEDLISTFRM" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                  <TOPPARTS>AVSGETLEDLISTPRT</TOPPARTS>
                </FORM>
                <PART NAME="AVSGETLEDLISTPRT" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                <TOPLINES>AVSGETLEDLISTLN</TOPLINES>
                <REPEAT>AVSGETLEDLISTLN : AVClnLedgers</REPEAT>
                <SCROLLED>Vertical</SCROLLED>
             </PART>
             <LINE NAME="AVSGETLEDLISTLN" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
              <LEFTFIELDS>FLDNAME</LEFTFIELDS>
              <LEFTFIELDS>FLDALIAS</LEFTFIELDS>
              <LEFTFIELDS>FLDGROUP</LEFTFIELDS>
              <LEFTFIELDS>FLDOPBAL</LEFTFIELDS>
              <LEFTFIELDS>FLDADDR1</LEFTFIELDS>
              <LEFTFIELDS>FLDADDR2</LEFTFIELDS>
              <LEFTFIELDS>FLDADDR3</LEFTFIELDS>
              <LEFTFIELDS>FLDADDR4</LEFTFIELDS>
              <LEFTFIELDS>FLDADDR5</LEFTFIELDS>
              <LEFTFIELDS>FLDPIN</LEFTFIELDS>
              <LEFTFIELDS>FLDSTATE</LEFTFIELDS>
              <LEFTFIELDS>FLDCOUNTRY</LEFTFIELDS>
              <LEFTFIELDS>FLDEMAIL</LEFTFIELDS>
              <LEFTFIELDS>FLDMAILNAME</LEFTFIELDS>
              <LEFTFIELDS>FLDPAN</LEFTFIELDS>
              <LEFTFIELDS>FLDGSTNO</LEFTFIELDS>
              <LEFTFIELDS>FLDGSTAPPLICABLE</LEFTFIELDS>
              <LEFTFIELDS>FLDGSTREGTYPE</LEFTFIELDS>
              <LEFTFIELDS>FLDTAXTYPE</LEFTFIELDS>
              <LEFTFIELDS>FLDGSTTYPE</LEFTFIELDS>
              <LEFTFIELDS>FLDGSTDUTY</LEFTFIELDS>
              <LEFTFIELDS>FLDGSTSUPPLYTYPE</LEFTFIELDS>
              <LEFTFIELDS>FLDROUNDMETHOD</LEFTFIELDS>
              <LEFTFIELDS>FLDROUNDLIMIT</LEFTFIELDS>
              <LEFTFIELDS>FLDISBILLWISE</LEFTFIELDS>
              <LEFTFIELDS>FLDISCOSTCENT</LEFTFIELDS>
              <LEFTFIELDS>FLDISINTEREST</LEFTFIELDS>
              <LEFTFIELDS>FLDAFFECTSTOCK</LEFTFIELDS>
              <LEFTFIELDS>FLDPRIMEGROUP</LEFTFIELDS>
          </LINE>
                        <FIELD NAME="FLDNAME" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Name</SET>
                      </FIELD>
                     <FIELD NAME="FLDALIAS" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$$Alias</SET>
                      </FIELD>
                     <FIELD NAME="FLDGROUP" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Parent</SET>
                      </FIELD>
                     <FIELD NAME="FLDOPBAL" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$OpeningBalance</SET>
                      </FIELD>
                     <FIELD NAME="FLDADDR1" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Address[1].Address</SET>
                      </FIELD>
                     <FIELD NAME="FLDADDR2" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Address[2].Address</SET>
                      </FIELD>
                     <FIELD NAME="FLDADDR3" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Address[3].Address</SET>
                      </FIELD>
                     <FIELD NAME="FLDADDR4" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Address[4].Address</SET>
                      </FIELD>
                     <FIELD NAME="FLDADDR5" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Address[5].Address</SET>
                      </FIELD>
                     <FIELD NAME="FLDPIN" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$PinCode</SET>
                      </FIELD>
                     <FIELD NAME="FLDSTATE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$LedStateName</SET>
                      </FIELD>
                     <FIELD NAME="FLDCOUNTRY" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$CountryName</SET>
                      </FIELD>
                     <FIELD NAME="FLDEMAIL" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$Email</SET>
                      </FIELD>
                     <FIELD NAME="FLDMAILNAME" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$MailingName</SET>
                      </FIELD>
                     <FIELD NAME="FLDPAN" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$IncomeTaxNumber</SET>
                      </FIELD>
                     <FIELD NAME="FLDGSTNO" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$PartyGSTIN</SET>
                      </FIELD>
                     <FIELD NAME="FLDGSTAPPLICABLE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$GSTApplicable</SET>
                      </FIELD>
                     <FIELD NAME="FLDGSTREGTYPE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$GSTRegistrationType</SET>
                      </FIELD>
                     <FIELD NAME="FLDTAXTYPE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$TaxType</SET>
                      </FIELD>
                     <FIELD NAME="FLDGSTTYPE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$GSTType</SET>
                      </FIELD>
                     <FIELD NAME="FLDGSTDUTY" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$GSTDutyHead</SET>
                      </FIELD>
                     <FIELD NAME="FLDGSTSUPPLYTYPE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$GSTTypeOfSupply</SET>
                      </FIELD>
                     <FIELD NAME="FLDROUNDMETHOD" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$RoundingMethod</SET>
                      </FIELD>
                     <FIELD NAME="FLDROUNDLIMIT" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$RoundingLimit</SET>
                      </FIELD>
                     <FIELD NAME="FLDISBILLWISE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$IsBillwiseOn</SET>
                      </FIELD>
                     <FIELD NAME="FLDISCOSTCENT" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$IsCostCentresOn</SET>
                      </FIELD>
                     <FIELD NAME="FLDISINTEREST" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$IsInterestOn</SET>
                      </FIELD>
                     <FIELD NAME="FLDAFFECTSTOCK" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$AffectsStock</SET>
                      </FIELD>
                     <FIELD NAME="FLDPRIMEGROUP" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                        <SET>$_PrimaryGroup</SET>
                      </FIELD>                        
                      </TDLMESSAGE>
                   </TDL>
                </DESC>
             </BODY>
          </ENVELOPE>`

        return strRtnVal
    }
    
    //LedgerName||Group||ModifiedName||Alias||Opening Balance||Address1||Address2||Address3||Address4||Address5||PINCode||State||Country||email||ContactPerson||PANNo||GSTINNo||GSTApplicable||GSTRegistrationType||TaxType||GSTType||GST Duty||GSTSupplyType||RoundingMethod||Roundinglimit||IsBillwise||CostCenterOn||IsInterestOn||AffectStock||SAC/HSNcode
    // Use JSON  
    CreateModifyLedgerXML(LedInfo:LedgerInfo , isModify:boolean = false, ModifiedName:string ="" ):string {
        LedInfo.LedName = this.XmlName(LedInfo.LedName)
        LedInfo.LedGroup = this.XmlName(LedInfo.LedGroup)
        if(ModifiedName) ModifiedName = this.XmlName(ModifiedName)
        if(LedInfo.AliasName) LedInfo.AliasName = this.XmlName(LedInfo.AliasName)
        if(LedInfo.Add1) LedInfo.Add1 = this.XmlName(LedInfo.Add1)
        if(LedInfo.Add2) LedInfo.Add2 = this.XmlName(LedInfo.Add2)
        if(LedInfo.Add3) LedInfo.Add3 = this.XmlName(LedInfo.Add3)
        if(LedInfo.Add4) LedInfo.Add4 = this.XmlName(LedInfo.Add4)
        if(LedInfo.Add5) LedInfo.Add5 = this.XmlName(LedInfo.Add5)

        if(LedInfo.State) LedInfo.State = this.XmlName(LedInfo.State)
        if(LedInfo.Country) LedInfo.Country = this.XmlName(LedInfo.Country)
        if(LedInfo.Email) LedInfo.Email = this.XmlName(LedInfo.Email)
        if(LedInfo.ContactPerson)  LedInfo.ContactPerson = this.XmlName(LedInfo.ContactPerson)

        if(LedInfo.GSTRegistrationType ) LedInfo.GSTRegistrationType = this.XmlName(LedInfo.GSTRegistrationType)
        LedInfo.TaxType = !LedInfo.TaxType ?  TAXABILITY.Unkonwn  : LedInfo.TaxType

        if(LedInfo.GSTType ) LedInfo.GSTType = this.XmlName(LedInfo.GSTType)
        if(LedInfo.GSTSupplyType )  LedInfo.GSTSupplyType = this.XmlName(LedInfo.GSTSupplyType)
        if(LedInfo.SAC_HSNcode ) LedInfo.SAC_HSNcode = this.XmlName(LedInfo.SAC_HSNcode)
        
        const guid = LedInfo.Id != "" ? "<GUID>AVS-Frono-Accounts-" + LedInfo.Id + "</GUID>" : ""
        let XMLstr = this.XMLHeadImportMasters + 
                `<TALLYMESSAGE xmlns:UDF="TallyUDF">
                  <LEDGER NAME="${LedInfo.LedName}">
                    ${guid}
                    <NAME.LIST>`
              
        XMLstr = XMLstr + `<NAME>` + ( isModify && ModifiedName != ""   ? ModifiedName : LedInfo.LedName) + `</NAME>`
        if( (!LedInfo.AliasName || LedInfo.AliasName == "" ) == false )  XMLstr = XMLstr + `<NAME>${LedInfo.AliasName}</NAME>`

        XMLstr = XMLstr + "</NAME.LIST>"

        const completeAddress = (!LedInfo.Add1 ? "" : LedInfo.Add1) +
                                (!LedInfo.Add2 ? "" : LedInfo.Add2) +
                                (!LedInfo.Add3 ? "" : LedInfo.Add3) +
                                (!LedInfo.Add4 ? "" : LedInfo.Add4) +
                                (!LedInfo.Add5 ? "" : LedInfo.Add5)

        if(completeAddress != "" ){
          XMLstr = XMLstr + "<ADDRESS.LIST>"
          if(!(!LedInfo.Add1)) XMLstr = XMLstr + "<ADDRESS>" + LedInfo.Add1 + "</ADDRESS>"
          if(!(!LedInfo.Add2)) XMLstr = XMLstr + "<ADDRESS>" + LedInfo.Add2 + "</ADDRESS>"
          if(!(!LedInfo.Add3)) XMLstr = XMLstr + "<ADDRESS>" + LedInfo.Add3 + "</ADDRESS>"
          if(!(!LedInfo.Add4)) XMLstr = XMLstr + "<ADDRESS>" + LedInfo.Add4 + "</ADDRESS>"
          if(!(!LedInfo.Add5)) XMLstr = XMLstr + "<ADDRESS>" + LedInfo.Add5 + "</ADDRESS>"
          XMLstr = XMLstr + "</ADDRESS.LIST>"
        }

        XMLstr = XMLstr + "<PARENT>" + LedInfo.LedGroup + "</PARENT>"
        if(!(!LedInfo.OpBal)) XMLstr = XMLstr + "<OPENINGBALANCE>" + LedInfo.OpBal?.toString() + "</OPENINGBALANCE>"
        if(!(!LedInfo.Email)) XMLstr = XMLstr + "<EMAIL>" + LedInfo.Email + "</EMAIL>"
          //'      <LEDGERPHONE>022-21022063,267551748,09322593980</LEDGERPHONE>
        if(!(!LedInfo.ContactPerson)) XMLstr = XMLstr + "<LEDGERCONTACT>" + LedInfo.ContactPerson + "</LEDGERCONTACT>"
        if(!(!LedInfo.PINCode)) XMLstr = XMLstr + "<PINCODE>" + LedInfo.PINCode + "</PINCODE>"
        if(!(!LedInfo.PANNo)) XMLstr = XMLstr + "<INCOMETAXNUMBER>" + LedInfo.PANNo + "</INCOMETAXNUMBER>"
        if(!(!LedInfo.Country)) XMLstr = XMLstr + "<COUNTRYNAME>" + LedInfo.Country + "</COUNTRYNAME>"
        if(!(!LedInfo.GSTRegistrationType)) XMLstr = XMLstr + "<GSTREGISTRATIONTYPE>" + LedInfo.GSTRegistrationType + "</GSTREGISTRATIONTYPE>"
        if(!(!LedInfo.TaxType)) XMLstr = XMLstr + "<TAXTYPE>" + LedInfo.TaxType + "</TAXTYPE>"
        if(!(!LedInfo.Country)) XMLstr = XMLstr + "<COUNTRYOFRESIDENCE>" + LedInfo.Country + "</COUNTRYOFRESIDENCE>"
        XMLstr = XMLstr + "<GSTTYPE/>"

/*              
          '      <GSTTYPEOFSUPPLY>Goods</GSTTYPEOFSUPPLY>
          '      <GSTDETAILS.LIST>
          '       <APPLICABLEFROM>20170701</APPLICABLEFROM>
          '       <HSNMASTERNAME/>
          '       <TAXABILITY>Taxable</TAXABILITY>
          '       <GSTNATUREOFTRANSACTION>Purchase Taxable</GSTNATUREOFTRANSACTION>
          '       <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
          '       <ISNONGSTGOODS>No</ISNONGSTGOODS>
          '       <GSTINELIGIBLEITC>No</GSTINELIGIBLEITC>
          '       <STATEWISEDETAILS.LIST>
          '        <STATENAME>&#4; Any</STATENAME>
          '        <RATEDETAILS.LIST>
          '         <GSTRATEDUTYHEAD>Central Tax</GSTRATEDUTYHEAD>
          '         <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
          '         <GSTRATE> 5</GSTRATE>
          '        </RATEDETAILS.LIST>
          '        <RATEDETAILS.LIST>
          '         <GSTRATEDUTYHEAD>State Tax</GSTRATEDUTYHEAD>
          '         <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
          '         <GSTRATE> 5</GSTRATE>
          '        </RATEDETAILS.LIST>
          '        <RATEDETAILS.LIST>
          '         <GSTRATEDUTYHEAD>Integrated Tax</GSTRATEDUTYHEAD>
          '         <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
          '         <GSTRATE> 10</GSTRATE>
          '        </RATEDETAILS.LIST>
          '        <RATEDETAILS.LIST>
          '         <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>
          '         <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
          '        </RATEDETAILS.LIST>
          '        <GSTSLABRATES.LIST>        </GSTSLABRATES.LIST>
          '       </STATEWISEDETAILS.LIST>
          '       <TEMPGSTDETAILSLABRATES.LIST>       </TEMPGSTDETAILSLABRATES.LIST>
          '      </GSTDETAILS.LIST>
*/

//if(!(!LedInfo.Country)) XMLstr = XMLstr + "<COUNTRYOFRESIDENCE>" + LedInfo.Country + "</COUNTRYOFRESIDENCE>"

        if(!(!LedInfo.GSTINNo)) XMLstr = XMLstr + "<PARTYGSTIN>" + LedInfo.GSTINNo + "</PARTYGSTIN>"
          //'     <SERVICECATEGORY>&#4; Not Applicable</SERVICECATEGORY>"
        if(!(!LedInfo.State)) XMLstr = XMLstr + "<LEDSTATENAME>" + LedInfo.State + "</LEDSTATENAME>"
        if(!(!LedInfo.IsBillwise)) XMLstr = XMLstr + "<ISBILLWISEON>" + (LedInfo.IsBillwise ? "Yes" : "No") + "</ISBILLWISEON>"
        if(!(!LedInfo.CostCenterOn)) XMLstr = XMLstr + "<ISCOSTCENTRESON>" + (LedInfo.CostCenterOn ? "Yes" : "No") + "</ISCOSTCENTRESON>"
        if(!(!LedInfo.IsInterestOn)) XMLstr = XMLstr + "<ISINTERESTON>" + (LedInfo.IsInterestOn ? "Yes" : "No") + "</ISINTERESTON>"
        if(!(!LedInfo.AffectStock)) XMLstr = XMLstr + "<AFFECTSSTOCK>" + (LedInfo.AffectStock ? "Yes" : "No") + "</AFFECTSSTOCK>"
          //'     <FORPAYROLL>No</FORPAYROLL>"
         // '     <ISCREDITDAYSCHKON>No</ISCREDITDAYSCHKON>"
          //'     <ISCHEQUEPRINTINGENABLED>Yes</ISCHEQUEPRINTINGENABLED>"
        XMLstr = XMLstr + "<ISINPUTCREDIT>No</ISINPUTCREDIT>"
        XMLstr = XMLstr + "<ISEXEMPTED>No</ISEXEMPTED>"

            /*
          '      <GSTDETAILS.LIST>      </GSTDETAILS.LIST>
          '      <LANGUAGENAME.LIST>
          '       <NAME.LIST TYPE="String">
          '        <NAME>Aar Sons</NAME>
          '       </NAME.LIST>
          '       <LANGUAGEID> 1033</LANGUAGEID>
          '      </LANGUAGENAME.LIST>                
          '      <BILLALLOCATIONS.LIST>
          '       <BILLDATE>20170331</BILLDATE>
          '       <NAME>Aaaa</NAME>
          '       <BILLCREDITPERIOD JD="42824" P="31-Mar-2017">31-Mar-2017</BILLCREDITPERIOD>
          '       <ISADVANCE>No</ISADVANCE>
          '       <OPENINGBALANCE>-5000.00</OPENINGBALANCE>
          '       <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
          '      </BILLALLOCATIONS.LIST>                
          '      <GSTCLASSFNIGSTRATES.LIST>      </GSTCLASSFNIGSTRATES.LIST>
              */

            XMLstr = XMLstr + "</LEDGER>"
            XMLstr = XMLstr + "      </TALLYMESSAGE>"
            XMLstr = XMLstr + this.XMLBottomImport
      
      return XMLstr
    }
    
    LedgerDeleteXML(LedName:string):string {
        LedName = this.XmlName(LedName)
        const XMLstr = this.XMLHeadImportMasters +
          `<TALLYMESSAGE xmlns:UDF="TallyUDF">
            <LEDGER NAME="${LedName}" ACTION="DELETE">
              <NAME.LIST>
                <NAME>${LedName}</NAME>
              </NAME.LIST>
            </LEDGER>
          </TALLYMESSAGE>` +  this.XMLBottomImport        
        return XMLstr
    }
    

//=========================================================================
// UOM
//=========================================================================
    GetUOMsXML():string {

      const strRtnVal:string = `<ENVELOPE>
      <HEADER>
          <VERSION>1</VERSION>
          <TALLYREQUEST>Export</TALLYREQUEST>
          <TYPE>Collection</TYPE>
          <ID>AVSUOMList</ID>
      </HEADER>
        <BODY>
            <DESC>
                <STATICVARIABLES>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
                <TDL>
                    <TDLMESSAGE>
                        <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVSUOMList">
                            <TYPE>Unit</TYPE>                                                 
                            <NATIVEMETHOD>OriginalName</NATIVEMETHOD>
                            <NATIVEMETHOD>IsSimpleUnit</NATIVEMETHOD> 
                            <NATIVEMETHOD>DecimalPlaces</NATIVEMETHOD>                                                         
                            <COMPUTE>UnitName : $Name[1].Name</COMPUTE>
                            <COMPUTE>Alias : $$alias:Unit</COMPUTE>
                        </COLLECTION>
                    </TDLMESSAGE>
                </TDL>
            </DESC>
        </BODY>
        </ENVELOPE>`

        const strRtnVal_old = `<ENVELOPE>
            <HEADER>
               <VERSION>1</VERSION>
               <TALLYREQUEST>Export</TALLYREQUEST>
               <TYPE>Data</TYPE>
               <ID>AVSRptUOMList</ID>
            </HEADER>
            <BODY>
               <DESC>
                  <TDL>
                     <TDLMESSAGE>           
                        <REPORT NAME="AVSRptUOMList" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <FORMS>List of UOMs</FORMS>
                        </REPORT>
                        <FORM NAME="List of UOMs" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <TOPPARTS>List of UOMs</TOPPARTS>
                           <XMLTAG>"List of UOMs"</XMLTAG>
                        </FORM>
                        <PART NAME="List of UOMs" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <TOPLINES>List of UOMs</TOPLINES>
                           <REPEAT>List of UOMs : AVCUOMlist</REPEAT>
                           <SCROLLED>Vertical</SCROLLED>
                        </PART>
                        <LINE NAME="List of UOMs" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <XMLTAG>"ITEMDATA"</XMLTAG>
                            <LEFTFIELDS>FLDSYMBOL</LEFTFIELDS>
                            <LEFTFIELDS>FLDFORMALNAME</LEFTFIELDS>
                            <LEFTFIELDS>FLDTYPE</LEFTFIELDS>
                            <LEFTFIELDS>FLDUQC</LEFTFIELDS>
                            <LEFTFIELDS>FLDDECIMAL</LEFTFIELDS>
                        </LINE>        
                        <FIELD NAME="FLDSYMBOL" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <SET>$Name</SET>
                           <XMLTAG>"SYMBOL"</XMLTAG>
                         </FIELD>
                        <FIELD NAME="FLDFORMALNAME" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <SET>$OriginalName</SET>
                           <XMLTAG>"FORMALNAME"</XMLTAG>
                         </FIELD>
                        <FIELD NAME="FLDTYPE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <SET>$IsSimpleUnit</SET>
                           <XMLTAG>"TYPE"</XMLTAG>
                         </FIELD>
        
                        <FIELD NAME="FLDUQC" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <SET>$GSTRepUOM</SET>
                           <XMLTAG>"UQC"</XMLTAG>
                         </FIELD>
        
                        <FIELD NAME="FLDDECIMAL" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <SET>$DecimalPlaces</SET>
                           <XMLTAG>"DECIMAL"</XMLTAG>
                         </FIELD>
        
                         <COLLECTION NAME="AVCUOMlist" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <TYPE>Unit</TYPE>
                             <FETCH>*</FETCH>
                         </COLLECTION>
                    
                     </TDLMESSAGE>
                  </TDL>
               </DESC>
            </BODY>
         </ENVELOPE>`
    
        return strRtnVal
    }
    
    CreateModifyUOMXML(UOMid:string, UOMName:string, isModify:boolean=false, ModifiedId:string="",  GSTUOM:string = "" ):string {
      GSTUOM = GSTUOM == "" ?  UOMid.toUpperCase() + "-" + UOMName.toUpperCase() : GSTUOM
      GSTUOM = this.XmlName(GSTUOM) 
      
      UOMid = this.XmlName(UOMid)
      UOMName = this.XmlName(UOMName)
      ModifiedId = isModify && ModifiedId != "" ? ModifiedId : UOMid
      
      const XMLstr:string = this.XMLHeadImportMasters + 
              `<TALLYMESSAGE xmlns:UDF="TallyUDF">
              <UNIT NAME="${UOMid}" RESERVEDNAME="">
              <NAME>${ModifiedId}</NAME>
              <ORIGINALNAME>${UOMName}</ORIGINALNAME>
              <GSTREPUOM>${GSTUOM}</GSTREPUOM>
              <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
              <ISDELETED>No</ISDELETED>
              <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
              <ASORIGINAL>Yes</ASORIGINAL>
              <ISGSTEXCLUDED>No</ISGSTEXCLUDED>
              <ISSIMPLEUNIT>Yes</ISSIMPLEUNIT>
              </UNIT>
            </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr
    }

/*    
    ModifyUOMXML(UOMid:string, UOMName:string, modfiedUOMid:string ="", GSTUOM:string = "" ):string {
      UOMid = this.XmlName(UOMid)
      UOMName = this.XmlName(UOMName)
      modfiedUOMid = modfiedUOMid == "" ?  UOMid : this.XmlName(modfiedUOMid)

      const XMLstr:string = this.XMLHeadImportMasters + 
              `<TALLYMESSAGE xmlns:UDF="TallyUDF">
              <UNIT NAME="${UOMid}" RESERVEDNAME="">
              <NAME>${modfiedUOMid}</NAME>
              <ORIGINALNAME>${UOMName}</ORIGINALNAME>
              <GSTREPUOM>${GSTUOM}</GSTREPUOM>
              <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
              <ISDELETED>No</ISDELETED>
              <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
              <ASORIGINAL>Yes</ASORIGINAL>
              <ISGSTEXCLUDED>No</ISGSTEXCLUDED>
              <ISSIMPLEUNIT>Yes</ISSIMPLEUNIT>
              </UNIT>
            </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr

    }
*/

    DeleteUOMXML(UOMid:string):string {
      const XMLstr:string = this.XMLHeadImportMasters + 
            `<TALLYMESSAGE xmlns:UDF="TallyUDF">
              <UNIT NAME="${UOMid}" ACTION="DELETE">
              <NAME.LIST>
                <NAME>${UOMid}</NAME>
              </NAME.LIST>
              </UNIT>
             </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr
    }


//=========================================================================
// Locations / Godowns
//=========================================================================
  GetLocationsXML():string {  
    const strRtnVal:string = `<ENVELOPE>
                                <HEADER>
                                    <VERSION>1</VERSION>
                                    <TALLYREQUEST>Export</TALLYREQUEST>
                                    <TYPE>Collection</TYPE>
                                    <ID>AVSGodowns</ID>
                                </HEADER>
                                  <BODY>
                                      <DESC>
                                          <STATICVARIABLES>
                                              <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                                          </STATICVARIABLES>
                                          <TDL>
                                              <TDLMESSAGE>
                                                  <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVSGodowns">
                                                      <TYPE>Godown</TYPE>                                                 
                                                      <NATIVEMETHOD>Parent</NATIVEMETHOD> 
                                                      <NATIVEMETHOD>TaxUnitName</NATIVEMETHOD> 
                                                      <NATIVEMETHOD>IsExternal</NATIVEMETHOD> 
                                                      <NATIVEMETHOD>IsInternal</NATIVEMETHOD> 
                                                      <COMPUTE>LocationName : $Name[1].Name</COMPUTE>
                                                      <COMPUTE>Alias : $$alias:godown</COMPUTE>
                                                      <COMPUTE>ADDRESS1 : $Address[1].Address</COMPUTE>
                                                      <COMPUTE>ADDRESS2 : $Address[2].Address</COMPUTE>
                                                      <COMPUTE>ADDRESS3 : $Address[3].Address</COMPUTE>
                                                      <COMPUTE>ADDRESS4 : $Address[4].Address</COMPUTE>
                                                  </COLLECTION>
                                              </TDLMESSAGE>
                                          </TDL>
                                      </DESC>
                                  </BODY>
                                  </ENVELOPE>`
      return strRtnVal
  }

  CreateModifyLocationXML(LocationName:string, isModify:boolean = false, ModifiedName:string="",  Parent:string = "", Alias:string ="", Add1:string ="", Add2:string ="", Add3: string ="", isExternal:boolean =false, isInternal:boolean = true) :string {
    LocationName = this.XmlName(LocationName)
    ModifiedName = this.XmlName(ModifiedName)
    Parent = this.XmlName(Parent)
    Alias = this.XmlName(Alias)
    Add1 = this.XmlName(Add1)
    Add2 = this.XmlName(Add2)
    Add3 = this.XmlName(Add3)

    ModifiedName = isModify && ModifiedName != "" ? ModifiedName : LocationName
    Parent = Parent == "" ? "Main Location" : Parent
    const external:string = isExternal ? "Yes" : "No"
    const internal:string = isInternal ? "Yes" : "No"

    let XMLstr:string = this.XMLHeadImportMasters + 
      `<TALLYMESSAGE xmlns:UDF="TallyUDF">
        <GODOWN NAME="${LocationName}" RESERVEDNAME="">
          <LANGUAGENAME.LIST>
            <NAME.LIST TYPE="String">
              <NAME>${ModifiedName}</NAME>`
      if(Alias != "") XMLstr = XMLstr + `<NAME>${Alias}</NAME>`
      XMLstr = XMLstr +
            `</NAME.LIST>
            <LANGUAGEID> 1033</LANGUAGEID>
          </LANGUAGENAME.LIST>`
      if(Add1 + Add2 + Add3 != "" ) {
        XMLstr = XMLstr +  `<ADDRESS.LIST TYPE="String">`
        if(Add1 != "" ) XMLstr = XMLstr + `<ADDRESS>${Add1}</ADDRESS>`
        if(Add2 != "" ) XMLstr = XMLstr + `<ADDRESS>${Add2}</ADDRESS>`
        if(Add3 != "" ) XMLstr = XMLstr + `<ADDRESS>${Add3}</ADDRESS>`
        XMLstr = XMLstr +  `</ADDRESS.LIST>`
      }  
      XMLstr = XMLstr +  `<PARENT>${Parent}</PARENT>
          <EXCISEREGISTRATIONTYPE/>
          <EXCISEMAILINGNAME>${LocationName}</EXCISEMAILINGNAME>
          <TAXUNITNAME/>
          <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
          <ISDELETED>No</ISDELETED>
          <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
          <ASORIGINAL>Yes</ASORIGINAL>
          <ISEXTERNAL>${external}</ISEXTERNAL>
          <ISINTERNAL>${internal}</ISINTERNAL>
          <ISPRIMARYEXCISEUNIT>No</ISPRIMARYEXCISEUNIT>
          <ALLOWEXPORTREBATE>No</ALLOWEXPORTREBATE>
          <ISTRADERRGNUMBERON>No</ISTRADERRGNUMBERON>
        </GODOWN>
      </TALLYMESSAGE>` 
     + this.XMLBottomImport
    return XMLstr
  }

  DeleteLocationXML(LocationName:string):string {
    const XMLstr:string = this.XMLHeadImportMasters + 
      `<TALLYMESSAGE xmlns:UDF="TallyUDF">
        <GODOWN NAME="${LocationName}" ACTION="DELETE">
          <NAME.LIST>
            <NAME>${LocationName}</NAME>
          </NAME.LIST>
        </GODOWN>
      </TALLYMESSAGE>` + this.XMLBottomImport
    return XMLstr
  }


//=========================================================================
// Cost Centers
//=========================================================================
    GetCostCentersXML():string {  
      const strRtnVal:string = `<ENVELOPE>
        <HEADER>
            <VERSION>1</VERSION>
            <TALLYREQUEST>Export</TALLYREQUEST>
            <TYPE>Collection</TYPE>
            <ID>AVSCostCenters</ID>
        </HEADER>
          <BODY>
              <DESC>
                  <STATICVARIABLES>
                      <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                  </STATICVARIABLES>
                  <TDL>
                      <TDLMESSAGE>
                          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVSCostCenters">
                              <TYPE>CostCenter</TYPE>
                              <NATIVEMETHOD>Parent</NATIVEMETHOD>
                              <NATIVEMETHOD>Category</NATIVEMETHOD>
                              <NATIVEMETHOD>ForJobCosting</NATIVEMETHOD> 
                              <NATIVEMETHOD>ForPayroll</NATIVEMETHOD> 
                              <COMPUTE>CostCenterName : $Name[1].Name</COMPUTE>
                              <COMPUTE>Alias : $$alias:costcenter</COMPUTE>
                          </COLLECTION>
                      </TDLMESSAGE>
                  </TDL>
              </DESC>
          </BODY>
          </ENVELOPE>`
      return strRtnVal
    }

    CreateModifyCostCenterXML(CostCenterName:string, isModify:boolean = false, ModifiedName:string="",  Parent:string = "", Alias:string ="", costCategory:string = "Primary Cost Category", isForPayroll:boolean = false, isForJobCosting:boolean = false):string {
      CostCenterName = this.XmlName(CostCenterName)
      ModifiedName = this.XmlName(ModifiedName)
      Parent = this.XmlName(Parent)
      Alias = this.XmlName(Alias)
      costCategory = this.XmlName(costCategory)
      const forPayroll:string = isForPayroll ? "Yes" : "No"
      const forJobCosting:string = isForJobCosting ? "Yes" : "No"

      ModifiedName = isModify && ModifiedName != "" ? ModifiedName : CostCenterName
    
      let XMLstr:string = this.XMLHeadImportMasters + 
            `<TALLYMESSAGE xmlns:UDF="TallyUDF">
            <COSTCENTRE NAME="${CostCenterName}" RESERVEDNAME="">
            <PARENT>${Parent}</PARENT>
            <CATEGORY>${costCategory}</CATEGORY>
            <REVENUELEDFOROPBAL>No</REVENUELEDFOROPBAL>
            <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
            <ISDELETED>No</ISDELETED>
            <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
            <ASORIGINAL>Yes</ASORIGINAL>
            <AFFECTSSTOCK>No</AFFECTSSTOCK>
            <FORPAYROLL>${forPayroll}</FORPAYROLL>
            <FORJOBCOSTING>${forJobCosting}</FORJOBCOSTING>
            <ISEMPLOYEEGROUP>No</ISEMPLOYEEGROUP>
            <LANGUAGENAME.LIST>
              <NAME.LIST TYPE="String">
              <NAME>${ModifiedName}</NAME>`

       if(Alias != "")  XMLstr = XMLstr + "<NAME>" + Alias + "</NAME>"
       XMLstr = XMLstr +
              `</NAME.LIST>
              <LANGUAGEID> 1033</LANGUAGEID>
            </LANGUAGENAME.LIST>
            </COSTCENTRE>
          </TALLYMESSAGE>`
        + this.XMLBottomImport
      return XMLstr
    }

    DeleteCostCenterXML(CostCenterName:string):string {
      const XMLstr:string = this.XMLHeadImportMasters + 
        `<TALLYMESSAGE xmlns:UDF="TallyUDF">
          <COSTCENTRE NAME="${CostCenterName}" ACTION="DELETE">
          <NAME.LIST>
            <NAME>${CostCenterName}</NAME>
          </NAME.LIST>
          </COSTCENTRE>
        </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr
    }

//=========================================================================
// Cost Categories
//=========================================================================
    GetCostCategoryXML():string {  
      const strRtnVal:string = `<ENVELOPE>
        <HEADER>
            <VERSION>1</VERSION>
            <TALLYREQUEST>Export</TALLYREQUEST>
            <TYPE>Collection</TYPE>
            <ID>AVSCostCategories</ID>
        </HEADER>
          <BODY>
              <DESC>
                  <STATICVARIABLES>
                      <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                  </STATICVARIABLES>
                  <TDL>
                      <TDLMESSAGE>
                          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVSCostCategories">
                              <TYPE>CostCategory</TYPE>
                              <NATIVEMETHOD>AllocateRevenue</NATIVEMETHOD> 
                              <NATIVEMETHOD>AllocateNonRevenue</NATIVEMETHOD> 
                              <COMPUTE>CostCategoryName : $Name[1].Name</COMPUTE>
                              <COMPUTE>Alias : $$alias:costcenter</COMPUTE>
                          </COLLECTION>
                      </TDLMESSAGE>
                  </TDL>
              </DESC>
          </BODY>
          </ENVELOPE>`
      return strRtnVal
    }

    CreateModifyCostCategoryXML(CostCategoryName:string, isModify:boolean = false, ModifiedName:string="", Alias:string ="", isRevenue:boolean = false, isNonRevenue:boolean = false):string {
      CostCategoryName = this.XmlName(CostCategoryName)
      ModifiedName = this.XmlName(ModifiedName)
      Alias = this.XmlName(Alias)
      const allocateRevenue:string = isRevenue ? "Yes" : "No"
      const allocateNonRevenue:string = isNonRevenue ? "Yes" : "No"
      ModifiedName = isModify && ModifiedName != "" ? ModifiedName : CostCategoryName

      let XMLstr:string = this.XMLHeadImportMasters + 
            ` <TALLYMESSAGE xmlns:UDF="TallyUDF">
            <COSTCATEGORY NAME="${CostCategoryName}" RESERVEDNAME="">
            <ISDELETED>No</ISDELETED>
            <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
            <ASORIGINAL>Yes</ASORIGINAL>
            <AFFECTSSTOCK>No</AFFECTSSTOCK>
            <ALLOCATEREVENUE>${allocateRevenue}</ALLOCATEREVENUE>
            <ALLOCATENONREVENUE>${allocateNonRevenue}</ALLOCATENONREVENUE>
            <LANGUAGENAME.LIST>
              <NAME.LIST TYPE="String">
              <NAME>${ModifiedName}</NAME>`
        if(Alias != "")  XMLstr = XMLstr + "<NAME>" + Alias + "</NAME>"
        XMLstr = XMLstr +       
              `</NAME.LIST>
              <LANGUAGEID> 1033</LANGUAGEID>
            </LANGUAGENAME.LIST>
            </COSTCATEGORY>
            </TALLYMESSAGE>`
            + this.XMLBottomImport
        return XMLstr
    }

    DeleteCostCategoryXML(CostCategoryName:string):string {
      const XMLstr:string = this.XMLHeadImportMasters + 
        `<TALLYMESSAGE xmlns:UDF="TallyUDF">
          <COSTCATEGORY NAME="${CostCategoryName}" ACTION="DELETE">
          <NAME.LIST>
            <NAME>${CostCategoryName}</NAME>
          </NAME.LIST>
          </COSTCATEGORY>
        </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr
    }


//=========================================================================
// Stock Groups
//=========================================================================
    GetStockGroupsXML():string {  
      const strRtnVal = `<ENVELOPE>
        <HEADER>
            <VERSION>1</VERSION>
            <TALLYREQUEST>Export</TALLYREQUEST>
            <TYPE>Collection</TYPE>
            <ID>AVS Stock Group</ID>
        </HEADER>
          <BODY>
              <DESC>
                  <STATICVARIABLES>
                      <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                  </STATICVARIABLES>
                  <TDL>
                      <TDLMESSAGE>
                          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVS Stock Group">
                              <TYPE>Stock Group</TYPE>
                              <COMPUTE>StockGroupName : $Name[1].Name</COMPUTE>
                              <COMPUTE>Alias : $Name[2].Name</COMPUTE>
                              <NATIVEMETHOD>Parent</NATIVEMETHOD> 
                              <NATIVEMETHOD>BaseUnits</NATIVEMETHOD> 
                              <NATIVEMETHOD>AdditionalUnits</NATIVEMETHOD> 
                          </COLLECTION>
                      </TDLMESSAGE>
                  </TDL>
              </DESC>
          </BODY>
          </ENVELOPE>`

      
        const strRtnVal_OLD = `
         <ENVELOPE>
            <HEADER>
               <VERSION>1</VERSION>
               <TALLYREQUEST>Export</TALLYREQUEST>
               <TYPE>Data</TYPE>
               <ID>AVSStkGrpList</ID>
            </HEADER>
            <BODY>
               <DESC>
                  <TDL>
                     <TDLMESSAGE>
                        <REPORT NAME="AVSStkGrpList" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <FORMS>AVSStkGrpList</FORMS>
                        </REPORT>
                        <FORM NAME="AVSStkGrpList" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <TOPPARTS>AVSStkGrpList</TOPPARTS>
                           <XMLTAG>"AVSStkGrpList"</XMLTAG>
                        </FORM>
                        <PART NAME="AVSStkGrpList" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <TOPLINES>AVSStkGrpList</TOPLINES>
                           <REPEAT>AVSStkGrpList : CLNAVSStkGrplist</REPEAT>
                           <SCROLLED>Vertical</SCROLLED>
                        </PART>
                        <LINE NAME="AVSStkGrpList" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <XMLTAG>"ITEMDATA"</XMLTAG>
                            <LEFTFIELDS>FldStkGrpName</LEFTFIELDS>
                            <LEFTFIELDS>FldStkGrpParent</LEFTFIELDS>
                        </LINE>
        
                        <FIELD NAME="FldStkGrpName" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <SET>$Name</SET>
                           <XMLTAG>"NAME"</XMLTAG>
                         </FIELD>
        
                        <FIELD NAME="FldStkGrpParent" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                           <SET>$Parent</SET>
                           <XMLTAG>"PARENT"</XMLTAG>
                         </FIELD>
        
                         <COLLECTION NAME="CLNAVSStkGrplist" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <TYPE>Stock Group</TYPE>
                             <FETCH>*</FETCH>
                             <FETCH>GSTDetails.*</FETCH>
                         </COLLECTION>
                                      
                     </TDLMESSAGE>
                  </TDL>
               </DESC>
            </BODY>
         </ENVELOPE>`
    
        return strRtnVal
    }
    
    CreateModifyStockGroupXML(StockGroup:StockGroupInfo, isModify:boolean = false, ModifiedName:string ="" ):string {
      StockGroup.StockGroupName = this.XmlName(StockGroup.StockGroupName)
      StockGroup.Parent = !StockGroup.Parent ? "":  this.XmlName(StockGroup.Parent)
      if(ModifiedName) ModifiedName = this.XmlName(ModifiedName)
      ModifiedName = isModify && ModifiedName != "" ? ModifiedName : StockGroup.StockGroupName

      if(StockGroup.Alias) StockGroup.Alias = this.XmlName(StockGroup.Alias)      
      StockGroup.isTaxabale = !StockGroup.isTaxabale ? false : true

      StockGroup.TaxType = !StockGroup.TaxType ?  TAXABILITY.Unkonwn  : StockGroup.TaxType

      let gstdate = "" 
      if(StockGroup.GstApplicableFrom) gstdate = StockGroup.GstApplicableFrom.getFullYear().toString() + 
                                                 this.pad2(StockGroup.GstApplicableFrom.getMonth() + 1) + 
                                                 this.pad2(StockGroup.GstApplicableFrom.getDate())
      gstdate = StockGroup.isTaxabale && !StockGroup.GstApplicableFrom ? "20100401" : gstdate
      if(StockGroup.isTaxabale) {
        if(StockGroup.HSC_SAC) StockGroup.HSC_SAC = this.XmlName(StockGroup.HSC_SAC)
        if(StockGroup.HSC_SAC_Descr) StockGroup.HSC_SAC_Descr = this.XmlName(StockGroup.HSC_SAC_Descr)        
      }

      let XMLstr:string = this.XMLHeadImportMasters + 
          `<TALLYMESSAGE xmlns:UDF="TallyUDF">
          <STOCKGROUP NAME="${StockGroup.StockGroupName}" RESERVEDNAME="">

          
          <PARENT>${StockGroup.Parent}</PARENT>          
          <COSTINGMETHOD>Avg. Cost</COSTINGMETHOD>
          <VALUATIONMETHOD>Avg. Price</VALUATIONMETHOD>
          <BASEUNITS/>
          <ADDITIONALUNITS/>
          <ISBATCHWISEON>No</ISBATCHWISEON>
          <ISPERISHABLEON>No</ISPERISHABLEON>
          <ISADDABLE>Yes</ISADDABLE>
          <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
          <ISDELETED>No</ISDELETED>
          <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
          <ASORIGINAL>Yes</ASORIGINAL>
          <IGNOREPHYSICALDIFFERENCE>No</IGNOREPHYSICALDIFFERENCE>
          <IGNORENEGATIVESTOCK>No</IGNORENEGATIVESTOCK>
          <TREATSALESASMANUFACTURED>No</TREATSALESASMANUFACTURED>
          <TREATPURCHASESASCONSUMED>No</TREATPURCHASESASCONSUMED>
          <TREATREJECTSASSCRAP>No</TREATREJECTSASSCRAP>
          <HASMFGDATE>No</HASMFGDATE>
          <ALLOWUSEOFEXPIREDITEMS>No</ALLOWUSEOFEXPIREDITEMS>
          <IGNOREBATCHES>No</IGNOREBATCHES>
          <IGNOREGODOWNS>No</IGNOREGODOWNS>
          <SERVICETAXDETAILS.LIST>      </SERVICETAXDETAILS.LIST>
          <VATDETAILS.LIST>      </VATDETAILS.LIST>
          <SALESTAXCESSDETAILS.LIST>      </SALESTAXCESSDETAILS.LIST>`

          //if(Alias != "")  XMLstr = XMLstr + "<NAME>" + Alias + "</NAME>"
          if(StockGroup.isTaxabale) {
            XMLstr = XMLstr + `<GSTDETAILS.LIST>
                  <APPLICABLEFROM>${gstdate}</APPLICABLEFROM>
                  <HSNCODE>${StockGroup.HSC_SAC}</HSNCODE>
                  <HSNMASTERNAME/>
                  <HSN>${StockGroup.HSC_SAC_Descr}</HSN>
                  <TAXABILITY>${StockGroup.TaxType}</TAXABILITY>
                  <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
                  <ISNONGSTGOODS>No</ISNONGSTGOODS>
                  <GSTINELIGIBLEITC>No</GSTINELIGIBLEITC>
                  <INCLUDEEXPFORSLABCALC>No</INCLUDEEXPFORSLABCALC>
                  <STATEWISEDETAILS.LIST>
                  <STATENAME>&#4; Any</STATENAME>
                  <RATEDETAILS.LIST>
                    <GSTRATEDUTYHEAD>Central Tax</GSTRATEDUTYHEAD>
                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                    <GSTRATE>${StockGroup.CGST_Rate?.toString()}</GSTRATE>
                  </RATEDETAILS.LIST>
                  <RATEDETAILS.LIST>
                    <GSTRATEDUTYHEAD>State Tax</GSTRATEDUTYHEAD>
                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                    <GSTRATE>${StockGroup.SGST_Rate?.toString()}</GSTRATE>
                  </RATEDETAILS.LIST>
                  <RATEDETAILS.LIST>
                    <GSTRATEDUTYHEAD>Integrated Tax</GSTRATEDUTYHEAD>
                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                    <GSTRATE>${StockGroup.IGST_Rate?.toString()}</GSTRATE>
                  </RATEDETAILS.LIST>
                  <RATEDETAILS.LIST>
                    <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>
                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                    <GSTRATE> 5</GSTRATE>
                  </RATEDETAILS.LIST>
                  <RATEDETAILS.LIST>
                    <GSTRATEDUTYHEAD>Cess on Qty</GSTRATEDUTYHEAD>
                    <GSTRATEVALUATIONTYPE>Based on Quantity</GSTRATEVALUATIONTYPE>
                  </RATEDETAILS.LIST>
                  <RATEDETAILS.LIST>
                    <GSTRATEDUTYHEAD>State Cess</GSTRATEDUTYHEAD>
                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                  </RATEDETAILS.LIST>
                  <GSTSLABRATES.LIST>        </GSTSLABRATES.LIST>
                  </STATEWISEDETAILS.LIST>
                  <TEMPGSTDETAILSLABRATES.LIST>       </TEMPGSTDETAILSLABRATES.LIST>
                </GSTDETAILS.LIST>`
          } 
          XMLstr = XMLstr + 
            `<LANGUAGENAME.LIST>
            <NAME.LIST TYPE="String">
            <NAME>${StockGroup.StockGroupName}</NAME>`
            if( !(!StockGroup.Alias) &&  StockGroup.Alias != "")  XMLstr = XMLstr + "<NAME>" + StockGroup.Alias + "</NAME>"
            XMLstr = XMLstr + 
                `</NAME.LIST>
                <LANGUAGEID> 1033</LANGUAGEID>
              </LANGUAGENAME.LIST>
              <SCHVIDETAILS.LIST>      </SCHVIDETAILS.LIST>
              <EXCISETARIFFDETAILS.LIST>      </EXCISETARIFFDETAILS.LIST>
              <TCSCATEGORYDETAILS.LIST>      </TCSCATEGORYDETAILS.LIST>
              <TDSCATEGORYDETAILS.LIST>      </TDSCATEGORYDETAILS.LIST>
              <GSTCLASSFNIGSTRATES.LIST>      </GSTCLASSFNIGSTRATES.LIST>
              <EXTARIFFDUTYHEADDETAILS.LIST>      </EXTARIFFDUTYHEADDETAILS.LIST>
              <TEMPGSTITEMSLABRATES.LIST>      </TEMPGSTITEMSLABRATES.LIST>
              </STOCKGROUP>
            </TALLYMESSAGE>`
        + this.XMLBottomImport
     return XMLstr
    }

    DeleteStockGroupXML(StockGroupName:string):string {
      const XMLstr:string = this.XMLHeadImportMasters + 
        `<TALLYMESSAGE xmlns:UDF="TallyUDF">
          <STOCKGROUP NAME="${StockGroupName}" ACTION="DELETE">
          <NAME.LIST>
            <NAME>${StockGroupName}</NAME>
          </NAME.LIST>
          </STOCKGROUP>
        </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr
    }
    
//=========================================================================
// Stock Categories
//=========================================================================
    GetStockCategoriesXML():string {  
      const strRtnVal = `<ENVELOPE>
      <HEADER>
          <VERSION>1</VERSION>
          <TALLYREQUEST>Export</TALLYREQUEST>
          <TYPE>Collection</TYPE>
          <ID>AVSStockCategroy</ID>
      </HEADER>
        <BODY>
            <DESC>
                <STATICVARIABLES>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
                <TDL>
                    <TDLMESSAGE>
                        <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVSStockCategroy">
                            <TYPE>Stock Category</TYPE>
                            <COMPUTE>StockCategoryName : $Name[1].Name</COMPUTE>
                            <COMPUTE>Alias : $Name[2].Name</COMPUTE>
                            <NATIVEMETHOD>Parent</NATIVEMETHOD> 
                            <NATIVEMETHOD>BaseUnits</NATIVEMETHOD> 
                            <NATIVEMETHOD>AdditionalUnits</NATIVEMETHOD> 
                        </COLLECTION>
                    </TDLMESSAGE>
                </TDL>
            </DESC>
        </BODY>
        </ENVELOPE>`
        return strRtnVal
    }

    CreateModifyStockCategoriesXML(StockCategoryName:string, isModify:boolean = false, ModifiedName:string ="", Alias:string="", Parent:string="" ):string {
      StockCategoryName = this.XmlName(StockCategoryName)
      ModifiedName = this.XmlName(ModifiedName)
      Alias = this.XmlName(Alias)
      ModifiedName = isModify && ModifiedName != "" ? ModifiedName : StockCategoryName

      let XMLstr:string = this.XMLHeadImportMasters + 
        `<TALLYMESSAGE xmlns:UDF="TallyUDF">
        <STOCKCATEGORY NAME="${StockCategoryName}" RESERVEDNAME="">
        <PARENT>${Parent}</PARENT>
         <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
         <ISDELETED>No</ISDELETED>
         <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
         <ASORIGINAL>Yes</ASORIGINAL>
         <LANGUAGENAME.LIST>
          <NAME.LIST TYPE="String">
           <NAME>${ModifiedName}</NAME>`
        if(Alias != "")  XMLstr = XMLstr + "<NAME>" + Alias + "</NAME>"
        XMLstr = XMLstr +       
          `</NAME.LIST>
          <LANGUAGEID> 1033</LANGUAGEID>
         </LANGUAGENAME.LIST>
        </STOCKCATEGORY>
       </TALLYMESSAGE>`
       + this.XMLBottomImport
      return XMLstr
    }


    DeleteStockCategoriesXML(StockCategoryName:string):string {
      const XMLstr:string = this.XMLHeadImportMasters + 
        `<TALLYMESSAGE xmlns:UDF="TallyUDF">
          <STOCKCATEGORY NAME="${StockCategoryName}" ACTION="DELETE">
          <NAME.LIST>
            <NAME>${StockCategoryName}</NAME>
          </NAME.LIST>
          </STOCKGROUP>
        </TALLYMESSAGE>` + this.XMLBottomImport
      return XMLstr
    }


    
//'=========================================================================
//' Stock Items
//'=========================================================================
    GetItemsXML(){
        const strRtnVal = `<ENVELOPE>
        <HEADER>
            <VERSION>1</VERSION>
            <TALLYREQUEST>Export</TALLYREQUEST>
            <TYPE>Collection</TYPE>
            <ID>AVS Stock Item</ID>
        </HEADER>
          <BODY>
              <DESC>
                  <STATICVARIABLES>
                      <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                  </STATICVARIABLES>
                  <TDL>
                      <TDLMESSAGE>
                          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVS Stock Item">
                              <TYPE>StockItem</TYPE>
                              <COMPUTE>StockName : $Name[1].Name</COMPUTE>
                              <COMPUTE>Alias : $Name[2].Name</COMPUTE>
                              <COMPUTE>PartNumber : $MailingName[1].MailingName</COMPUTE>
                              <NATIVEMETHOD>Parent</NATIVEMETHOD>
                              <NATIVEMETHOD>BaseUnits</NATIVEMETHOD>
                              <NATIVEMETHOD>AdditionalUnits</NATIVEMETHOD> 
                              <NATIVEMETHOD>IsCostCenterOn</NATIVEMETHOD> 
                              <NATIVEMETHOD>IsBatchwiseOn</NATIVEMETHOD>                               
                              <NATIVEMETHOD>CostingMethod</NATIVEMETHOD>
                              <NATIVEMETHOD>OpeningBalance</NATIVEMETHOD>
                              <NATIVEMETHOD>OpeningValue</NATIVEMETHOD>
                              <NATIVEMETHOD>OpeningRate</NATIVEMETHOD>
                              <NATIVEMETHOD>GSTApplicable</NATIVEMETHOD>  
                              <NATIVEMETHOD>GSTTYPEOFSUPPLY</NATIVEMETHOD> 
                              <NATIVEMETHOD>VALUATIONMETHOD</NATIVEMETHOD> 
                              <COMPUTE>HSN_SAC_Code : $HSNCode[1].GSTDetails</COMPUTE>
                              <COMPUTE>CalculationType : $CalculationType[1].GSTDetails</COMPUTE>                              
                          </COLLECTION>
                      </TDLMESSAGE>
                  </TDL>
              </DESC>
          </BODY>
          </ENVELOPE>`
        

          const strRtnVal_old = `
          <ENVELOPE>
              <HEADER>
                <VERSION>1</VERSION>
                <TALLYREQUEST>Export</TALLYREQUEST>
                <TYPE>Data</TYPE>
                <ID>List of Items</ID>
              </HEADER>
              <BODY>
                <DESC>
                    <TDL>
                      <TDLMESSAGE>
                          <REPORT NAME="List of Items" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <FORMS>List of Items</FORMS>
                          </REPORT>
                          <FORM NAME="List of Items" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <TOPPARTS>List of Items</TOPPARTS>
                            <XMLTAG>"List of Items"</XMLTAG>
                          </FORM>
                          <PART NAME="List of Items" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <TOPLINES>List of Items</TOPLINES>
                            <REPEAT>List of Items : AVClnItems</REPEAT>
                            <SCROLLED>Vertical</SCROLLED>
                          </PART>
                          <LINE NAME="List of Items" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <XMLTAG>"ITEMDATA"</XMLTAG>
                              <LEFTFIELDS>FLDNAME</LEFTFIELDS>
                              <LEFTFIELDS>FLDGROUP</LEFTFIELDS>
                              <LEFTFIELDS>FLDOPBAL</LEFTFIELDS>
                              <LEFTFIELDS>FLDOPRATE</LEFTFIELDS>
                              <LEFTFIELDS>FLDOPVAL</LEFTFIELDS>
                              <LEFTFIELDS>FLDBASEUOM</LEFTFIELDS>
                              <LEFTFIELDS>FLDGSTAPPLICABLE</LEFTFIELDS>
                              <LEFTFIELDS>FLDGSTSUPPLYTYPE</LEFTFIELDS>
                          </LINE>
                          <FIELD NAME="FLDNAME" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$Name</SET>
                            <XMLTAG>"NAME"</XMLTAG>
                          </FIELD>
                          <FIELD NAME="FLDGROUP" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$Parent</SET>
                            <XMLTAG>"GROUP"</XMLTAG>
                          </FIELD>
                          <FIELD NAME="FLDOPBAL" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$OpeningBalance</SET>
                            <XMLTAG>"OPBAL"</XMLTAG>
                          </FIELD>
                          <FIELD NAME="FLDOPRATE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$OpeningRate</SET>
                            <XMLTAG>"OPRATE"</XMLTAG>
                          </FIELD>
                          <FIELD NAME="FLDOPVAL" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$OpeningValue</SET>
                            <XMLTAG>"OPVAL"</XMLTAG>
                          </FIELD>
                          <FIELD NAME="FLDBASEUOM" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$BaseUnits</SET>
                            <XMLTAG>"BASEUOM"</XMLTAG>
                          </FIELD>
                          <FIELD NAME="FLDGSTAPPLICABLE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$GSTApplicable</SET>
                            <XMLTAG>"GSTAPPLICABLE"</XMLTAG>
                          </FIELD>
                          <FIELD NAME="FLDGSTSUPPLYTYPE" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                            <SET>$GSTTypeOfSupply</SET>
                            <XMLTAG>"GSTSUPPLYTYPE"</XMLTAG>
                          </FIELD>
                          <COLLECTION NAME="AVClnItems" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
                              <TYPE>StockItem</TYPE>
                              <FETCH>*</FETCH>
                          </COLLECTION>
                      </TDLMESSAGE>
                    </TDL>
                </DESC>
              </BODY>
          </ENVELOPE>`
      
          return strRtnVal
    }
        
//  'ItemName||Item Group||Modified Name||Category||BaseUOM||OpeningQty||OpeningRate||OpeningValue||GSTApplicable||GSTTypeofSupply||GSTapplicablefrom||CalculationType||Taxability||GSTRate||isReversecharge||CostingMethod||IsPerishable||InclusiveofTax    
    CreateModifyItemXML(StockItemInfo:ItemInfo, isModify:boolean = false, ModifiedName:string ="" ):string {        
       
       if(StockItemInfo.Alias) StockItemInfo.Alias = StockItemInfo.Alias.trim().toUpperCase() ==  StockItemInfo.ItemName.trim().toUpperCase() ? "" : this.XmlName(StockItemInfo.Alias) 

        StockItemInfo.ItemName = this.XmlName(StockItemInfo.ItemName)
        StockItemInfo.BaseUOM = this.XmlName(StockItemInfo.BaseUOM)
        if(ModifiedName) ModifiedName = this.XmlName(ModifiedName)
        ModifiedName = isModify && ModifiedName != "" ? ModifiedName : StockItemInfo.ItemName
  
        
        StockItemInfo.Parent = !StockItemInfo.Parent ? "" : this.XmlName(StockItemInfo.Parent)
        StockItemInfo.Category = !StockItemInfo.Category ? "" : this.XmlName(StockItemInfo.Category)

      
        if(StockItemInfo.ItemDescription) StockItemInfo.ItemDescription = this.XmlName(StockItemInfo.ItemDescription)
        StockItemInfo.CostingMethod = !StockItemInfo.CostingMethod ?  COSTINGMETHOD.AverageCost  : StockItemInfo.CostingMethod

        StockItemInfo.TaxType = !StockItemInfo.TaxType ?  TAXABILITY.Unkonwn  : StockItemInfo.TaxType

        const Perishable:string = StockItemInfo.isPerishable ? "Yes" : "No"
        const InclusiveOfTax:string = StockItemInfo.isInclusiveOfTax ? "Yes" : "No"
        const ReverseCharge:string = StockItemInfo.isReverseCharge ? "Yes" : "No"
        
        StockItemInfo.GSTApplicable = !StockItemInfo.GSTApplicable ? false : true
        const strGSTApplicable = StockItemInfo.GSTApplicable ? GSTAPPLICABLE.Applicable : GSTAPPLICABLE.NotApplicable
        
        let gstdate = "" 
        if(StockItemInfo.GstApplicableFrom) gstdate = StockItemInfo.GstApplicableFrom.getFullYear().toString() + 
                                                   this.pad2(StockItemInfo.GstApplicableFrom.getMonth() + 1) + 
                                                   this.pad2(StockItemInfo.GstApplicableFrom.getDate())
        gstdate = StockItemInfo.GSTApplicable && !StockItemInfo.GstApplicableFrom ? "20100401" : gstdate
        if(StockItemInfo.GSTApplicable) {
          if(StockItemInfo.GSTTypeofSupply) StockItemInfo.GSTTypeofSupply = this.XmlName(StockItemInfo.GSTTypeofSupply)
          if(StockItemInfo.HSC_SAC) StockItemInfo.HSC_SAC = this.XmlName(StockItemInfo.HSC_SAC)
          if(StockItemInfo.HSC_SAC_Descr) StockItemInfo.HSC_SAC_Descr = this.XmlName(StockItemInfo.HSC_SAC_Descr)
          if(StockItemInfo.GSTValuationType) StockItemInfo.GSTValuationType = this.XmlName(StockItemInfo.GSTValuationType)
        }
  
        StockItemInfo.OpeningQty = !StockItemInfo.OpeningQty ? 0 : StockItemInfo.OpeningQty
        StockItemInfo.OpeningRate =  !StockItemInfo.OpeningRate ? 0 : StockItemInfo.OpeningRate
        StockItemInfo.OpeningValue = StockItemInfo.OpeningQty * StockItemInfo.OpeningRate
        StockItemInfo.CGST_Rate = !StockItemInfo.CGST_Rate ? 0 : StockItemInfo.CGST_Rate
        StockItemInfo.SGST_Rate = !StockItemInfo.SGST_Rate ? 0 : StockItemInfo.SGST_Rate
        StockItemInfo.IGST_Rate = !StockItemInfo.IGST_Rate ? 0 : StockItemInfo.IGST_Rate


        let XMLstr = this.XMLHeadImportMasters
        XMLstr = XMLstr + `<TALLYMESSAGE xmlns:UDF="TallyUDF">`
        XMLstr = XMLstr + ` <STOCKITEM NAME="` + StockItemInfo.ItemName + `" RESERVEDNAME="">`            
        XMLstr = XMLstr + "<NAME.LIST>"
        XMLstr = XMLstr + `<NAME>` + ModifiedName + `</NAME>`

        if((!(!StockItemInfo.Alias)) || StockItemInfo.Alias != ""  ) {
          XMLstr = XMLstr + `<NAME>${StockItemInfo.Alias}</NAME>`
        }                
        XMLstr = XMLstr + "</NAME.LIST>"
        XMLstr = XMLstr + "<PARENT>" + StockItemInfo.Parent + "</PARENT>" 
        XMLstr = XMLstr + "<CATEGORY>" + StockItemInfo.Category + "</CATEGORY>"
        XMLstr = XMLstr + "<GSTAPPLICABLE>" + strGSTApplicable + "</GSTAPPLICABLE>"
//    '      <TAXCLASSIFICATIONNAME/>
        XMLstr = XMLstr + "<GSTTYPEOFSUPPLY>" + StockItemInfo.GSTTypeofSupply + "</GSTTYPEOFSUPPLY>"
        XMLstr = XMLstr + "<COSTINGMETHOD>" + StockItemInfo.CostingMethod + "</COSTINGMETHOD>"
        XMLstr = XMLstr + "<VALUATIONMETHOD>Avg. Price</VALUATIONMETHOD>"
        XMLstr = XMLstr + "<BASEUNITS>" + StockItemInfo.BaseUOM + "</BASEUNITS>"
//    '    XMLstr = XMLstr & "      <ADDITIONALUNITS/>"          
//    '      <ISCOSTCENTRESON>No</ISCOSTCENTRESON>
//    '      <ISBATCHWISEON>No</ISBATCHWISEON>
        XMLstr = XMLstr + "<ISPERISHABLEON>" + Perishable + "</ISPERISHABLEON>"
        XMLstr = XMLstr + "<ISENTRYTAXAPPLICABLE>No</ISENTRYTAXAPPLICABLE>"
        XMLstr = XMLstr + "<ISCOSTTRACKINGON>No</ISCOSTTRACKINGON>"
        XMLstr = XMLstr + "<ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>"
//    '      <ASORIGINAL>Yes</ASORIGINAL>
//    '      <HASMFGDATE>No</HASMFGDATE>          
//    '      <ALLOWUSEOFEXPIREDITEMS>No</ALLOWUSEOFEXPIREDITEMS>
        XMLstr = XMLstr + "<IGNOREBATCHES>No</IGNOREBATCHES>"
        XMLstr = XMLstr + "<IGNOREGODOWNS>No</IGNOREGODOWNS>"
//    '      <CALCONMRP>No</CALCONMRP>
//    '      <EXCLUDEJRNLFORVALUATION>No</EXCLUDEJRNLFORVALUATION>
        XMLstr = XMLstr + "<ISMRPINCLOFTAX>No</ISMRPINCLOFTAX>"
//    '      <ISADDLTAXEXEMPT>No</ISADDLTAXEXEMPT>
//    '      <ISSUPPLEMENTRYDUTYON>No</ISSUPPLEMENTRYDUTYON>
        XMLstr = XMLstr + "<INCLUSIVETAX>" + InclusiveOfTax + "</INCLUSIVETAX>"
        XMLstr = XMLstr + "<MODIFYMRPRATE>No</MODIFYMRPRATE>"
        XMLstr = XMLstr + "<ALTERID> 3957</ALTERID>"
        XMLstr = XMLstr + "<DENOMINATOR> 1</DENOMINATOR>"
        XMLstr = XMLstr + "<OPENINGBALANCE>" + StockItemInfo.OpeningQty + " " + StockItemInfo.BaseUOM + "</OPENINGBALANCE>"
        XMLstr = XMLstr + "<OPENINGVALUE>-" + StockItemInfo.OpeningValue + "</OPENINGVALUE>"
        XMLstr = XMLstr + "<OPENINGRATE>" + StockItemInfo.OpeningRate + "/" + StockItemInfo.BaseUOM + "</OPENINGRATE>"
        XMLstr = XMLstr + "<GSTDETAILS.LIST>"
        XMLstr = XMLstr + "<APPLICABLEFROM>" + gstdate + "</APPLICABLEFROM>" 
        XMLstr = XMLstr + "<CALCULATIONTYPE>On Value</CALCULATIONTYPE>"
        XMLstr = XMLstr + "<HSNMASTERNAME/>"
        XMLstr = XMLstr + "<TAXABILITY>" + StockItemInfo.TaxType + "</TAXABILITY>"
        XMLstr = XMLstr + "<ISREVERSECHARGEAPPLICABLE>" + ReverseCharge + "</ISREVERSECHARGEAPPLICABLE>"
        XMLstr = XMLstr + "<ISNONGSTGOODS>No</ISNONGSTGOODS>"
        XMLstr = XMLstr + "<GSTINELIGIBLEITC>No</GSTINELIGIBLEITC>"
        XMLstr = XMLstr + "<STATEWISEDETAILS.LIST>"
        XMLstr = XMLstr + "<STATENAME>&#4; Any</STATENAME>"
        XMLstr = XMLstr + "<RATEDETAILS.LIST>"
        XMLstr = XMLstr + " <GSTRATEDUTYHEAD>Central Tax</GSTRATEDUTYHEAD>"
        XMLstr = XMLstr + " <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>"
        XMLstr = XMLstr + ` <GSTRATE>${StockItemInfo.CGST_Rate}</GSTRATE>`
        XMLstr = XMLstr + "</RATEDETAILS.LIST>"
        XMLstr = XMLstr + "<RATEDETAILS.LIST>"
        XMLstr = XMLstr + " <GSTRATEDUTYHEAD>State Tax</GSTRATEDUTYHEAD>"
        XMLstr = XMLstr + " <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>"
        XMLstr = XMLstr + ` <GSTRATE>${StockItemInfo.SGST_Rate}</GSTRATE>`
        XMLstr = XMLstr + "</RATEDETAILS.LIST>"
        XMLstr = XMLstr + "<RATEDETAILS.LIST>"
        XMLstr = XMLstr + " <GSTRATEDUTYHEAD>Integrated Tax</GSTRATEDUTYHEAD>"
        XMLstr = XMLstr + " <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>"
        XMLstr = XMLstr + ` <GSTRATE>${StockItemInfo.IGST_Rate}</GSTRATE>`
        XMLstr = XMLstr + "</RATEDETAILS.LIST>"
        XMLstr = XMLstr + "<RATEDETAILS.LIST>"
        XMLstr = XMLstr + " <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>"
        XMLstr = XMLstr + " <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>"
        XMLstr = XMLstr + "</RATEDETAILS.LIST>"
//    '        <GSTSLABRATES.LIST>        </GSTSLABRATES.LIST>
        XMLstr = XMLstr + "</STATEWISEDETAILS.LIST>"
//    '       <TEMPGSTDETAILSLABRATES.LIST>       </TEMPGSTDETAILSLABRATES.LIST>
        XMLstr = XMLstr + "</GSTDETAILS.LIST>"
//    '      <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
//    '      <MRPDETAILS.LIST>      </MRPDETAILS.LIST>
//    '      <VATCLASSIFICATIONDETAILS.LIST>      </VATCLASSIFICATIONDETAILS.LIST>
//    '      <COMPONENTLIST.LIST>      </COMPONENTLIST.LIST>
//    '      <SALESLIST.LIST>      </SALESLIST.LIST>
//    '      <PURCHASELIST.LIST>      </PURCHASELIST.LIST>
//    '      <FULLPRICELIST.LIST>      </FULLPRICELIST.LIST>
        XMLstr = XMLstr + " <BATCHALLOCATIONS.LIST>"
        XMLstr = XMLstr + " <GODOWNNAME>Main Location</GODOWNNAME>"
        XMLstr = XMLstr + " <BATCHNAME>Primary Batch</BATCHNAME>"
        XMLstr = XMLstr + " <OPENINGBALANCE>" + StockItemInfo.OpeningQty + " " + StockItemInfo.BaseUOM +  "</OPENINGBALANCE>"
        XMLstr = XMLstr + " <OPENINGVALUE>-" + StockItemInfo.OpeningValue + "</OPENINGVALUE>"
        XMLstr = XMLstr + " <OPENINGRATE>" + StockItemInfo.OpeningRate + "/" + StockItemInfo.BaseUOM + "</OPENINGRATE>"
        XMLstr = XMLstr + "</BATCHALLOCATIONS.LIST>"          
//    '      <STANDARDPRICELIST.LIST>
//    '       <DATE>20111214</DATE>
//    '       <RATE>300.83/pcs</RATE>
//    '      </STANDARDPRICELIST.LIST>
        XMLstr = XMLstr + "     </STOCKITEM>"
        XMLstr = XMLstr + "    </TALLYMESSAGE>"
        XMLstr = XMLstr + this.XMLBottomImport
    
       return XMLstr
    }

    DeleteItemXML(ItemName:string):string {
      ItemName = this.XmlName(ItemName)      
      const XMLstr = this.XMLHeadImportMasters +
          `<TALLYMESSAGE xmlns:UDF="TallyUDF">
          <STOCKITEM NAME="${ItemName}" ACTION=""DELETE"">
              <NAME.LIST>
                <NAME>"${ItemName}"</NAME>
              </NAME.LIST>
            </STOCKITEM>
          </TALLYMESSAGE>` + this.XMLBottomImport      
      return XMLstr
    }

    
//'=========================================================================
//' Voucher Types List
//'=========================================================================
    GetVchTypesXML():string {
      const strRtnVal = `<ENVELOPE>
        <HEADER>
            <VERSION>1</VERSION>
            <TALLYREQUEST>Export</TALLYREQUEST>
            <TYPE>Collection</TYPE>
            <ID>AVSVoucherTypes</ID>
        </HEADER>
          <BODY>
              <DESC>
                  <STATICVARIABLES>
                      <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                  </STATICVARIABLES>
                  <TDL>
                      <TDLMESSAGE>
                          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="AVSVoucherTypes">
                              <TYPE>Voucher Type</TYPE>
                              <COMPUTE>VoucherTypeName : $Name[1].Name</COMPUTE>
                              <COMPUTE>Alias : $Name[2].Name</COMPUTE>
                              <NATIVEMETHOD>Parent</NATIVEMETHOD>
                              <NATIVEMETHOD>MailingName</NATIVEMETHOD>
                              <NATIVEMETHOD>NumberingMethod</NATIVEMETHOD> 
                              <NATIVEMETHOD>UseZeroEntries</NATIVEMETHOD> 
                              <NATIVEMETHOD>PreventDuplicates</NATIVEMETHOD>
                              <NATIVEMETHOD>PrefillZero</NATIVEMETHOD>
                              <NATIVEMETHOD>IsDeemedPositive</NATIVEMETHOD>                               
                              <NATIVEMETHOD>PrintAfterSave</NATIVEMETHOD>
                              <NATIVEMETHOD>IsOptional</NATIVEMETHOD>
                              <NATIVEMETHOD>CommonNarration</NATIVEMETHOD>
                              <NATIVEMETHOD>MultiNarration</NATIVEMETHOD>
                              <NATIVEMETHOD>IsTaxInvoice</NATIVEMETHOD>
                              <FETCH>*</FETCH>  
                          </COLLECTION>
                      </TDLMESSAGE>
                  </TDL>
              </DESC>
          </BODY>
          </ENVELOPE>`    
        return strRtnVal
    }
    
    CreateModifyVoucherTypeXML(VoucherTypeInfo:VoucherTypeInfo, isModify:boolean = false, ModifiedName:string ="" ):string {        
      VoucherTypeInfo.VoucherTypeName = this.XmlName(VoucherTypeInfo.VoucherTypeName)
      ModifiedName = this.XmlName(ModifiedName)
      ModifiedName = isModify && ModifiedName != "" ? ModifiedName : VoucherTypeInfo.VoucherTypeName
      VoucherTypeInfo.Alias = !VoucherTypeInfo.Alias ? "" : this.XmlName(VoucherTypeInfo.Alias)      
      VoucherTypeInfo.Parent = !VoucherTypeInfo.Parent ? "" : this.XmlName(VoucherTypeInfo.Parent)
      VoucherTypeInfo.MailingName = !VoucherTypeInfo.MailingName ? "" : this.XmlName(VoucherTypeInfo.MailingName)
      VoucherTypeInfo.NumberingMethod = !VoucherTypeInfo.NumberingMethod ? "Automatic" : this.XmlName(VoucherTypeInfo.NumberingMethod)

      const DeemedPositive = VoucherTypeInfo.IsDeemedPositive ? "Yes" : "No"
      const Optional = !VoucherTypeInfo.IsOptional  ? "No" : "Yes"
      const TaxInvoice = !VoucherTypeInfo.IsTaxInvoice ? "No" : "Yes"
      const mNarration = !VoucherTypeInfo.MultiNarration ? "No" : "Yes"
      const pfillZero = !VoucherTypeInfo.PrefillZero ? "No" : "Yes"
      const pDuplicates = !VoucherTypeInfo.PreventDuplicates ? "No" : "Yes"
      const ZeroEntries = !VoucherTypeInfo.UseZeroEntries ? "No" : "Yes"
      const PAfterSave = !VoucherTypeInfo.PrintAfterSave ? "No" : "Yes"


      let strRtnVal:string =
        `<TALLYMESSAGE xmlns:UDF="TallyUDF">
        <VOUCHERTYPE NAME="${VoucherTypeInfo.VoucherTypeName}" RESERVEDNAME="Credit Note">
        <PARENT>${VoucherTypeInfo.Parent}</PARENT>
        <MAILINGNAME>${VoucherTypeInfo.MailingName}</MAILINGNAME>
        <TAXUNITNAME>&#4; Primary</TAXUNITNAME>
        <NUMBERINGMETHOD>${VoucherTypeInfo.NumberingMethod}</NUMBERINGMETHOD>
        <EXCISEUNITNAME>&#4; Primary</EXCISEUNITNAME>`
       if(VoucherTypeInfo.UseZeroEntries) strRtnVal = strRtnVal + "<USEZEROENTRIES>"+ ZeroEntries +"</USEZEROENTRIES>"

       strRtnVal = strRtnVal + 
       `<ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
       <ISDELETED>No</ISDELETED>
       <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
       <ASORIGINAL>Yes</ASORIGINAL>`

       if(VoucherTypeInfo.IsDeemedPositive) strRtnVal = strRtnVal + "<ISDEEMEDPOSITIVE>" + DeemedPositive + "</ISDEEMEDPOSITIVE>"
       
       strRtnVal = strRtnVal + 
       `<AFFECTSSTOCK>No</AFFECTSSTOCK>
       <ISACTIVE>Yes</ISACTIVE>`

       if(VoucherTypeInfo.PreventDuplicates) strRtnVal = strRtnVal + "<PREVENTDUPLICATES>" + pDuplicates + "</PREVENTDUPLICATES>"
       if(VoucherTypeInfo.PrefillZero) strRtnVal = strRtnVal + "<PREFILLZERO>" + pfillZero + "</PREFILLZERO>"
       if(VoucherTypeInfo.PrintAfterSave) strRtnVal = strRtnVal + "<PRINTAFTERSAVE>" + PAfterSave + "</PRINTAFTERSAVE>"
       if(VoucherTypeInfo.IsOptional) strRtnVal = strRtnVal + "<ISOPTIONAL>" + Optional + "</ISOPTIONAL>"
       if(VoucherTypeInfo.MultiNarration) strRtnVal = strRtnVal + "<MULTINARRATION>" + mNarration + "</MULTINARRATION>"
       if(VoucherTypeInfo.IsTaxInvoice) strRtnVal = strRtnVal + "<ISTAXINVOICE>" + TaxInvoice + "</ISTAXINVOICE>"

       strRtnVal = strRtnVal + 
       `<FORMALRECEIPT>No</FORMALRECEIPT>
       <ASMFGJRNL>No</ASMFGJRNL>
       <EFFECTIVEDATE>No</EFFECTIVEDATE>
       <COMMONNARRATION>Yes</COMMONNARRATION>
       <USEFORPOSINVOICE>No</USEFORPOSINVOICE>
       <USEFOREXCISETRADERINVOICE>No</USEFOREXCISETRADERINVOICE>
       <USEFOREXCISE>No</USEFOREXCISE>
       <USEFORJOBWORK>No</USEFORJOBWORK>
       <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
       <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
       <USEFOREXCISEGOODS>No</USEFOREXCISEGOODS>
       <USEFOREXCISESUPPLEMENTARY>No</USEFOREXCISESUPPLEMENTARY>
       <ISDEFAULTALLOCENABLED>No</ISDEFAULTALLOCENABLED>
       <TRACKADDLCOST>No</TRACKADDLCOST>
       <BEGINNINGNUMBER> 1</BEGINNINGNUMBER>
       <LANGUAGENAME.LIST>
        <NAME.LIST TYPE="String">
         <NAME>${ModifiedName}</NAME>`
      if(VoucherTypeInfo.Alias != "")  strRtnVal = strRtnVal + "<NAME>" + VoucherTypeInfo.Alias + "</NAME>"
      strRtnVal = strRtnVal + 
        `</NAME.LIST>
        <LANGUAGEID> 1033</LANGUAGEID>
       </LANGUAGENAME.LIST>
      </VOUCHERTYPE>
     </TALLYMESSAGE>`
 
     return strRtnVal
    }

    DeleteVoucherTypeXML(VchTypeName:string):string {
      VchTypeName = this.XmlName(VchTypeName)      
      const XMLstr = this.XMLHeadImportMasters +
          `<TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHERTYPE NAME="${VchTypeName}" ACTION=""DELETE"">
              <NAME.LIST>
                <NAME>"${VchTypeName}"</NAME>
              </NAME.LIST>
            </VOUCHERTYPE>
          </TALLYMESSAGE>` + this.XMLBottomImport      
      return XMLstr
    }
  
    

};


