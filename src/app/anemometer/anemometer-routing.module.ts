import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnemometerListComponent } from './components/anemometer-list/anemometer-list.component';
import { AnemometersResolver } from './resolvers/anemometers.resolver';

const routes: Routes = [
  { path: '', component: AnemometerListComponent, resolve: { posts: AnemometersResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnemometerRoutingModule { }
