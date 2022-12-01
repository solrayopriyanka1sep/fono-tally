import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TallyDataService } from '../webtally/tallydata.service';
import { TallyIntService } from '../webtally/tallyint.service';
import { FronoIntService } from '../webtally/fronoint.service';

@Component({
  selector: 'app-stagging',
  templateUrl: './stagging.component.html',
  styleUrls: ['./stagging.component.css']
})
export class StaggingComponent implements OnInit {
  TallyData:TallyDataService
  MasterTypes:string[] = []
  ActionList:string[] = []

  constructor(private TallyAPI:TallyIntService, private FronoAPI:FronoIntService, private TallyDataSrv:TallyDataService,  private route:Router) { 
    this.TallyData = this.TallyDataSrv
    this.MasterTypes = this.TallyData.MasterTypes
    this.ActionList = ['Create', 'Modify', 'Delete' ]
  }

  ngOnInit(): void {
    //this.TallyData.ExportImport = 0
  }

  async SaveMasterstoFrono() {    
    //TallyData.MastersStageData

    for (const dataRow of this.TallyData.MastersStageData) {
      //await sendPromoCode(user);
      console.log(dataRow)

      if (dataRow.MasterType == "Ledger Groups"  && (dataRow.Action == "Create" || dataRow.Action == "Modify" )  ) { 
        this.FronoAPI.AddUpdateGroup(dataRow).subscribe({
          next: (res:any) => {
              //console.log(res.data)
              console.log(res)
            
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

  TallyImport(){

  }
  
  TallyExport(){
    this.TallyData.CreateVoucher()
    



  }

  backToHome(){
    this.route.navigate(['tally-integration/home']);
  }


}
