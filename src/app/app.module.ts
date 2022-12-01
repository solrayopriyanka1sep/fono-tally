import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TallyIntModule } from './tally-int/tally-int.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TallyIntModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
