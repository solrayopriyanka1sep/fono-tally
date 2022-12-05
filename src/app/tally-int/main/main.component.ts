import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TallyDataService } from '../webtally/tallydata.service';
//import { HttpClient  } from '@angular/common/http';
//import {XMLParser}  from 'fast-xml-parser'
import { TallyIntService } from '../webtally/tallyint.service';


import { TALLYGROUP } from '../webtally/tallyInterfaces';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
//  tallyURL: string = 'http://localhost:4200/tallyapi';
    tallyURL: string = 'http://localhost:9000';
    tallyCompanyName: string = 'Test Company';
    connected:boolean = false
    connectionError:boolean = false
    connectionErrorMsg:string = ""

  constructor(private TallyAPI:TallyIntService, private TallyData:TallyDataService, private route:Router) {   }


  ngOnInit(): void {
    this.connected = this.TallyAPI.isConnectedtoTally
    //console.log("Is Connected", this.connected)
    //console.log("Is Connected TallyINt", this.TallyAPI.isConnectedtoTally)
  }

  routeTo(routeName:string){
    this.route.navigate([routeName]);
  }
  
  tallyConnect(){
    //this.TallyAPI.init( this.tallyURL, this.tallyCompanyName)
    console.log("Connecting to Tally")
    this.TallyAPI.init(this.tallyURL, this.tallyCompanyName).subscribe({      
        next: (res:any) => {
            //console.log(res.data)
            console.log(res)
            this.connected = !res.Error
            this.connectionError = res.Error
            this.connectionErrorMsg = res.Error ? res.Message : ""
            this.TallyData.init(43)
          },
        error: error => {
              //this.errorMessage = error.message;
              this.connected = false
              this.connectionError = true
              this.connectionErrorMsg = error.Message
              console.error( error);
        }                
    })    
  }

  dataImport(){
    this.TallyData.ExportImport = 1
    this.route.navigate(['tally-integration/stage']);
  }

  dataEmport(){
    this.TallyData.ExportImport = 0
    this.route.navigate(['tally-integration/stage']);
  }


  CreateGroup(){
    this.TallyAPI.CreateModifyGroup("Nitin Test", TALLYGROUP.Fixed_Assets, "").subscribe({
        next: (res:any) => {
            //console.log(res.data)
            console.log(res)
          },
          error: error => {
              //this.errorMessage = error.message;
              console.error( error);
          }                
    })
  }


/*  
  dataImport(){
    console.log("data import started")

    const StrTallyRequest:string = `<ENVELOPE>
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

    const strRtnVal:string = `
    <ENVELOPE>
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
                            <COMPUTE>GroupName : $Name[1].Name</COMPUTE>
                            <COMPUTE>Alias : $$alias:ledger</COMPUTE>
                        </COLLECTION>
                    </TDLMESSAGE>
                </TDL>
            </DESC>
        </BODY>
        </ENVELOPE>`


    const XMLP = new XMLParser()

    this.http.post(this.tallyURL, strRtnVal , { responseType:'text'  } ).subscribe({
      next: res => {
        let jObj:any = XMLP.parse(res)
        console.log(jObj.ENVELOPE.BODY.DATA.COLLECTION.GROUP)
      },
      error: error => {
          //this.errorMessage = error.message;
          console.error('There was an error!', error);
      }            
    })

  }
*/


}
