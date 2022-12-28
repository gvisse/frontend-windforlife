import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../services/auth.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let headerDe: DebugElement;
  let headerEl: HTMLElement;
  let service: AuthService;
  let jwtService: JwtHelperService;
  let httpMock: HttpTestingController;

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule
      ],
      declarations: [HeaderComponent],
      providers: [AuthService, JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    headerDe = fixture.debugElement;
    headerEl = headerDe.nativeElement;

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    jwtService = TestBed.inject(JwtHelperService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a string with user\'s firstname and lastname', () => {
    const userCredentials = { username: 'testuser', password: 'testpassword' };
    const mockResponse = { access: 'mock-token', refresh: 'mock-refresh',  user: {
      id: 1,
      username: 'testuser',
      email: 'testuser@test.com',
      is_superuser: false,
      is_staff: false,
      first_name: 'User',
      last_name: 'Test'}
    };
    
    service.logon(userCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      const request = httpMock.expectOne(`${environment.apiUrl}/login/`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
      expect(component.getUser()).toBe('User Test');
    });
  });

  it('should not return fullname of the user because no user connected', () => {
    expect(component.getUser()).toBe('');
  });

  it('should go to login page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.go('/login');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should logout the user and go to login page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const authSpy = jest.spyOn(service, 'logout');
    component.go('/login', true);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(authSpy).toHaveBeenCalled();
    expect(component.getUser()).toBe('');
  });
});
