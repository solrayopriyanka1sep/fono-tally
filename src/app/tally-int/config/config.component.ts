import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TallyDataService } from '../webtally/tallydata.service';
import { FronoIntService } from '../webtally/fronoint.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})

export class ConfigComponent implements OnInit {
  TallyData:TallyDataService
  ResponseMessage:string = ""

  constructor(private route:Router, private TallyDataSrv:TallyDataService, private FronoAPI:FronoIntService) { 
    this.TallyData = this.TallyDataSrv
  }

  ngOnInit(): void {
    
  }

  async saveConfig(){
      const requestData = this.TallyData.ConfigOptions

      this.FronoAPI.AddUpdateConfig(requestData).subscribe({
        next: (res:any) => {
            //console.log(res.data)
            console.log(res)
            if(res.MessageId != 200) {
              this.ResponseMessage = res.MessageText
            } else {
              this.route.navigate(['tally-integration/home']);
              return;
            }              
          },
          error: error => {
              //this.errorMessage = error.message;
              console.error( error);
              this.ResponseMessage = error.MessageText
          }                
      })
//    this.route.navigate(['tally-integration/home']);
  }

  cancel(){
    this.route.navigate(['tally-integration/home']);
  }

}
