import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WindListComponent } from './components/wind-list/wind-list.component';
import { WindsResolver } from './resolvers/winds.resolver';

const routes: Routes = [
  { path: '', component: WindListComponent, resolve: { posts: WindsResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WindRoutingModule { }
