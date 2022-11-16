import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnemometerListComponent } from './components/anemometer-list/anemometer-list.component';
import { SingleAnemometerComponent } from './components/single-anemometer/single-anemometer.component';
import { AnemometerByIdResolver } from './resolvers/anemometer-by-id.resolver';
import { AnemometersResolver } from './resolvers/anemometers.resolver';

const routes: Routes = [
  { path: ':id', component: SingleAnemometerComponent, resolve:{anemometer: AnemometerByIdResolver }},
  { path: '', component: AnemometerListComponent, resolve: {anemometers: AnemometersResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnemometerRoutingModule { }
