import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TagsService } from '../../../tag/services/tags.service';
import { AnemometersService } from '../../services/anemometers.service';
import { AnemometerListComponent } from '../anemometer-list/anemometer-list.component';

import { AnemometerNewComponent } from './anemometer-new.component';

describe('AnemometerNewComponent', () => {
  let component: AnemometerNewComponent;
  let fixture: ComponentFixture<AnemometerNewComponent>;

  let anemoService: AnemometersService;
  let tagService: TagsService;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {path: 'anemometer', component: AnemometerListComponent}
        ])
      ],
      declarations: [ AnemometerNewComponent ],
      providers: [
        FormBuilder,
        AnemometersService,
        TagsService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnemometerNewComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    anemoService = TestBed.inject(AnemometersService);
    tagService = TestBed.inject(TagsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
