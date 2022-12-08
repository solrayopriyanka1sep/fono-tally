import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TallyIntRoutingModule } from './tally-int-routing.module';
import { MainComponent } from './main/main.component';
import { ConfigComponent } from './config/config.component';
import { MappingComponent } from './mapping/mapping.component';
import { StaggingComponent } from './stagging/stagging.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TallyIntService } from './webtally/tallyint.service';
import { TallyDataService } from './webtally/tallydata.service';
import { FronoIntService } from './webtally/fronoint.service';
import { DatePipe } from '@angular/common';

//import { TallyIntegration } from "./webtally/tallyintegration"

@NgModule({
  declarations: [
    MainComponent,
    ConfigComponent,
    MappingComponent,
    StaggingComponent
  ],
  imports: [
    CommonModule,
    TallyIntRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers:[
    TallyIntService,
    TallyDataService,
    FronoIntService,
    DatePipe
  ],
  exports : [
    MainComponent,
    ConfigComponent,
    MappingComponent,
    StaggingComponent
 ]
 
})
export class TallyIntModule { }
