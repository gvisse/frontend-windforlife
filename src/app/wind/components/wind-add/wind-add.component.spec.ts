import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { AnemometersService } from '../../../anemometer/services/anemometers.service';
import { WindAddComponent } from './wind-add.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WindAddComponent', () => {
  let component: WindAddComponent;
  let fixture: ComponentFixture<WindAddComponent>;

  let http: HttpTestingController;
  let service: AnemometersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindAddComponent ],
      imports: [ 
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        AnemometersService,
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(WindAddComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AnemometersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls and default values', () => {
    expect(component.windForm).toBeInstanceOf(FormGroup);
    expect(component.windForm.get('speed')).toBeDefined();
    expect(component.windForm.get('direction')).toBeDefined();
    expect(component.windForm.get('time')).toBeDefined();
    expect(component.windForm.get('anemometer_id')).toBeDefined();
    expect(component.windForm.get('speed')?.value).toBeNull();
    expect(component.windForm.get('direction')?.value).toBeNull();
    expect(component.windForm.get('time')?.value).toBeNull();
    expect(component.windForm.get('anemometer_id')?.value).toBeNull();
  });

  it('should test validity of speed field', () => {
    let speedCtrl = component.windForm.get('speed');
    speedCtrl?.setValue(null);
    expect(speedCtrl?.hasError('required')).toBeTruthy();
    speedCtrl?.setValue(-1);
    expect(speedCtrl?.hasError('min')).toBeTruthy();
    speedCtrl?.setValue(1.25);
    expect(speedCtrl?.valid).toBeTruthy();
  });

  it('should test validity of direction field', () => {
    let directionCtrl = component.windForm.get('direction');
    directionCtrl?.setValue(null);
    expect(directionCtrl?.hasError('required')).toBeTruthy();
    directionCtrl?.setValue(-1);
    expect(directionCtrl?.hasError('min')).toBeTruthy();
    directionCtrl?.setValue(361);
    expect(directionCtrl?.hasError('max')).toBeTruthy();
    directionCtrl?.setValue(156);
    expect(directionCtrl?.valid).toBeTruthy();
  });

  it('should test validity of time field', () => {
    let now = Date.now();
    let timeCtrl = component.windForm.get('time');
    timeCtrl?.setValue(null);
    expect(timeCtrl?.hasError('required')).toBeTruthy();
    timeCtrl?.setValue(new Date(now + 1000));
    expect(timeCtrl?.hasError('invalidDate')).toBeTruthy();
    timeCtrl?.setValue(new Date(now - 5000));
    expect(timeCtrl?.valid).toBeTruthy();
  });

  it('should test validity of anemometer_id field', () => {
    let anemometerCtrl = component.windForm.get('anemometer_id');
    anemometerCtrl?.setValue(null);
    expect(anemometerCtrl?.hasError('required')).toBeTruthy();
    anemometerCtrl?.setValue(1);
    expect(anemometerCtrl?.valid).toBeTruthy();
  });

  it('should initialize the anemometers observable', () => {
    expect(component.allAnemometers$).toBeDefined();
  });

  it('should emit the wind\'s formValue on click', () =>{
    let speedCtrl = component.windForm.get('speed');
    speedCtrl?.setValue(1.25);
    let directionCtrl = component.windForm.get('direction');
    directionCtrl?.setValue(156);
    let now = Date.now();
    let timeCtrl = component.windForm.get('time');
    timeCtrl?.setValue(new Date(now - 5000));
    let anemometerCtrl = component.windForm.get('anemometer_id');
    anemometerCtrl?.setValue(1);
    expect(component.windForm.valid).toBeTruthy();

    const createdWindSpy = jest.fn();
    jest.spyOn(component, 'onSubmit');
    let createButton = fixture.debugElement.nativeElement.querySelector('button');
    component.createdWind.subscribe(createdWindSpy);
    createButton.click();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(createdWindSpy).toHaveBeenCalledWith({speed: 1.25, direction: 156, time: new Date(now - 5000), anemometer_id: 1});
  });

  it('should not emit the wind\'s formValue on click', () =>{
    let speedCtrl = component.windForm.get('speed');
    speedCtrl?.setValue(-1);
    expect(component.windForm.valid).toBeFalsy();

    const createdWindSpy = jest.fn();
    jest.spyOn(component, 'onSubmit');
    let createButton = fixture.debugElement.nativeElement.querySelector('button');
    component.createdWind.subscribe(createdWindSpy);
    createButton.click();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(createdWindSpy).toHaveBeenCalledTimes(0);
  });

  it('should set the anemometer control value to the anemometer id', () => {
    component.anemometer_id = 1;
    component.ngOnInit();
    expect(component.windForm.get('anemometer_id')?.value).toBe(1);
  });

});