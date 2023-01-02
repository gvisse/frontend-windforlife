import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthService } from '../../../core/services/auth.service';

import { LoginComponent } from './login.component';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let service: AuthService;
  let router: Router;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [ LoginComponent ],
      providers: [
        FormBuilder,
        AuthService,
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls and default values', () => {
    expect(component.loginForm).toBeInstanceOf(FormGroup);
    expect(component.loginForm.get('username')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
    expect(component.loginForm.get('username')?.value).toBeNull();
    expect(component.loginForm.get('password')?.value).toBeNull();
  });

  it('should test validity of fields', () => {
    let userCtrl = component.loginForm.get('username');
    userCtrl?.setValue(null);
    expect(userCtrl?.hasError('required')).toBeTruthy();
    let pwdCtrl = component.loginForm.get('password');
    pwdCtrl?.setValue(null);
    expect(pwdCtrl?.hasError('required')).toBeTruthy();
    pwdCtrl?.setValue('123');
    expect(pwdCtrl?.hasError('minlength')).toBeTruthy();
  });

  it('should test validity of form', () => {
    let userCtrl = component.loginForm.get('username');
    userCtrl?.setValue('user');
    let pwdCtrl = component.loginForm.get('password');
    pwdCtrl?.setValue('password');
    expect(component.loginForm.valid).toBeTruthy();
    userCtrl?.setValue(null);
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should change the type of the password input to "text"', () => {
    let passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    component.pwd = { nativeElement: passwordInput } as ElementRef;
    component.showPassword();
    expect(passwordInput.type).toBe('text');
  });

  it('should change the type of the password input to "password"', () => {
    let passwordInput = document.createElement('input');
    passwordInput.type = 'text';
    component.pwd = { nativeElement: passwordInput } as ElementRef;
    component.hidePassword();
    expect(passwordInput.type).toBe('password');
  });

  it('should reset the message property to an empty object', () => {
    component.message = { message: 'Some message', label: '', color: '', icon: '' };
    component.closeAlert();
    expect(component.message).toEqual({ message: '', label: '', color: '', icon: '' });
  });

  it('should return an error message when getFormControlErrorText is called with a required error', () => {
    let ctrl = { hasError: (error: string) => error === 'required' };
    let errorText = component.getFormControlErrorText(ctrl as any);
    expect(errorText).toBe('Ce champ est requis');
  });

  it('should return an error message when getFormControlErrorText is called with an error', () => {
    let ctrl = { hasError: (error: string) => error !== 'required' };
    let errorText = component.getFormControlErrorText(ctrl as any);
    expect(errorText).toBe('Ce champ contient une erreur');
  });

  describe('onLogin method', () => {

    function setCorrectForm(){
      component.loginForm.get('username')?.setValue('user');
      component.loginForm.get('password')?.setValue('password');
    }

    it('should call the logInUser method with the correct arguments if the form is valid', () => {
      const spy = jest.spyOn(service, 'logon');
      setCorrectForm();
      component.onLogin();
      expect(spy).toHaveBeenCalled();
    });

    it('should not call the logInUser method with the arguments if the form is invalid', () => {
      const spy = jest.spyOn(service, 'logon');
      component.loginForm.get('username')?.setValue('user');
      component.loginForm.get('password')?.setValue('pwd');
      component.onLogin();
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should call the logon method of the auth service and navigate to the anemometers page on successful login', () => {
      setCorrectForm();
      jest.spyOn(service, 'logon').mockReturnValue(of({ access: true }));
      jest.spyOn(router, 'navigate');
      component.onLogin();
      expect(service.logon).toHaveBeenCalledWith({username: 'user', password: 'password'});
      expect(router.navigate).toHaveBeenCalledWith(['/anemometer/']);
    });
  
    it('should display an error message if the login fails', () => {
      const error = {error: {non_field_errors: ['Invalid username/password']}, status: 400};
      jest.spyOn(service, 'logon').mockReturnValue(throwError(() => new HttpErrorResponse(error)));
      setCorrectForm();
      component.onLogin();
      fixture.detectChanges();
      expect(component.message).toEqual({
        message: 'Invalid username/password',
        label: '',
        color: 'red',
        icon: 'error',
      });
    });
    
    it('should throw an error if the login fails and not HttpErrorResponse status_code 400', () => {
      jest.spyOn(service, 'logon').mockReturnValue(throwError(() => new Error('test error')));
      setCorrectForm();
      component.onLogin();
      fixture.detectChanges();
      expect(component.message).toEqual(undefined);
    });
  });
});
