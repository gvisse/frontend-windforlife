import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User, UserCredentials } from '../../auth/models/user-credentials.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user?: User;
  private url_login = `${environment.apiUrl}/login/`;
  private userSource = new ReplaySubject<User>(1);
  userActivate$ = this.userSource.asObservable();

  constructor(private http: HttpClient,
              private jwtService: JwtHelperService) {
  }
  /**
   * Authentification /api-token-auth/
   * @param {UserCredentials} user : l'utilisateur a connecté
   * @return any dont token
   */ 
  logon(user: UserCredentials): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', Accept: 'application/json'
    });
    return this.http
      .post(this.url_login, { username: user.username, password: user.password }, {headers})
      .pipe(map(dataJwt => this._authenticated(dataJwt)));
  }
  /**
   Déconnexion, on supprime tout ce qui est relatif au connecté et son 
   token 
  */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    if(!this.isTokenExpired()){
      if(this.isCloseToExpiring(this.getTokenExpiredDate())){
        this.refreshToken().subscribe();
      }
      return true;
    }
    else{
      if(this.getToken()){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return false;
    }
  }

  isCloseToExpiring(expiration_date: Date | null){
    if(expiration_date){
      return new Date(new Date().getTime() + 5 * 60000) >= expiration_date;
    } else return; 
  }

  isTokenExpired() {
    return this.jwtService.isTokenExpired();
  }

  getTokenExpiredDate() {
    return this.jwtService.getTokenExpirationDate();
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  getUser(): User{
    return JSON.parse(localStorage.getItem('user') || '{"first_name":"", "last_name":""}');
  }

  refreshToken(): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', Accept: 'application/json'
    });
    return this.http.post(`${environment.apiUrl}/token/refresh/`, {'token': this.getToken()}, {headers})
      .pipe(
        map((token: any) => localStorage.setItem("token", token['token']))
      );
  }

  /**
   * Stockage du token et de quelques informations user
   * @param data
   * @private
   */
  private _authenticated(data: any): User {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.userSource.next(data.user as User);
    return data;
  }
}