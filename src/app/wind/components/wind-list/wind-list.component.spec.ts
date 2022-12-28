import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WindListComponent } from './wind-list.component';
import { WindsService } from '../../services/winds.service';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

describe('WindListComponent', () => {
  let component: WindListComponent;
  let fixture: ComponentFixture<WindListComponent>;

  let windsDe: DebugElement;
  let windsEl: HTMLElement;

  let service: WindsService;
  let authService: AuthService;
  let httpMock: HttpTestingController;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ WindListComponent ],
      providers: [WindsService, AuthService, JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindListComponent);
    component = fixture.componentInstance;

    windsDe = fixture.debugElement;
    windsEl = windsDe.nativeElement;

    service = TestBed.inject(WindsService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete a wind when onDeleteWind is called', () => {
    const spy = jest.spyOn(service, 'deleteWind');

    component.onDeleteWind(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should create a wind when onCreateTag is called', () => {
    const spy = jest.spyOn(service, 'createWind');
    const createdWind = { speed: 1, direction: 0, time: new Date(2022, 12, 31, 12, 35, 10), anemometer_id:1 };

    component.onCreateWind(createdWind);

    expect(spy).toHaveBeenCalledWith(createdWind);
  });

  it('should update pagination properties when onChangePage is called', () => {
    const e = {
      length: 100,
      pageSize: 25,
      pageIndex: 2
    };

    component.onChangePage(e);

    expect(component.pageEvent).toEqual(e);
    expect(component.length).toEqual(e.length);
    expect(component.pageIndex).toEqual(e.pageIndex);
    expect(component.pageSize).toEqual(e.pageSize);
  });

  it('should get tags from the server when getTagsFromServer is called and initialize observable', () => {
    const spy = jest.spyOn(service, 'getWindsFromServeur');
    jest.spyOn(service, 'winds$', 'get').mockReturnValue(of([]));
    jest.spyOn(service, 'countWinds$', 'get').mockReturnValue(of(0));
    jest.spyOn(service, 'loading$', 'get').mockReturnValue(of(false));

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    component.winds$.subscribe(winds => {
      expect(winds).toEqual([]);
    });
    component.countWinds$.subscribe(count => {
      expect(count).toEqual(0);
    });
    component.loading$.subscribe(loading => {
      expect(loading).toBeFalsy();
    });

  });
});
