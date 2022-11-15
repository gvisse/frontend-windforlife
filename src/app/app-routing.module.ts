import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'tag', loadChildren: () => import('./tag/tag.module').then(m => m.TagModule) },
  { path: 'anemometer', loadChildren: () => import('./anemometer/anemometer.module').then(m => m.AnemometerModule) },
  { path: 'wind', loadChildren: () => import('./wind/wind.module').then(m => m.WindModule) },
  { path: '**', redirectTo: 'tag'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
