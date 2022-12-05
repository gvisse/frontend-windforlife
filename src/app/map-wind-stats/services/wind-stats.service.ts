import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, BehaviorSubject} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class WindStatsService {

  constructor(private http: HttpClient){}
    
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _min$ = new BehaviorSubject<number>(0);
  get min$(): Observable<number> {
    return this._min$.asObservable();
  }

  private _max$ = new BehaviorSubject<number>(0);
  get max$(): Observable<number> {
    return this._max$.asObservable();
  }

  private _mean$ = new BehaviorSubject<number>(0);
  get mean$(): Observable<number> {
    return this._mean$.asObservable();
  }

  getStats(central_point: {lng: number, lat: number}, radius: number): Observable<{min:number, max: number, mean: number}>{
    const coordinates = central_point.lat + ',' + central_point.lng
    const url = `${environment.apiUrl}/wind-stats?central_point=${coordinates}&radius=${radius}`
    return this.http.get<{min:number, max: number, mean: number}>(url).pipe(
      tap((stats:any) => {
        this._min$.next(stats['min']);
        this._max$.next(stats['max']);
        this._mean$.next(stats['mean']);
      })
    );
  }
}