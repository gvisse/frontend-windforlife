import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapWindStatsComponent } from './components/map-wind-stats/map-wind-stats.component';
import { SharedModule } from '../shared/shared.module';
import { AnemometersService } from '../anemometer/services/anemometers.service';
import { MapWindStatsRoutingModule } from './map-wind-stats-routing.module';
import { WindStatsService } from './services/wind-stats.service';



@NgModule({
  declarations: [
    MapWindStatsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MapWindStatsRoutingModule
  ],
  providers:[
    AnemometersService,
    WindStatsService
  ]
})
export class MapWindStatsModule { }
