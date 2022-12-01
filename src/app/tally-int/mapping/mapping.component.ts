import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TallyDataService } from '../webtally/tallydata.service';
import { TallyIntService } from '../webtally/tallyint.service';
//import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})

export class MappingComponent implements OnInit {

  /*
  TallyGroupsData: any[] = []
  TallyLedgerData: any[] = []
  TallyUOMsData: any[] = []
  TallyStockGroupsData: any[] = []
  TallyStockItemsData: any[] = []
  TallyStockCategories: any[] = []
  TallyCostCenters: any[] = []
  TallyCostCategories: any[] = []
  TallyLocations: any[] = []
  */
  TallyData:TallyDataService
  
  MasterTypes:string[] = []

  mappingList:{MasterType:string, FronoName:string, TallyName:string, isActive:boolean }[] = []

  constructor(private TallyAPI:TallyIntService, private TallyDataSrv:TallyDataService,  private route:Router)  { 
    this.TallyData = this.TallyDataSrv
    
  }

  ngOnInit(): void {
    if(this.mappingList.length == 0) this.mappingList.push({ MasterType: "Ledgers", FronoName: "Cash in Hand", TallyName: "Cash" , isActive:false})

    //this.dataImport()
    this.MasterTypes = this.TallyData.MasterTypes
    //this.MasterTypes=['Ledger Groups', 'Ledgers', 'Stock Groups', 'Stock Items', 'Stock Categories', 'Locations', 'Cost Centers', 'Cost Categories' ]

  }

/*
  dataImport(){
    this.TallyAPI.GetTallyGroups.subscribe({
        next: (res:any) => {
          this.TallyGroupsData = res.data
//          console.log(res.data)
        },
        error: error => {
          this.TallyGroupsData = []
          //this.errorMessage = error.message;
          //console.error('There was an error!', error);
        }                
    })

    this.TallyAPI.GetTallyLedger.subscribe({
      next: (res:any) => this.TallyLedgerData = res.data ,
      error: error => this.TallyLedgerData = [] 
    })

    this.TallyAPI.GetTallyUOM.subscribe({
      next: (res:any) => this.TallyUOMsData = res.data ,
      error: error => this.TallyUOMsData = [] 
    })


    this.TallyAPI.GetTallyStockGroups.subscribe({
      next: (res:any) => this.TallyStockGroupsData = res.data ,
      error: error => this.TallyStockGroupsData = [] 
    })

    this.TallyAPI.GetTallyStockCategories.subscribe({
      next: (res:any) => this.TallyStockCategories = res.data ,
      error: error => this.TallyStockCategories = [] 
    })

    this.TallyAPI.GetTallyStockItem.subscribe({
      next: (res:any) => this.TallyStockItemsData = res.data ,
      error: error => this.TallyStockItemsData = [] 
    })

    this.TallyAPI.GetTallyCostCenters.subscribe({
      next: (res:any) => this.TallyCostCenters = res.data ,
      error: error => this.TallyCostCenters = [] 
    })

    this.TallyAPI.GetTallyCostCategory.subscribe({
      next: (res:any) => this.TallyCostCategories = res.data ,
      error: error => this.TallyCostCategories = [] 
    })

    this.TallyAPI.GetTallyLocations.subscribe({
      next: (res:any) => this.TallyLocations = res.data ,
      error: error => this.TallyLocations = [] 
    })


  }
*/

  addrow(Position:number){
    //this.mappingList.push({ MasterType: "Ledgers", FronoName: "vvv", TallyName: "Cash" , isActive:true})
    this.mappingList.splice(Position+1,0, { MasterType: "Ledgers", FronoName: "vvv", TallyName: "Cash" , isActive:true})
  }

  deleterow(Position:number){
    this.mappingList.splice(Position, 1);
  }  

  saveMapping(){
    this.route.navigate(['tally-integration/home']);
  }

  cancel(){
    this.route.navigate(['tally-integration/home']);
  }

}
