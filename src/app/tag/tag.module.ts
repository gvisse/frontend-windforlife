import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { TagsService } from './services/tags.service';
import { TagsResolver } from './resolvers/tags.resolver';
import { TagListComponent } from './components/tag-list/tag-list.component';


@NgModule({
  declarations: [
    
  
    TagListComponent
  ],
  imports: [
    CommonModule,
    TagRoutingModule
  ],
  providers:[
    TagsService,
    TagsResolver
  ]
})
export class TagModule { }
