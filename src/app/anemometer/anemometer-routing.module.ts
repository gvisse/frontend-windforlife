import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnemometerListComponent } from './components/anemometer-list/anemometer-list.component';
import { SingleAnemometerComponent } from './components/single-anemometer/single-anemometer.component';

const routes: Routes = [
  { path: ':id', component: SingleAnemometerComponent },
  { path: '', component: AnemometerListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnemometerRoutingModule { }
