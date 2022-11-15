import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { TagsResolver } from './resolvers/tags.resolver';

const routes: Routes = [
  { path: '', component: TagListComponent, resolve: { posts: TagsResolver } }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
