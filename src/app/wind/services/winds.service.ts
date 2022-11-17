import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, tap } from 'rxjs';
import { Wind } from 'src/app/wind/models/wind.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class WindsService {
  constructor(private http: HttpClient){}
    
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _winds$ = new BehaviorSubject<Wind[]>([]);
  get winds$(): Observable<Wind[]> {
    return this._winds$.asObservable();
  }
  
  private setLoadingStatus(loading: boolean){
    this._loading$.next(loading);
  }

  private lastWindsLoaded = 0;

  getWindsFromServeur(){
    if (Date.now() - this.lastWindsLoaded <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.http.get<Wind[]>(`${environment.apiUrl}/wind/`).pipe(
      delay(1000),
      tap(winds => {
        this.lastWindsLoaded = Date.now();
        this._winds$.next((winds as any)['results']);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getWindsAnemometerByAnemometerId(id: number): Observable<Wind[]> {    
    return this.http.get<Wind[]>(`${environment.apiUrl}/wind?anemometer_id=${id}`).pipe(
      map((data: any) => data['results'])
    );
  }
}