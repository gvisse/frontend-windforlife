import { formatDate, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DebugElement, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Wind } from '../../models/wind.model';

import { WindListItemComponent } from './wind-list-item.component';

registerLocaleData(localeFr);

describe('WindListItemComponent', () => {
  let component: WindListItemComponent;
  let fixture: ComponentFixture<WindListItemComponent>;

  let windDe: DebugElement;
  let windEl: HTMLElement;

  let expectedWind: Wind;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindListItemComponent ],
      providers: [{
        provider: LOCALE_ID, useValue: 'fr-FR'
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindListItemComponent);
    component = fixture.componentInstance;

    windDe = fixture.debugElement.query(By.css('.wind'))
    windEl = windDe.nativeElement;

    expectedWind = {id: 42, speed: 4.2, time: new Date(), direction: 90, cardinal: 'E', anemometer_id: 5}

    component.wind = expectedWind;
    component.canDelete = true;

    fixture.detectChanges();
  });

  it('should create WindListItemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display wind speed', () => {
    const expectedSpeed = expectedWind.speed;
    expect(windEl.textContent).toContain(`${expectedSpeed}`);
  });

  it('should display wind time', () => {
    const expectedTime = formatDate(expectedWind.time, 'dd/MM/YY, à HH:mm', 'fr-FR');
    expect(windEl.textContent).toContain(expectedTime);
  });

  it('should display wind direction and cardinal', () => {
    const expectedDirection = expectedWind.direction;
    const expectedCardinal = expectedWind.cardinal;
    expect(windEl.textContent).toContain(`${expectedDirection}° / ${expectedCardinal}`);
  });

  it('should display show anemometer link', () => {
    expect(windEl.querySelector('a')).toBeTruthy();
  })

  it('should display delete button', () => {
    expect(windEl.querySelector('button')).toBeTruthy();
  });

  it('should not display delete button' , () => {
    component.canDelete = false;
    fixture.detectChanges();
    expect(windEl.querySelector('button')).toBeFalsy();
  });
  
});
