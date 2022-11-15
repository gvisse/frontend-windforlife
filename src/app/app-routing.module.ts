import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'anemometer', loadChildren: () => import('./anemometer/anemometer.module').then(m => m.AnemometerModule) },
  { path: 'tag', loadChildren: () => import('./tag/tag.module').then(m => m.TagModule) },
  { path: '**', redirectTo: 'anemometer'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
