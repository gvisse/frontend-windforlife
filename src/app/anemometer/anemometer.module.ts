import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnemometerRoutingModule } from './anemometer-routing.module';
import { AnemometerListComponent } from './components/anemometer-list/anemometer-list.component';
import { AnemometerListItemComponent } from './components/anemometer-list-item/anemometer-list-item.component';
import { SharedModule } from '../shared/shared.module';
import { TagModule } from '../tag/tag.module';
import { AnemometersService } from './services/anemometers.service';
import { AnemometersResolver } from './resolvers/anemometers.resolver';
import { TagsComponent } from './components/tags/tags.component';
import { SingleAnemometerComponent } from './components/single-anemometer/single-anemometer.component';
import { AnemometerByIdResolver } from './resolvers/anemometer-by-id.resolver';


@NgModule({
  declarations: [
    AnemometerListComponent,
    AnemometerListItemComponent,
    TagsComponent,
    SingleAnemometerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AnemometerRoutingModule,
    TagModule
  ],
  providers: [
    AnemometersService,
    AnemometersResolver,
    AnemometerByIdResolver
  ]
})
export class AnemometerModule { }
