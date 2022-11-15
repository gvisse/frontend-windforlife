import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { TagsService } from './services/tags.service';
import { TagsResolver } from './resolvers/tags.resolver';


@NgModule({
  declarations: [],
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
