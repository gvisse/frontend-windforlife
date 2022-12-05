import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWindStatsComponent } from './map-wind-stats.component';

describe('MapWindStatsComponent', () => {
  let component: MapWindStatsComponent;
  let fixture: ComponentFixture<MapWindStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapWindStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapWindStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
