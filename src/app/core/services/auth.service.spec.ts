import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    let url_login = `${environment.apiUrl}/login/`

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService, JwtHelperService,
                { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should logon and return a token', () => {
        const userCredentials = { username: 'testuser', password: 'testpassword' };
        const mockResponse = { token: 'mock-token', user: { username: 'testuser' } };

        service.logon(userCredentials).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const request = httpMock.expectOne(`${url_login}`);
        expect(request.request.method).toBe('POST');
        request.flush(mockResponse);
    });

    it('should refresh the token', () => {
        const mockResponse = { token: 'refreshed-mock-token' };
        service.refreshToken().subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const request = httpMock.expectOne(`${environment.apiUrl}/token/refresh/`);
        expect(request.request.method).toBe('POST');
        request.flush(mockResponse);
    });

    it('should logout and remove the token and user from local storage', () => {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));
        service.logout();
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('should return true if the token is not expired', () => {
        jest.spyOn(service, 'isTokenExpired').mockReturnValue(false);
        expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false if the token is expired', () => {
        jest.spyOn(service, 'isTokenExpired').mockReturnValue(true);
        expect(service.isAuthenticated()).toBe(false);
    });

    // it('should return the token expiration date', () => {
    //     const expirationDate = new Date();
    //     jest.spyOn(service.jwtService, 'getTokenExpirationDate').mockReturnValue(expirationDate);
    //     expect(service.getTokenExpiredDate()).toEqual(expirationDate);
    // });

    it('should return true if the token is close to expiring', () => {
        const expirationDate = new Date(new Date().getTime() + 5 * 60000);
        expect(service.isCloseToExpiring(expirationDate)).toBe(true);
    });

    it('should return false if the token is not close to expiring', () => {
        const expirationDate = new Date(new Date().getTime() + 60 * 60000);
        expect(service.isCloseToExpiring(expirationDate)).toBe(false);
    });

    it('should return the token', () => {
        localStorage.setItem('token', 'mock-token');
        expect(service.getToken()).toEqual('mock-token');
    });

    it('should return the user', () => {
        const user = { username: 'testuser' };
        localStorage.setItem('user', JSON.stringify(user));
        expect(service.getUser()).toEqual(user);
    });
});