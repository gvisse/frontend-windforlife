import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnemometerUpdateComponent } from './anemometer-update.component';

describe('AnemometerUpdateComponent', () => {
  let component: AnemometerUpdateComponent;
  let fixture: ComponentFixture<AnemometerUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnemometerUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnemometerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
