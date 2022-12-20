import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../services/auth.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule
      ],
      declarations: [ HeaderComponent ],
      providers: [AuthService, JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
