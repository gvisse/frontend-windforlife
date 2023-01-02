import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { Wind } from '../../../wind/models/wind.model';
import { WindsService } from '../../../wind/services/winds.service';
import { Anemometer } from '../../models/anemometer.model';
import { AnemometersService } from '../../services/anemometers.service';
import { AnemometerListComponent } from '../anemometer-list/anemometer-list.component';

import { SingleAnemometerComponent } from './single-anemometer.component';

describe('SingleAnemometerComponent', () => {
  let component: SingleAnemometerComponent;
  let fixture: ComponentFixture<SingleAnemometerComponent>;
  
  let anemoDe: DebugElement;
  let anemoEl: HTMLElement;
  
  let anemometersService: AnemometersService;
  let mockAnemo: Anemometer;
  let mockAnemo$: Observable<Anemometer>;
  let windsService: WindsService;
  let mockWinds: Wind[];
  let mockWinds$: Observable<Wind[]>;
  let httpMock: HttpTestingController;
  let router: Router;
  const creationDate = new Date();
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {path: 'anemometer', component: AnemometerListComponent}
        ])
      ],
      declarations: [ SingleAnemometerComponent ],
      providers: [
        {
          provide: AnemometersService,
          useValue: {
            getAnemometerById: jest.fn().mockReturnValue(mockAnemo$),
            deleteAnemometer: jest.fn()
          }
         },
        {
          provide: WindsService,
          useValue : {
            createWind: jest.fn(),
            getWindsAnemometerByAnemometerId: jest.fn().mockReturnValue(mockWinds$),
            countWinds$: of(1),
            goToPage: jest.fn(),
            deleteWind: jest.fn().mockReturnValue(of([]))
          }
        }, JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleAnemometerComponent);
    component = fixture.componentInstance;

    anemometersService = TestBed.inject(AnemometersService);
    windsService = TestBed.inject(WindsService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    anemoDe = fixture.debugElement;
    anemoEl = anemoDe.nativeElement;
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockAnemo = { id: 1, name: 'Anemometer 1', 'latitude': '1.25', 'longitude': '1.25', 'altitude': 0, 'tags': [] };
    mockAnemo$ = of(mockAnemo);
    mockWinds = [{ id: 1, speed: 10, time: creationDate, anemometer_id: 1, cardinal: 'N', direction: 0}]
    mockWinds$ = of(mockWinds);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables', () => {
    component.ngOnInit();
    expect(component.anemometer$).toBeDefined();
    anemometersService.getAnemometerById(1).subscribe(anemo => {
      expect(anemo).toBe(mockAnemo);
    })
    expect(component.winds$).toBeDefined();
    windsService.getWindsAnemometerByAnemometerId(1).subscribe(winds => {
      expect(winds).toBe(mockWinds);
    })
    expect(component.countWinds$).toBeDefined();
  });


  it('should call the createWind method of the WindsService', () => {
    const createdWind = { speed: 10, direction: 0, time: creationDate, anemometer_id: 1};
    const expectedWind = {id : 1, time: creationDate, speed: 10, cardinal: 'N', direction: 0, anemometer_id: 1}
    component.onCreateWind(createdWind);
    expect(windsService.createWind).toHaveBeenCalledWith(createdWind);
    expect(component.winds).toEqual([expectedWind]);
    expect(component.sortedWinds).toEqual([expectedWind]);
  });

  it('should update the page event and go to the correct page', () => {
    const pageEvent = { length: 100, pageSize: 10, pageIndex: 2 };

    component.onChangePage(pageEvent);

    expect(component.pageEvent).toEqual(pageEvent);
    expect(component.length).toEqual(pageEvent.length);
    expect(component.pageSize).toEqual(pageEvent.pageSize);
    expect(component.pageIndex).toEqual(pageEvent.pageIndex);
    expect(windsService.goToPage).toHaveBeenCalledWith(1, {page: 3, size: 10});
  });

  it('should delete a wind', () => {
    component.onDeleteWind(1);
    expect(windsService.deleteWind).toHaveBeenCalledWith(1, mockAnemo.id);
  });

  it('should delete the anemometer and go to the list of anemometers', () =>{
    jest.spyOn(router, 'navigateByUrl');
    component.onDelete();
    expect(anemometersService.deleteAnemometer).toHaveBeenCalledWith(mockAnemo.id);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/anemometer');
  });

  it('should navigate to the anemometers list', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onGoBack();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/anemometer');
  });

  it('should sort the data by speed in ascending order', () => {
    const sort: Sort = {
      active: 'speed',
      direction: 'asc',
    };
    component.winds = [
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
    ];

    component.sortData(sort);

    expect(component.sortedWinds).toEqual([
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 }
    ]);
  });

  it('should sort the data by speed in descending order', () => {
    const sort: Sort = {
      active: 'speed',
      direction: 'desc',
    };
    component.winds = [
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
    ];

    component.sortData(sort);

    expect(component.sortedWinds).toEqual([
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
    ]);
  });

  it('should sort the data by time in ascending order', () => {
    const sort: Sort = {
      active: 'time',
      direction: 'asc',
    };
    component.winds = [
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: new Date(2020, 1, 1), anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: new Date(2022, 1, 1), anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: new Date(2021, 1, 1), anemometer_id: 1 },
    ];

    component.sortData(sort);

    expect(component.sortedWinds).toEqual([
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: new Date(2020, 1, 1), anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: new Date(2021, 1, 1), anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: new Date(2022, 1, 1), anemometer_id: 1 },
    ]);
  });

  it('should sort the data by time in descending order', () => {
    const sort: Sort = {
      active: 'time',
      direction: 'desc',
    };
    component.winds = [
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: new Date(2020, 1, 1), anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: new Date(2022, 1, 1), anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: new Date(2021, 1, 1), anemometer_id: 1 },
    ];

    component.sortData(sort);

    expect(component.sortedWinds).toEqual([
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: new Date(2022, 1, 1), anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: new Date(2021, 1, 1), anemometer_id: 1 },
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: new Date(2020, 1, 1), anemometer_id: 1 },
    ]);
  });

  it('should not sort the data if the sort is inactive', () => {
    const sort: Sort = {
      active: '',
      direction: '',
    };
    component.winds = [
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
    ];

    component.sortData(sort);

    expect(component.sortedWinds).toEqual([
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
    ]);
  });

  it('should not sort the data if the active sort is not recognize', () => {
    const sort: Sort = {
      active: 'direction',
      direction: 'asc',
    };
    component.winds = [
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
    ];

    component.sortData(sort);

    expect(component.sortedWinds).toEqual([
      { id: 1, cardinal: 'N', direction: 0, speed: 3, time: creationDate, anemometer_id: 1 },
      { id: 2, cardinal: 'N', direction: 0, speed: 1, time: creationDate, anemometer_id: 1 },
      { id: 3, cardinal: 'N', direction: 0, speed: 2, time: creationDate, anemometer_id: 1 },
    ]);
  });

  it('should set the page size options from a string input', () => {
    component.setPageSizeOptions('5, 25, 50, 150');

    expect(component.pageSizeOptions).toEqual([5, 25, 50, 150]);
  });
});
