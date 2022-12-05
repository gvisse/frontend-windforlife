import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapWindStatsComponent } from './components/map-wind-stats/map-wind-stats.component';

const routes: Routes = [
  { path: '', component: MapWindStatsComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapWindStatsRoutingModule { }
