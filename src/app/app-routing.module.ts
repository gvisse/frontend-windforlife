import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';

const routes: Routes = [
  { path: 'tag', loadChildren: () => import('./tag/tag.module').then(m => m.TagModule) },
  { path: 'anemometer', loadChildren: () => import('./anemometer/anemometer.module').then(m => m.AnemometerModule) },
  { path: 'wind', loadChildren: () => import('./wind/wind.module').then(m => m.WindModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
