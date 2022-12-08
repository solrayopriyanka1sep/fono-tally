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


}
