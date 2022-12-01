import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ConfigComponent } from './config/config.component';
import { MappingComponent } from './mapping/mapping.component';
import { StaggingComponent } from './stagging/stagging.component';


const routes: Routes = [
  {path : 'tally-integration/home', component : MainComponent},
  {path : 'tally-integration/config', component : ConfigComponent},
  {path : 'tally-integration/mapping', component : MappingComponent} ,
  {path : 'tally-integration/stage', component : StaggingComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TallyIntRoutingModule { }
