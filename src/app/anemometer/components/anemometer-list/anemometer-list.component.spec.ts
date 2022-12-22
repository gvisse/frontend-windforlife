import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AnemometerSearchType } from '../../enums/anemometer-search-type.enum';
import { Anemometer } from '../../models/anemometer.model';
import { AnemometersService } from '../../services/anemometers.service';

import { AnemometerListComponent } from './anemometer-list.component';

describe('AnemometerListComponent', () => {
  let component: AnemometerListComponent;
  let fixture: ComponentFixture<AnemometerListComponent>;
  let httpMock: HttpTestingController;

  let anemometersService: AnemometersService;
  let authService: AuthService;
  let formBuilder: FormBuilder;

  const anemometers: Anemometer[] = [
    { id: 1, name: 'Anemometer 1', latitude: '45.5', longitude: '-75.5', altitude: 100 },
    { id: 2, name: 'Anemometer 2', latitude: '44.5', longitude: '-73.5', altitude: 200 },
    { id: 3, name: 'Anemometer 3', latitude: '46.5', longitude: '-72.5', altitude: 300 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ AnemometerListComponent ],
      providers: [ 
        FormBuilder,
        { provide: AnemometersService, useValue: {
          anemometers$: of(anemometers),
          loading$: of(false),
          countAnemometers$: of(0),
          getAnemometersFromServeur: jest.fn(),
          goToPage: jest.fn()
        }},
        AuthService, JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnemometerListComponent);
    formBuilder = TestBed.inject(FormBuilder);
    httpMock = TestBed.inject(HttpTestingController);
    anemometersService = TestBed.inject(AnemometersService);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    component.ngOnInit();
    expect(component.searchCtrl).toBeDefined();
    expect(component.searchTypeCtrl).toBeDefined();
    expect(component.searchTypeOptions).toBeDefined();
  });

  it('should initialize the observables', () => {
    component.ngOnInit();
    expect(component.loading$).toBeDefined();
    expect(component.anemometers$).toBeDefined();
    expect(component.countAnemometers$).toBeDefined();
  });

  it('should search for anemometers by name', () => {
    component.searchCtrl.setValue('1');
    component.searchTypeCtrl.setValue(AnemometerSearchType.NAME);
    component.anemometers$.subscribe(results =>{
      expect(results).toEqual([anemometers[0]]);
    });
  });

  it('should search for anemometers by latitude', () => {
    component.searchCtrl.setValue('45.5');
    component.searchTypeCtrl.setValue(AnemometerSearchType.LAT);
    component.anemometers$.subscribe(results =>{
      expect(results).toEqual([anemometers[0]]);
    });
  });

  it('should search for anemometers by longitude', () => {
    component.searchCtrl.setValue('-72.5');
    component.searchTypeCtrl.setValue(AnemometerSearchType.LON);
    component.anemometers$.subscribe(results =>{
      expect(results).toEqual([anemometers[2]]);
    });
  });

  it('should handle page changes', () => {
    const pageEvent = { length: 100, pageIndex: 1, pageSize: 10 };
    component.onChangePage(pageEvent);
    expect(anemometersService.goToPage).toHaveBeenCalledWith({page: 2, size: 10});
  });

  it('should set the page size options from a string input', () => {
    component.setPageSizeOptions('5, 25, 50, 150');

    expect(component.pageSizeOptions).toEqual([5, 25, 50, 150]);
  });
});
