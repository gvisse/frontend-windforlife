import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AnemometersService } from '../anemometer/services/anemometers.service';
import { HomeRoutingModule } from './home-routing.module';
import { WindStatsService } from './services/wind-stats.service';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ],
  providers:[
    AnemometersService,
    WindStatsService
  ]
})
export class HomeModule { }
