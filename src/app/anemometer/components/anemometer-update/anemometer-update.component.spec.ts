import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { AnemometersService } from '../../services/anemometers.service';
import { TagsService } from '../../../tag/services/tags.service';

import { AnemometerUpdateComponent } from './anemometer-update.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnemometerListComponent } from '../anemometer-list/anemometer-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('AnemometerUpdateComponent', () => {
  let component: AnemometerUpdateComponent;
  let fixture: ComponentFixture<AnemometerUpdateComponent>;

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
      declarations: [ AnemometerUpdateComponent ],
      providers: [
        FormBuilder,
        AnemometersService,
        TagsService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnemometerUpdateComponent);
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
