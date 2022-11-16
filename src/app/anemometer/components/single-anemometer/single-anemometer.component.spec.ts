import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAnemometerComponent } from './single-anemometer.component';

describe('SingleAnemometerComponent', () => {
  let component: SingleAnemometerComponent;
  let fixture: ComponentFixture<SingleAnemometerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleAnemometerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleAnemometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
