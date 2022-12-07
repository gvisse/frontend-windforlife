import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LoggedInUser } from 'src/app/auth/models/user-credentials.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userSubject$!: BehaviorSubject<LoggedInUser|null>;
  public user!: Observable<LoggedInUser|null>;

  constructor(private http:HttpClient, private router: Router){
    this._userSubject$ = new BehaviorSubject(JSON.parse(localStorage.getItem('user')|| '{}'));
    this.user = this._userSubject$.asObservable();
  }

  get userValue(): LoggedInUser|null{
    return this._userSubject$.value;
  }

  private _authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get isAuthenticated$(): Observable<boolean>{
    return this._authSub$.asObservable();
  }

  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  get getToken$(): Observable<string>{
    return this._token$.asObservable();
  }

  login(user : {username: string, password: string}): Observable<LoggedInUser>{
    return this.http.post<LoggedInUser>(
      `${environment.apiUrl}/login/`,
      {username: user.username, password: user.password}
    ).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('userData', JSON.stringify(user));
      this._userSubject$.next(user);
      return user;
  }));
  }

  logout(){
    localStorage.removeItem('user');
    this._userSubject$.next(null);
    this.router.navigate(['/login/']);
  }

}