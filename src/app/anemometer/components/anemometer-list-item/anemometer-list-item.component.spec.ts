import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnemometerListItemComponent } from './anemometer-list-item.component';
import { Anemometer } from '../../models/anemometer.model';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AnemometerListItemComponent', () => {
  let component: AnemometerListItemComponent;
  let fixture: ComponentFixture<AnemometerListItemComponent>;
  let router: Router;

  let anemometer: Anemometer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnemometerListItemComponent ],
      imports: [ RouterTestingModule ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AnemometerListItemComponent);
    component = fixture.componentInstance;
    anemometer = {id: 1, name: 'test Anemometer', latitude: '1.25', longitude: '0.245', altitude: 0};
    component.anemometer = anemometer;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the anemometer detail page on view anemometer', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    component.onViewAnemometer();
    expect(navigateSpy).toHaveBeenCalledWith('anemometer/1');
  });
});