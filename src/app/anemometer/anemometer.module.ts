import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnemometerRoutingModule } from './anemometer-routing.module';
import { AnemometerListComponent } from './components/anemometer-list/anemometer-list.component';
import { AnemometerListItemComponent } from './components/anemometer-list-item/anemometer-list-item.component';
import { SharedModule } from '../shared/shared.module';
import { AnemometersService } from './services/anemometers.service';
import { TagsComponent } from './components/tags/tags.component';
import { SingleAnemometerComponent } from './components/single-anemometer/single-anemometer.component';
import { WindsService } from '../wind/services/winds.service';
import { AnemometerNewComponent } from './components/anemometer-new/anemometer-new.component';
import { TagsService } from '../tag/services/tags.service';


@NgModule({
  declarations: [
    AnemometerListComponent,
    AnemometerListItemComponent,
    TagsComponent,
    SingleAnemometerComponent,
    AnemometerNewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AnemometerRoutingModule
  ],
  providers: [
    AnemometersService,
    TagsService,
    WindsService
  ]
})
export class AnemometerModule { }
